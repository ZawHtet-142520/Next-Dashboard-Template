import { LoginInput } from "@/schemas/loginSchema";
import { writeClient } from "@/api/writeClient";

export const login = async (data: LoginInput) => {
  const response = await writeClient.post("/v1/dashboard/auth/login", data);
  return response.data;
};
