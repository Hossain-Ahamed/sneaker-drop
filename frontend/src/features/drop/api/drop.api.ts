import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";
import type { TResponse } from "@/shared/types";
import { dropAPIEndpoints } from "./endpoints.drop";
import { dropQueryKeys } from "./query-keys.drop";
import type { IDropType } from "../types";

export const DropAPI = {

  useDrops: () =>
    useQuery({
      queryKey: dropQueryKeys.lists(),
      queryFn: async () => {
        const res = await api.get<TResponse<IDropType.IDrop[]>>(
          dropAPIEndpoints.list,
        );
        return res.data.data;
      },
    }),

  /** Creates a drop */
  useCreateDrop: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (payload: IDropType.CreateDropPayload) => {
        const res = await api.post<TResponse<IDropType.IDrop>>(
          dropAPIEndpoints.create,
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
