import { Separator } from "@/components/ui/separator";
import type { IDropType } from "../types";
import { calulateTimeGap } from "@/utils/calulateTimeGap";
export function DropActivityFeed({
  purchasers,
}: {
  purchasers: IDropType.IPurchaserInfo[];
}) {
  if (!purchasers.length) {
    return (
      <div className="w-full">
        <Separator className="mb-3" />
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          No purchases yet
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Separator className="mb-3" />
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        Recent purchases
      </p>

      <ul className="space-y-1.5">
        {purchasers.map((purchaser) => (
          <li
            key={`${purchaser.username}-${purchaser.purchased_at}`}
            className="flex items-baseline justify-between gap-2 text-xs"
          >
            <span className="min-w-0 truncate">
              <span className="font-medium">{purchaser.name}</span>{" "}
              <span className="text-muted-foreground">
                (@{purchaser.username})
              </span>
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {calulateTimeGap(purchaser.purchased_at)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
