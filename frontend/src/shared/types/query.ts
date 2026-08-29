import "@tanstack/query-core";
import type { ApiError } from "./response.type";
declare module "@tanstack/query-core" {
  interface Register {
    defaultError: ApiError;
  }
}
