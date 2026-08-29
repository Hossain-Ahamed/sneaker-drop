export namespace IDropType {
  export type CreateDropDTO = {
    name: string;
    price: number;
    total_stock: number;
    starts_at: Date;
  };

  export type IRecentPurchaser = {
    name: string;
    username: string;
    purchased_at: Date;
  };

  export type IDrop = {
    id: string;
    name: string;
    price: number;
    total_stock: number;
    available_stock: number;
    starts_at: Date;
    created_at: Date;
    recent_purchasers: IRecentPurchaser[];
  };

  export type TStockUpdated = {
    drop_id: string;
    available_stock: number;
  };
}
