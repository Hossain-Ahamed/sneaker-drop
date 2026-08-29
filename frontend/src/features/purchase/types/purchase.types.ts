export namespace IPurchaseType {
  export type IPurchase = {
    id: string;
    purchased_at: string;
    user_id: string;
    drop_id: string;
    reservation_id: string;
  };

  export type CreatePurchasePayload = {
    reservation_id: string;
  };

  /** Payload of the activity:new-purchase socket event */
  export type TNewPurchase = {
    drop_id: string;
    drop_name: string;
    purchased_at: string;
    name: string;
    username: string;
  };
}
