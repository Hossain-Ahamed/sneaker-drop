import axios from "axios";
import config from "@/app/config";
import type { ApiError } from "@/shared/types";

export const api = axios.create({
  baseURL: config.API_URL,
  timeout: config.REQUEST_TIMEOUT,
  headers: { "Content-Type": "application/json" },
  // identity rides in an httpOnly cookie, so every request must carry it
  withCredentials: true,
});

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
