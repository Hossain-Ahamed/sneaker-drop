// drop constant
export const DROP_CONSTANTS = {
  STOCK_UPDATED_EVENT: "stock:updated",
  RECENT_PURCHASERS_LIMIT: 3,
  PRICE_FLOAT_LIMIT: 0.01,
  MAX_PRICE: 99_999_999.99,
  PREVIOUS_TIME_TOLERANCE_MS: 60 * 1000,
} as const;

/** Room for per Drop*/
export function dropRoom(dropId: string): string {
  return `drop:${dropId}`;
}
