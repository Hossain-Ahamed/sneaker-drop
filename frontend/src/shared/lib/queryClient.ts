import { QueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/shared/types";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
     
        const statusCode = (error as unknown as ApiError)?.statusCode ?? 500;
        if (statusCode >= 400 && statusCode < 500) return false;
        return failureCount < 2;
      },
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
});
