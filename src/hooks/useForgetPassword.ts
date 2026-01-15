import { useMutation } from "@tanstack/react-query";
import { forgetPassword } from "@/services/authService";
import toast from "react-hot-toast";

interface ForgetPasswordResponse {
  success: boolean;
  message: string;
  status: number;
}

interface ApiErrorDetails {
  issue: string;
}

interface ApiError {
  response?: {
    data?: {
      details?: ApiErrorDetails[];
      message?: string;
    };
  };
}

export const useForgetPassword = () => {
  return useMutation({
    mutationFn: forgetPassword,
    onSuccess: (data: ForgetPasswordResponse) => {
      toast.success(data?.message || "Password reset link sent to your email!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.details?.[0]?.issue || 
        error?.response?.data?.message ||
        "Failed to send reset link. Please try again."
      );
    },
  });
};
