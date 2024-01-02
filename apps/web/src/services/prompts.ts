import { api } from '@/services/api';

export const getPrompts = async () => {
  const promptsResponse = await api.get('/prompts');

  return promptsResponse;
};
