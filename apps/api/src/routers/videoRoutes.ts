import { FastifyInstance } from 'fastify';
import { VideoController } from '../controllers/VideoController';

const videoController = new VideoController();

export const videoRoutes = async (app: FastifyInstance) => {
  app.post('/videos', videoController.uploadAndCreate);
  app.post('/videos/:id/transcription', videoController.setTranscription);
};
