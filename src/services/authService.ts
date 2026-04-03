import { LoginInput } from "@/schemas/loginSchema";
import { ForgetPasswordInput } from "@/schemas/forgetPasswordSchema";
import { ResetPasswordInput } from "@/schemas/resetPasswordSchema";
import { VerifyOtpInput } from "@/schemas/verifyOtpSchema";
import { writeClient, openWriteClient } from "@/api/writeClient";

export const login = async (data: LoginInput) => {
  const response = await writeClient.post("/api/v1/auth/login", data);
  return response.data;
};

export const forgetPassword = async (data: ForgetPasswordInput) => {
  const response = await openWriteClient.post(
    "/v1/dashboard/auth/forget-password",
    data,
  );
  return response.data;
};

export const verifyOtp = async (data: VerifyOtpInput) => {
  const response = await openWriteClient.post(
    "/v1/dashboard/auth/verify-otp",
    data,
  );
  return response.data;
};

export const resetPassword = async (data: ResetPasswordInput) => {
  const response = await openWriteClient.post(
    "/v1/dashboard/auth/reset-password",
    data,
  );
  return response.data;
};
