export const purchaseQueryKeys = {
  all: ["purchase"] as const,
  detail: (id: string) => [...purchaseQueryKeys.all, "detail", id] as const,
};
