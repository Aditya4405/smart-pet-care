const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8082";

export const API = {
  BASE_URL: API_BASE_URL,
  BASE_API: `${API_BASE_URL}/api`,
  UPLOADS: `${API_BASE_URL}/uploads`
};