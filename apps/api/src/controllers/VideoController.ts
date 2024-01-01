import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import axios from 'axios';
import { FastifyReply, FastifyRequest } from 'fastify';
import FormData from 'form-data';
import { ZodError } from 'zod';

import { Buffer } from 'node:buffer';
import { randomUUID } from 'node:crypto';
import { basename, extname } from 'node:path';
import { Readable } from 'node:stream';

import { capitalizeFirstLetter } from '../lib/capitalizeFirstLetter';
import { getPreSignedUrl } from '../lib/getPreSignedUrl';
import { getValidationError } from '../lib/getValidationError';
import { Video } from '../models/Video';
import { paramsSchema } from '../schemas/paramsSchema';
import { transcriptionSchema } from '../schemas/transcriptionSchema';

export class VideoController {
  private video;
  private downloadUrl;

  constructor() {
    this.video = new Video();
    this.downloadUrl = process.env.DOWNLOAD_URL;
  }

  uploadAndCreate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file();

      if (!data) return reply.status(400).send({ error: 'Missing file input' });

      const { filename, mimetype } = data;

      if (mimetype !== 'audio/mpeg')
        return reply.status(400).send({ error: 'Invalid file type' });

      const fileUploadName = randomUUID().concat(`_${filename.replace(/ /g, '_')}`);
      const preSignedUrl = await getPreSignedUrl(fileUploadName);

      const file = await data.toBuffer();

      const uploadToR2Response = await axios.put(preSignedUrl, file, {
        headers: {
          'Content-Type': mimetype,
        },
      });

      if (uploadToR2Response.statusText !== 'OK')
        return reply.status(400).send({ error: 'Failed to upload file' });

      const extension = extname(filename);
      const fileBaseName = basename(filename, extension);
      const fileDownloadUrl = `/${fileUploadName}`;

      const videoCreated = await this.video.createVideo(fileBaseName, fileDownloadUrl);

      return videoCreated;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        return reply.status(500).send({ error: capitalizeFirstLetter(error.message) });

      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  };

  setTranscription = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = paramsSchema.parse(request.params);
      const { prompt, temperature } = transcriptionSchema.parse(request.body);

      const video = await this.video.findVideo(id);
      const audioUrl = `${this.downloadUrl?.concat(video.path)}`;

      const getAudioResponse = await axios.get(audioUrl, {
        responseType: 'arraybuffer',
      });

      const audioBuffer = Buffer.from(getAudioResponse.data);
      const audioStream = Readable.from(audioBuffer);

      const formData = new FormData();
      formData.append('model', 'whisper-1');
      formData.append('file', audioStream, {
        filename: video.name,
        contentType: 'audio/mpeg',
      });
      formData.append('language', 'pt');
      formData.append('response_format', 'json');
      formData.append('temperature', temperature);
      formData.append('prompt', prompt);

      const transcriptionResponse = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${process.env.AI_KEY}`,
          },
        },
      );

      const transcription = transcriptionResponse.data.text;

      await this.video.createTranscription(id, transcription);

      return transcription;
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = getValidationError(error.errors);
        return reply.status(400).send({ error: validationError });
      }
      if (error instanceof PrismaClientKnownRequestError)
        return reply.status(500).send({ error: capitalizeFirstLetter(error.message) });

      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  };
}
