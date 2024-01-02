import { FastifyInstance } from 'fastify';
import { PromptController } from '../controllers/PromptController';

const promptController = new PromptController();

export const promptRoutes = async (app: FastifyInstance) => {
  app.get('/prompts', promptController.findAll);
  app.post('/prompts', promptController.generateAiComplete);
};
