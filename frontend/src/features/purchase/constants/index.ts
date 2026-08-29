/** Socket events this feature listens for — names must match backend PURCHASE_CONSTANTS */
export const PURCHASE_EVENTS = {
  NEW_PURCHASE: "activity:new-purchase",
} as const;

export const RECENT_PURCHASERS_LIMIT = 3;
