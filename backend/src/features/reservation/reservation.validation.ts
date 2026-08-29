import { z } from "zod";

export class ReservationValidationSchema {
  static createReservationSchema = z.object({
    body: z.object({
      drop_id: z.string().min(1, "drop id is required"),
    }),
  });
}

export namespace IReservationValidation {
  /** Create Reservation DTO */
  export type CreateReservationInput = z.infer<
    typeof ReservationValidationSchema.createReservationSchema
  >["body"];
}
