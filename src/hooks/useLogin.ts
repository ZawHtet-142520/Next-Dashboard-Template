/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/types/auth";

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data: LoginResponse) => {
      console.log("Login successful", data);

      const token = data?.data?.jwt?.token;
      const adminData = data?.data?.admin;

      if (token) {
        Cookies.set("token", token);
        setToken(token);
        router.push("/dashboard");
        toast.success(`Welcome ${adminData?.name}!`);
      } else {
        toast.error("Login succeeded but token is missing!");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.details?.[0]?.issue || "Login failed");
    },
  });
};
