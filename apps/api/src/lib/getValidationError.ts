import { ZodIssue } from 'zod';
import { capitalizeFirstLetter } from './capitalizeFirstLetter';

export const getValidationError = (errors: ZodIssue[]) => {
  const path = errors[0]?.path[0]?.toString() || '';
  const message = errors[0]?.message.toString() || '';

  const errorMessage = capitalizeFirstLetter(path)
    .concat(' ')
    .concat(message?.toLowerCase());

  return errorMessage;
};
