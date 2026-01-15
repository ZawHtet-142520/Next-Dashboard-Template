import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "@/services/authService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ApiError } from "@/types/api";

interface VerifyOtpResponse {
  success: boolean;
  message: string;
  status: number;
  data?: {
    token?: string;
  };
}

export const useVerifyOtp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data: VerifyOtpResponse) => {
      toast.success(data?.message || "OTP verified successfully!");
      // Redirect to reset password page after successful OTP verification
      // Pass the token if available
      setTimeout(() => {
        const token = data?.data?.token;
        if (token) {
          router.push(`/reset-password?token=${encodeURIComponent(token)}`);
        } else {
          router.push("/reset-password");
        }
      }, 1000);
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.details?.[0]?.issue || 
        error?.response?.data?.message ||
        "Failed to verify OTP. Please try again."
      );
    },
  });
};
