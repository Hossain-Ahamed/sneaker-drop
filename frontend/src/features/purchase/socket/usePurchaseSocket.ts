import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { onEvent } from "@/shared/lib/socket";
import { dropQueryKeys, type IDropType } from "@/features/drop";
import { PURCHASE_EVENTS, RECENT_PURCHASERS_LIMIT } from "../constants";
import type { IPurchaseType } from "../types";

export function usePurchaseSocket(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    return onEvent<IPurchaseType.TNewPurchase>(
      PURCHASE_EVENTS.NEW_PURCHASE,
      (payload) => {
        queryClient.setQueryData<IDropType.IDrop[]>(
          dropQueryKeys.lists(),
          (prev) =>
            prev?.map((drop) =>
              drop.id === payload.drop_id
                ? {
                    ...drop,
                    recent_purchasers: [
                      {
                        name: payload.name,
                        username: payload.username,
                        purchased_at: payload.purchased_at,
                      },
                      ...drop.recent_purchasers,
                    ].slice(0, RECENT_PURCHASERS_LIMIT),
                  }
                : drop,
            ),
        );
      },
    );
  }, [queryClient]);
}
