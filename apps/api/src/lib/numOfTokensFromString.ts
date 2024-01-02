import { encoding_for_model } from 'tiktoken';

export const numOfTokensFromString = (str: string) => {
  const encoder = encoding_for_model('gpt-3.5-turbo');
  const numberOfTokens = encoder.encode(str).length;
  encoder.free();
  return numberOfTokens;
};
