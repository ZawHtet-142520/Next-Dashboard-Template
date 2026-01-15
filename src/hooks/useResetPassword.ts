/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services/authService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      console.log("Password reset successful", data);
      toast.success(data?.message || "Password reset successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.details?.[0]?.issue || 
        error?.response?.data?.message ||
        "Failed to reset password. Please try again."
      );
    },
  });
};
