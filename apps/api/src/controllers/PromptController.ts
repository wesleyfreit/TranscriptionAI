import { FastifyReply, FastifyRequest } from 'fastify';
import { Prompt } from '../models/Prompt';

export class PromptController {
  private prompt;

  constructor() {
    this.prompt = new Prompt();
  }

  findAll = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const prompts = await this.prompt.getAllPrompts();
      return prompts;
    } catch (error) {
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  };
}
