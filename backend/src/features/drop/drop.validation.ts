import { z } from 'zod';

export class DropValidationSchema {
  static createDropSchema = z.object({
    body: z.object({
      name: z.string().min(1, 'Item name is required'),
      price: z.number().positive('Price must be a positive number'),
      totalStock: z.number().int().positive('Total Stock must be positive integer'),
      startsAt: z.coerce.date(),
    }),
  });
}

export namespace IDropValidation {
  export type CreateDropInput = z.infer<typeof DropValidationSchema.createDropSchema>['body'];
}
