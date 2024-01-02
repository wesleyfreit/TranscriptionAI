import { z } from 'zod';

export const transcriptionSchema = z.object({
  prompt: z.string(),
});
