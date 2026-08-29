/** Every environment value the app reads — the only place import.meta.env is touched */
export const config = {
  NODE_ENV: import.meta.env.MODE || "development",
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:5500/api/v1",
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || "http://localhost:5500",
  APP_NAME: import.meta.env.VITE_APP_NAME || "Sneaker Drop",
  REQUEST_TIMEOUT: 30000,
} as const;

export default config;
