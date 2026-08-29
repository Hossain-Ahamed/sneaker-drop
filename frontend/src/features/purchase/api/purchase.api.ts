import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";
import { dropQueryKeys } from "@/features/drop";
import type { TResponse } from "@/shared/types";
import { purchaseAPIEndpoints } from "./endpoints.purchase";
import type { IPurchaseType } from "../types";

export const PurchaseAPI = {
  useCreatePurchaseMutation: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (payload: IPurchaseType.CreatePurchasePayload) => {
        const res = await api.post<TResponse<IPurchaseType.IPurchase>>(
          purchaseAPIEndpoints.create,
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
