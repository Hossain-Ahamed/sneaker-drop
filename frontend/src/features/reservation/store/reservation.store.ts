import { create } from "zustand";
import { persist } from "zustand/middleware";


function removeExpiredReservations(
  held: Record<string, TReservations>,
): Record<string, TReservations> {
  const live: Record<string, TReservations> = {};

  for (const [dropId, reservation] of Object.entries(held)) {
    if (new Date(reservation.expires_at).getTime() > Date.now()) {
      live[dropId] = reservation;
    }
  }

  return live;
}
type TReservations = {
  id: string;
  expires_at: string;
};

type TReservationState = {
  reservations: Record<string, TReservations>;
  addReservation: (dropId: string, reservation: TReservations) => void;
  removeReservations: (dropId: string) => void;
  removeExpiredReservations: () => void;
  clearAllReservations: () => void;
};
export const useReservationStore = create<TReservationState>()(
  persist(
    (set) => ({
      reservations: {},
      addReservation: (dropId, reservation) =>
        set((state) => ({
          reservations: { ...state.reservations, [dropId]: reservation },
        })),
      removeReservations: (dropId) =>
        set((state) => {
          const rest = { ...state.reservations };
          delete rest[dropId];
          return { reservations: rest };
        }),
      removeExpiredReservations: () =>
        set((state) => ({ reservations: removeExpiredReservations(state.reservations) })),
      clearAllReservations: () => set({ reservations: {} }),
    }),
    {
      name: "sneaker-drop.my-reservations",
      merge: (persisted, current) => ({
        ...current,
        reservations: removeExpiredReservations(
          (persisted as TReservationState | undefined)?.reservations ?? {},
        ),
      }),
      onRehydrateStorage: () => (state) => state?.removeExpiredReservations(),
    },
  ),
);
