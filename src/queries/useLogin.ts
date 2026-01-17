import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/types/auth";
import { ApiError } from "@/types/api";
import { useShallow } from "zustand/react/shallow";

export const useLogin = () => {
  const { setToken, setUser } = useAuthStore(
    useShallow((state) => ({
      setToken: state.setToken,
      setUser: state.setUser,
    }))
  );
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data: LoginResponse) => {
      const token = data?.data?.jwt?.token;
      const expiresIn = data?.data?.jwt?.expiresIn;
      const adminData = data?.data?.admin;

      if (token && adminData) {
        setToken(token, expiresIn);
        setUser(adminData);
        router.push("/dashboard");
        toast.success(`Welcome ${adminData?.name}!`);
      } else {
        toast.error("Login succeeded but token or user data is missing!");
      }
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.details?.[0]?.issue || "Login failed");
    },
  });
};
