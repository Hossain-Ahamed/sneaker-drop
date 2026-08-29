export namespace IDropType {
  export type CreateDropDTO = {
    name: string;
    price: number;
    total_stock: number;
    starts_at: Date;
  };

  export type IDrop = {
    id: string;
    name: string;
    price: number;
    total_stock: number;
    available_stock: number;
    starts_at: Date;
    created_at: Date;
  };
}
