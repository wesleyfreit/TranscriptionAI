import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { OpenAIStream, streamToResponse } from 'ai';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

import { openai } from '../config/openai';
import { capitalizeFirstLetter } from '../lib/capitalizeFirstLetter';
import { getValidationError } from '../lib/getValidationError';
import { numOfTokensFromString } from '../lib/numOfTokensFromString';
import { Prompt } from '../models/Prompt';
import { Video } from '../models/Video';
import { aiCompleteSchema } from '../schemas/aiCompleteSchema';

export class PromptController {
  private prompt;
  private video;
  private origin;

  constructor() {
    this.prompt = new Prompt();
    this.video = new Video();
    this.origin = process.env.ORIGIN_URL;
  }

  findAll = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const prompts = await this.prompt.getAllPrompts();
      return prompts;
    } catch (error) {
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  };

  generateAiComplete = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { videoId, prompt, temperature } = aiCompleteSchema.parse(request.body);

      const video = await this.video.findVideo(videoId);

      if (!video.transcription) {
        return reply.status(400).send({ error: 'Video transcription not found' });
      }

      const promptMessage = prompt.replace('{transcription}', video.transcription);

      const numOfTokens = numOfTokensFromString(promptMessage);
      const model = numOfTokens > 4096 ? 'gpt-3.5-turbo-16k' : 'gpt-3.5-turbo';

      const response = await openai.chat.completions.create({
        model,
        temperature,
        messages: [{ role: 'user', content: promptMessage }],
        stream: true,
      });

      const stream = OpenAIStream(response);

      streamToResponse(stream, reply.raw, {
        headers: {
          'Access-Control-Allow-Origin': `${this.origin}`,
          'Access-Control-Allow-Methods': 'POST',
        },
      });
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
