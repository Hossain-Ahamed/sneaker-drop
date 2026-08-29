import { z } from "zod";
import { DROP_CONSTANTS } from "./drop.constant";

export class DropValidationSchema {
  static createDropSchema = z.object({
    body: z.object({
      name: z
        .string()
        .trim()
        .min(1, "Item name is required")
        .max(120, `Item name must be at most 120 characters`),
      price: z
        .number()
        .positive("Price must be a positive number")
        .max(DROP_CONSTANTS.MAX_PRICE, "Price is too large")
        .multipleOf(
          DROP_CONSTANTS.PRICE_FLOAT_LIMIT,
          "Price must be in whole cents (at most 2 decimal places)",
        ),
      total_stock: z
        .number()
        .int()
        .positive("Total Stock must be positive integer"),
      starts_at: z.coerce
        .date()
        .refine(
          (date) =>
            date.getTime() >=
            Date.now() - DROP_CONSTANTS.PREVIOUS_TIME_TOLERANCE_MS,
          "Drop start time cannot be in the past",
        ),
    }),
  });
}

export namespace IDropValidation {
  export type CreateDropInput = z.infer<
    typeof DropValidationSchema.createDropSchema
  >["body"];
}
