import { readClient } from "@/api/readClient";
import { Admin } from "@/types/auth";

export interface UserProfileResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    user: Admin;
  };
}

export const fetchUserProfile = async (): Promise<UserProfileResponse> => {
  const response = await readClient.get("/v1/dashboard/user/profile");
  return response.data;
};
