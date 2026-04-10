import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "@/services/authService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ApiError } from "@/types/api";

interface VerifyOtpResponse {
  success: boolean;
  message: string;
  status: number;
}

export const useVerifyOtp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data: VerifyOtpResponse, { email }) => {
      toast.success(data?.message || "OTP verified successfully!");

      // Redirect to reset password page after successful OTP verification.
      if (email) {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        console.warn("No email is provided, redirecting to login");
        toast.error("Unable to proceed with password reset. Please try again.");
        router.push("/login");
      }
    },
    onError: (error: ApiError) => {
      if (error?.response) return;

      toast.error(
        error?.response?.data?.details?.[0]?.issue ||
          error?.response?.data?.message ||
          "Failed to verify OTP. Please try again.",
      );
    },
  });
};
