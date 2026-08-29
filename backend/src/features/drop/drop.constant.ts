// drop constant
export const DROP_CONSTANTS = {
  STOCK_UPDATED_EVENT: "stock:updated",
} as const;

/** Room for per Drop*/
export function dropRoom(dropId: string): string {
  return `drop:${dropId}`;
}
