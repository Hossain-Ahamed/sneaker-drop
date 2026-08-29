import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";
import { dropQueryKeys } from "@/features/drop";
import type { TResponse } from "@/shared/types";
import { reservationAPIEndpoints } from "./endpoints.reservation";
import type { IReservationType } from "../types";

export const ReservationAPI = {
  /** reserve a drop
   * one unit
   */
  useCreateReservationMutation: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (
        payload: IReservationType.CreateReservationPayload,
      ) => {
        const res = await api.post<TResponse<IReservationType.IReservation>>(
          reservationAPIEndpoints.create,
          payload,
        );
        return res.data.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: dropQueryKeys.all });
      },
    });
  },
};
