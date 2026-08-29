export const reservationQueryKeys = {
  all: ["reservation"] as const,
  reservationInfo: (id: string) => [...reservationQueryKeys.all, "detail", id] as const,
};
