import Cookies from "js-cookie";
import axios from "axios";
import { decryptToken, isTokenExpired } from "../../utils/handleToken";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (config.skipAuth) {
      return config; // skip adding token
    }

    const encryptedToken = Cookies.get("authToken");
    if (!encryptedToken) {
      window.location.href = "/auth/signin"; 
      return Promise.reject(new Error("No auth token"));
    }

    const token = decryptToken(encryptedToken);
    if (!token || isTokenExpired(token)) {
      Cookies.remove("authToken");
      sessionStorage.removeItem("userData");
      window.location.href = "/auth/signin";
      return Promise.reject(new Error("Token expired or invalid"));
    }

    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
