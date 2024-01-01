import { z } from 'zod';

export const transcriptionSchema = z.object({
  temperature: z.string(),
  prompt: z.string(),
});
