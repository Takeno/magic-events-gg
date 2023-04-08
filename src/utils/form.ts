import {ZodError} from 'zod';

export function mapZodErrorToFinalForm(error: ZodError) {
  return error.formErrors;
}
