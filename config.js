export const API_BASE_URL = 
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : "https://backend-production-b688.up.railway.app";
