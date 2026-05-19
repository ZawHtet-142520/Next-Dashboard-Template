import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {
  decrementApiLoading,
  incrementApiLoading,
} from "@/lib/apiLoadingStore";
import { handleAuthErrorStatus, showErrorToast } from "@/lib/showErrorToast";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://mail-b.cbs.com.mm";

export const openWriteClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

openWriteClient.interceptors.request.use(
  (request) => {
    incrementApiLoading();
    return request;
  },
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      toast.error("Session expired. Please login again");
    }
    return Promise.reject(error);
  },
);

openWriteClient.interceptors.response.use(
  (response) => {
    decrementApiLoading();
    return response;
  },
  (error) => {
    decrementApiLoading();
    if (axios.isAxiosError(error)) {
      const status = error.response?.data?.status;
      const message = error.response?.data?.message;
      const details = error.response?.data?.details;

      const isHandledAuthStatus = handleAuthErrorStatus(
        status,
        message,
        details,
      );

      if (!isHandledAuthStatus) {
        showErrorToast(
          message || "An error occurred. Please try again.",
          details,
        );
      }
    }
    return Promise.reject(error);
  },
);

export const writeClient = axios.create({
  baseURL: API_BASE_URL,
});

writeClient.interceptors.request.use(
  (request) => {
    incrementApiLoading();
    const token = Cookies.get("token");

    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

writeClient.interceptors.response.use(
  (response) => {
    decrementApiLoading();
    return response;
  },
  (error) => {
    decrementApiLoading();
    if (axios.isAxiosError(error)) {
      const status = error.response?.data?.status;
      const message = error.response?.data?.message;
      const details = error.response?.data?.details;

      const isHandledAuthStatus = handleAuthErrorStatus(
        status,
        message,
        details,
      );

      if (!isHandledAuthStatus) {
        showErrorToast(
          message || "An error occurred. Please try again.",
          details,
        );
      }
    }
    return Promise.reject(error);
  },
);
