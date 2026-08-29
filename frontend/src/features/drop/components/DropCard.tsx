import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IDropType } from "../types";

type DropCardProps = { drop: IDropType.IDrop };

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function DropCard({ drop }: DropCardProps) {
  const isSoldOut = drop.available_stock <= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{drop.name}</CardTitle>
        <CardDescription>{formatPrice(drop.price)}</CardDescription>
        <CardAction>
          <Badge variant={isSoldOut ? "destructive" : "secondary"}>
            {isSoldOut ? "Sold out" : "Live"}
          </Badge>
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
    </Card>
  );
}
