import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { joinRoom, onEvent } from "@/shared/lib/socket";
import { dropQueryKeys } from "../api";
import { DROP_EVENTS, dropRoom } from "../constants";
import type { IDropType } from "../types";

/** Joins each visible drop's room and folds stock:updated into the drops cache */
/**
 * Join to every drop's room
 *
 * @param dropIds
 */
export function useDropSocket(dropIds: string[]): void {
  const queryClient = useQueryClient();

  const roomKey = dropIds.join(","); // used array for dependency
  const rooms = useMemo(() => (roomKey ? roomKey.split(",") : []), [roomKey]);

  useEffect(() => {
    const leaves = rooms.map((id) => joinRoom(dropRoom(id)));
    return () => leaves.forEach((leave) => leave());
  }, [rooms]);

  useEffect(() => {
    return onEvent<IDropType.TStockUpdated>(
      DROP_EVENTS.STOCK_UPDATED,
      (payload) => {
        queryClient.setQueryData<IDropType.IDrop[]>(
          dropQueryKeys.lists(),
          (prev) =>
            prev?.map((drop) =>
              drop.id === payload.drop_id
                ? { ...drop, available_stock: payload.available_stock }
                : drop,
            ),
        );
      },
    );
  }, [queryClient]);
}
