import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services/authService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BaseApiResponse, ApiError } from "@/types/api";

const REDIRECT_DELAY_MS = 2000;

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data: BaseApiResponse) => {
      toast.success(data?.message || "Password reset successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, REDIRECT_DELAY_MS);
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.details?.[0]?.issue || 
        error?.response?.data?.message ||
        "Failed to reset password. Please try again."
      );
    },
  });
};
