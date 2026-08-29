import { z } from "zod";

export class PurchaseValidationSchema {
  static createPurchaseSchema = z.object({
    body: z.object({
      reservation_id: z.string().min(1, "Reservation id is required"),
      user_id: z.string().min(1, "User id is required"),
    }),
  });
}

export namespace IPurchaseValidation {
  /** Create Purchase DTO */
  export type CreatePurchaseInput = z.infer<
    typeof PurchaseValidationSchema.createPurchaseSchema
  >["body"];
}
