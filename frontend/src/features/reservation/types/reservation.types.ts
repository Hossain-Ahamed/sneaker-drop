export namespace IReservationType {
  export type ReservationStatus = "ACTIVE" | "COMPLETED" | "EXPIRED";

  export type IReservation = {
    id: string;
    status: ReservationStatus;
    expires_at: string;
    created_at: string;
    user_id: string;
    drop_id: string;
  };

  export type CreateReservationPayload = {
    drop_id: string;
  };
}
