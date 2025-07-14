export const API_BASE_URL = 
  import.meta.env.MODE === "development"
    ? "http://localhost:3001"
    
    : "https://backend-production-3828.up.railway.app";