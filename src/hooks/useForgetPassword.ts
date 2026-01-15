/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { forgetPassword } from "@/services/authService";
import toast from "react-hot-toast";

export const useForgetPassword = () => {
  return useMutation({
    mutationFn: forgetPassword,
    onSuccess: (data) => {
      console.log("Forget password request successful", data);
      toast.success(data?.message || "Password reset link sent to your email!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.details?.[0]?.issue || 
        error?.response?.data?.message ||
        "Failed to send reset link. Please try again."
      );
    },
  });
};
