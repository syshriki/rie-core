import { z } from 'zod';

export const SignUpRequestBodySchema = z.object({
  idToken: z.string(),
});

export type SignUpRequestBody = z.infer<typeof SignUpRequestBodySchema>;
