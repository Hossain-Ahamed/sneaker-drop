/** Socket events this feature listens for — names must match backend DROP_CONSTANTS */
export const DROP_EVENTS = {
  STOCK_UPDATED: "stock:updated",
} as const;

/** Room for one drop — must match the backend's dropRoom() */
export function dropRoom(dropId: string): string {
  return `drop:${dropId}`;
}
