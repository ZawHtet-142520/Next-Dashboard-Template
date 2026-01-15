import { LoginInput } from "@/schemas/loginSchema";
import { ForgetPasswordInput } from "@/schemas/forgetPasswordSchema";
import { ResetPasswordInput } from "@/schemas/resetPasswordSchema";
import { writeClient, openWriteClient } from "@/api/writeClient";

export const login = async (data: LoginInput) => {
  const response = await writeClient.post("/v1/dashboard/auth/login", data);
  return response.data;
};

export const forgetPassword = async (data: ForgetPasswordInput) => {
  const response = await openWriteClient.post("/v1/dashboard/auth/forget-password", data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordInput) => {
  const response = await openWriteClient.post("/v1/dashboard/auth/reset-password", data);
  return response.data;
};
