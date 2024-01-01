import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import axios from 'axios';
import { FastifyReply, FastifyRequest } from 'fastify';

import { randomUUID } from 'node:crypto';
import { basename, extname } from 'node:path';

import { capitalizeFirstLetter } from '../lib/capitalizeFirstLetter';
import { getPreSignedUrl } from '../lib/getPreSignedUrl';
import { Video } from '../models/Video';

export class VideoController {
  private video;

  constructor() {
    this.video = new Video();
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

      const videoCreated = await this.video.createVideo(fileBaseName, fileUploadName);

      return videoCreated;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        return reply.status(500).send({ error: capitalizeFirstLetter(error.message) });

      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  };
}
