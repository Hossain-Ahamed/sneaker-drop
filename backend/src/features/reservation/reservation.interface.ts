export namespace IReservationType {
  export type CreateReservationDTO = {
    drop_id: string;
    user_id: string;
  };

  export type ReservationStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED';

  export type IReservation = {
    id: string;
    status: ReservationStatus;
    expires_at: Date;
    created_at: Date;
    user_id: string;
    drop_id: string;
  };
}
