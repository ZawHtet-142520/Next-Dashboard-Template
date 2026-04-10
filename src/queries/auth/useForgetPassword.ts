import { useMutation } from "@tanstack/react-query";
import { forgetPassword } from "@/services/authService";
import toast from "react-hot-toast";
import { BaseApiResponse, ApiError } from "@/types/api";

export const useForgetPassword = () => {
  return useMutation({
    mutationFn: forgetPassword,
    onSuccess: (data: BaseApiResponse) => {
      toast.success(data?.message || "Password reset link sent to your email!");
    },
    onError: (error: ApiError) => {
      if (error?.response) return;

      toast.error(
        error?.response?.data?.details?.[0]?.issue ||
          error?.response?.data?.message ||
          "Failed to send reset link. Please try again.",
      );
    },
  });
};
