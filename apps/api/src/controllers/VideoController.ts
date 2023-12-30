import axios from 'axios';
import { FastifyReply, FastifyRequest } from 'fastify';

import { randomUUID } from 'node:crypto';
import { buffer } from 'node:stream/consumers';

import { getPreSignedUrl } from '../lib/getPreSignedUrl';
import { Video } from '../models/Video';

export class VideoController {
  private video;
  private domainUrl;

  constructor() {
    this.video = new Video();
    this.domainUrl = process.env.DOMAIN_URL as string;
  }

  uploadAndCreate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file();

      if (!data) return reply.status(400).send({ error: 'Missing file input' });

      const { file, filename, mimetype } = data;

      if (mimetype !== 'audio/mpeg')
        return reply.status(400).send({ error: 'Invalid file type' });

      const fileUploadName = randomUUID().concat(`-${filename}`);
      const preSignedUrl = await getPreSignedUrl(fileUploadName);
      const fileToUpload = await buffer(file);

      const uploadToR2Response = await axios.put(preSignedUrl, fileToUpload, {
        headers: {
          'Content-Type': mimetype,
        },
      });

      if (uploadToR2Response.statusText !== 'OK')
        return reply.status(400).send({ error: 'Failed to upload file' });

      const fileUploadedUrl = this.domainUrl.concat(filename);
      const videoCreated = this.video.createVideo(filename, fileUploadedUrl);

      return videoCreated;
    } catch (error) {
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  };
}
