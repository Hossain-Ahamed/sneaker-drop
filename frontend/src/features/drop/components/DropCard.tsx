import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCountdown, useReservationStore } from "@/features/reservation";
import { useHasStarted } from "../hooks/useHasStarted";
import { DropActions } from "./DropActions";
import { DropActivityFeed } from "./DropActivityFeed";
import type { IDropType } from "../types";
import { formatPrice } from "@/utils/formatPrice";

export function DropCard({ drop }: { drop: IDropType.IDrop }) {
  const isSoldOut = drop.available_stock <= 0;

  const reservedDrops = useReservationStore((state) => state.reservations[drop.id]);
  const remainingSecondToPurchase = useCountdown(reservedDrops?.expires_at ?? null);
  
  const isReserved = Boolean(reservedDrops) && remainingSecondToPurchase > 0;
  const hasStarted = useHasStarted(drop.starts_at);

  return (
    <Card className={isReserved ? "ring-2 ring-primary" : undefined}>
      <CardHeader>
        <CardTitle className="truncate">{drop.name}</CardTitle>
        <CardDescription>{formatPrice(drop.price)}</CardDescription>
        <CardAction>
          {isReserved ? (
            <Badge>Reserved</Badge>
          ) : !hasStarted ? (
            <Badge variant="outline">Upcoming</Badge>
          ) : (
            <Badge variant={isSoldOut ? "destructive" : "secondary"}>
              {isSoldOut ? "Sold out" : "Live"}
            </Badge>
          )}
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums">
            {drop.available_stock}
          </span>
          <span className="text-sm text-muted-foreground">
            of {drop.total_stock} left
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-4">
        <DropActions
          drop={drop}
          hasStarted={hasStarted}
          isSoldOut={isSoldOut}
          remainingSecondToPurchase={remainingSecondToPurchase}
        />
        <DropActivityFeed purchasers={drop.recent_purchasers} />
      </CardFooter>
    </Card>
  );
}
