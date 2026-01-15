import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://mvs-b.cbs.com.mm";


export const openWriteClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

openWriteClient.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      toast.error("Session expired. Please login again");
    }
    return Promise.reject(error);
  }
);

export const writeClient = axios.create({
  baseURL: API_BASE_URL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

writeClient.interceptors.request.use(
  (request) => {
    const token = Cookies.get('token')

    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      toast.error("Session expired. Please login again");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
