import { handleAuthErrorStatus, showErrorToast } from "@/lib/showErrorToast";
import {
  decrementApiLoading,
  incrementApiLoading,
} from "@/lib/apiLoadingStore";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://mail-b.cbs.com.mm";

export const readClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

readClient.interceptors.request.use(
  (request) => {
    incrementApiLoading();
    const token = Cookies.get("token");
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    console.error("Response Error:", error);

    return Promise.reject(error);
  },
);

readClient.interceptors.response.use(
  (response) => {
    decrementApiLoading();
    return response;
  },
  (error) => {
    decrementApiLoading();
    if (axios.isAxiosError(error)) {
      const status = error.response?.data?.status;
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      const details = error.response?.data?.details;

      const isHandledAuthStatus = handleAuthErrorStatus(
        status,
        errorMessage,
        details,
      );

      if (!isHandledAuthStatus) {
        showErrorToast(errorMessage, details);
      }
    }

    return Promise.reject(error);
  },
);
