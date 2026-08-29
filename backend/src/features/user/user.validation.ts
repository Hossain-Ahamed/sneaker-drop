import { z } from 'zod';

export class UserValidationSchema {
  static createUserSchema = z.object({
    body: z.object({
      username: z.string().min(1, 'Username is required'),
      name: z.string().min(1, 'Name is required'),
    }),
  });
}

export namespace IUserValidation {
  /** Create User DTO */
  export type CreateUserInput = z.infer<typeof UserValidationSchema.createUserSchema>['body'];
}
