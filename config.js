export const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? `${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_PATH}`
    : "https://backend-production-3828.up.railway.app";
