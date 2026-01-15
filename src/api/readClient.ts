import { showErrorToast, showSessionExpiredToast } from "@/lib/showErrorToast";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://mvs-b.cbs.com.mm";

export const readClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

readClient.interceptors.request.use(
  (request) => {
    const token = Cookies.get("token");
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    console.error("Response Error:", error);

    return Promise.reject(error);
  }
);

readClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      const details = error.response?.data?.details;

      if (status === 401 ) {
        showSessionExpiredToast();
      } else {
        showErrorToast(errorMessage, details);
      }
    }

    return Promise.reject(error);
  }
);
