import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Prompt {
  private prompt;

  constructor() {
    this.prompt = prisma.prompt;
  }

  getAllPrompts = async () => {
    const prompts = await this.prompt.findMany();
    return prompts;
  };
}
