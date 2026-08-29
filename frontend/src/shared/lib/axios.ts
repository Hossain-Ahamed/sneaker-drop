import axios from "axios";
import config from "@/app/config";
import type { ApiError } from "@/shared/types";

export const api = axios.create({
  baseURL: config.API_URL,
  timeout: config.REQUEST_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

/** Normalizes every axios failure into the ApiError shape the UI reads */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      statusCode: error?.response?.status ?? 500,
      message:
        error?.response?.data?.message ??
        error?.message ??
        "Something went wrong",
      data: error?.response?.data,
    };

    return Promise.reject(apiError);
  },
);
