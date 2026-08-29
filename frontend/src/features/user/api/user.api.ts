import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";
import type { TResponse } from "@/shared/types";
import { userAPIEndpoints } from "./endpoints.user";
import { userQueryKeys } from "./query-keys.user";
import type { IUserType } from "../types";

export const UserAPI = {
  /** Get current user */
  useCurrentUser: () =>
    useQuery({
      queryKey: userQueryKeys.me(),
      retry: false,
      staleTime: Infinity,
      queryFn: async () => {
        const res = await api.get<TResponse<IUserType.IUser>>(
          userAPIEndpoints.me,
        );
        return res.data.data;
      },
    }),

  /** Create user */
  useCreateUser: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (payload: IUserType.CreateUserPayload) => {
        const res = await api.post<TResponse<IUserType.IUser>>(
          userAPIEndpoints.create,
          payload,
        );
        return res.data.data;
      },
      onSuccess: (user) => {
        // seed the cache directly — the cookie is already set, no refetch needed
        queryClient.setQueryData(userQueryKeys.me(), user);
      },
    });
  },

  /** signin  by user name */
  useSignInMutation: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (payload: IUserType.SignInPayload) => {
        const res = await api.post<TResponse<IUserType.IUser>>(
          userAPIEndpoints.signIn,
          payload,
        );
        return res.data.data;
      },
      onSuccess: (user) => {
        queryClient.setQueryData(userQueryKeys.me(), user);
      },
    });
  },

  /** signout */
  useSignOutMutation: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async () => {
        await api.post(userAPIEndpoints.signOut);
      },
      onSuccess: () => {
        queryClient.setQueryData(userQueryKeys.me(), null);
        queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      },
    });
  },
};
