export namespace IPurchaseType {
  export type CreatePurchaseDTO = {
    reservation_id: string;
    user_id: string;
  };

  export type IPurchase = {
    id: string;
    purchased_at: Date;
    user_id: string;
    drop_id: string;
    reservation_id: string;
  };
  export type TNewPurchase = {
    drop_id: string;
    drop_name : string;
    purchased_at: Date;
    name : string;
    username: string;
  };
}
