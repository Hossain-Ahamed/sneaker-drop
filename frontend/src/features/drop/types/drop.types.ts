export namespace IDropType {
  export type IPurchaserInfo = {
    name: string;
    username: string;
    purchased_at: string;
  };

  export type IDrop = {
    id: string;
    name: string;
    price: number;
    total_stock: number;
    available_stock: number;
    starts_at: string;
    created_at: string;
    recent_purchasers: IPurchaserInfo[];
  };

  export type CreateDropPayload = {
    name: string;
    price: number;
    total_stock: number;
    starts_at: string;
  };
}
