import { z } from 'zod';
import { USER_CONSTANTS } from './user.constant';

export class UserValidationSchema {
  static createUserSchema = z.object({
    body: z.object({
      username: z
        .string()
        // trim first, so a whitespace-only username fails the length check
        .trim()
        .min(1, 'Username is required')
        .max(
          USER_CONSTANTS.USERNAME_MAX_LENGTH,
          `Username must be at most ${USER_CONSTANTS.USERNAME_MAX_LENGTH} characters`,
        )
        // it is rendered as @username in the activity feed, so keep it handle-shaped
        .regex(
          USER_CONSTANTS.USERNAME_PATTERN,
          'Username may only contain letters, numbers, dots, underscores and hyphens',
        ),
      name: z
        .string()
        .trim()
        .min(1, 'Name is required')
        .max(
          USER_CONSTANTS.NAME_MAX_LENGTH,
          `Name must be at most ${USER_CONSTANTS.NAME_MAX_LENGTH} characters`,
        ),
    }),
  });

  static signInSchema = z.object({
    body: z.object({
      username: z.string().trim().min(1, 'Username is required'),
    }),
  });

  static getUserSchema = z.object({
    params: z.object({
      user_id: z.string().min(1, 'User id is required'),
    }),
  });
}

export namespace IUserValidation {
  /** Create User DTO */
  export type CreateUserInput = z.infer<typeof UserValidationSchema.createUserSchema>['body'];
}
