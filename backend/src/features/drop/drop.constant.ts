// drop constant
export const DROP_CONSTANTS = {
  STOCK_UPDATED_EVENT: "stock:updated",
  /** how many recent purchasers ride along with each drop in the listing */
  RECENT_PURCHASERS_LIMIT: 3,
} as const;

/** Room for per Drop*/
export function dropRoom(dropId: string): string {
  return `drop:${dropId}`;
}
