import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ReservationAPI, useReservationStore } from "@/features/reservation";
import { PurchaseAPI } from "@/features/purchase";
import { UserAPI } from "@/features/user";
import type { IDropType } from "../types";
import { formatTime } from "@/utils/formatTime";

type DropActionsProps = {
  drop: IDropType.IDrop;
  hasStarted: boolean;
  isSoldOut: boolean;
  remainingSecondToPurchase: number;
};

/** The drop's start time in the viewer's own timezone */

/** Reserve / complete-purchase controls for one drop, with its hold countdown */
export function DropActions({
  drop,
  hasStarted,
  isSoldOut,
  remainingSecondToPurchase,
}: DropActionsProps) {
  const { data: currentUser, isPending: isLoadingUser } =
    UserAPI.useCurrentUser();

  const reservedItems = useReservationStore(
    (state) => state.reservations[drop.id],
  );
  const addReservation = useReservationStore((state) => state.addReservation);
  const removeReservation = useReservationStore(
    (state) => state.removeReservations,
  );

  const { mutate: reserve, isPending: isReserving } =
    ReservationAPI.useCreateReservationMutation();
  const { mutate: purchase, isPending: isPurchasing } =
    PurchaseAPI.useCreatePurchaseMutation();

  const reservationExpired = Boolean(reservedItems) && remainingSecondToPurchase <= 0;

  const handleReserve = () => {
    if (!currentUser) return;

    reserve(
      { drop_id: drop.id },
      {
        onSuccess: (reservation) => {
          addReservation(drop.id, {
            id: reservation.id,
            expires_at: reservation.expires_at,
          });
          toast.success(`Reserved ${drop.name}. Complete purchase within 60s`);
        },
        onError: (error) => {
          if (error.statusCode === 409) {
            toast.error(`Oops! ${drop.name} is out of stock`);
            return;
          }
          toast.error(error.message);
        },
      },
    );
  };

  const handlePurchase = () => {
    if (!currentUser || !reservedItems) return;

    purchase(
      { reservation_id: reservedItems.id },
      {
        onSuccess: () => {
          removeReservation(drop.id);
          toast.success(`Purchased ${drop.name}`);
        },
        onError: (error) => {
          // 400 for expired, 409 for lost race condition
          if (error.statusCode === 400 || error.statusCode === 409) {
            removeReservation(drop.id);
          }
          toast.error(error.message);
        },
      },
    );
  };

  if (!hasStarted) {
    return (
      <div className="w-full">
        <Button className="w-full" disabled variant="outline">
          Starts {formatTime(drop.starts_at)}
        </Button>
      </div>
    );
  }

  if (reservedItems && !reservationExpired) {
    return (
      <div className="flex w-full items-center gap-3">
        <Button
          className="flex-1"
          onClick={handlePurchase}
          disabled={isPurchasing}
        >
          {isPurchasing ? "Completing…" : "Complete Purchase"}
        </Button>
        <span className="text-sm tabular-nums text-muted-foreground">
          {remainingSecondToPurchase}s
        </span>
      </div>
    );
  }

  return (
    <Button
      className="w-full"
      variant={reservationExpired ? "outline" : "default"}
      onClick={handleReserve}
      disabled={isSoldOut || isReserving || isLoadingUser || !currentUser}
    >
      {isSoldOut
        ? "Sold out"
        : isReserving
          ? "Reserving…"
          : reservationExpired
            ? "Reserve Again"
            : "Reserve"}
    </Button>
  );
}
