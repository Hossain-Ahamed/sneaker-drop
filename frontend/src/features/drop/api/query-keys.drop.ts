export const dropQueryKeys = {
  all: ["drop"] as const,
  lists: () => [...dropQueryKeys.all, "list"] as const,
};
