import { readClient } from "@/api/readClient";
import { writeClient } from "@/api/writeClient";
import {
  ChangeAdminPasswordPayload,
  ChangeAdminPasswordResponse,
  CreateAdminPayload,
  CreateAdminResponse,
  DeleteAdminResponse,
  GetAdminResponse,
  GetAdminsParams,
  GetAdminsResponse,
  UpdateAdminPayload,
  UpdateAdminResponse,
} from "@/types/admin";

const buildAdminFormData = (
  payload: CreateAdminPayload | UpdateAdminPayload,
): FormData => {
  const formData = new FormData();
  formData.append("username", payload.username);
  formData.append("email", payload.email);
  formData.append("role", payload.role);
  formData.append("status", payload.status);

  if ("password" in payload && payload.password) {
    formData.append("password", payload.password);
  }

  if (payload.profile) {
    formData.append("profile", payload.profile);
  }

  return formData;
};

export const getAdmins = async (
  params?: GetAdminsParams,
): Promise<GetAdminsResponse> => {
  const response = await readClient.get("/api/v1/admins", { params });
  return response.data;
};

export const getAdminById = async (
  adminId: string,
): Promise<GetAdminResponse> => {
  const response = await readClient.get(`/api/v1/admins/${adminId}`);
  return response.data;
};

export const createAdmin = async (
  payload: CreateAdminPayload,
): Promise<CreateAdminResponse> => {
  const response = await writeClient.post(
    "/api/v1/admins",
    buildAdminFormData(payload),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const updateAdmin = async (
  adminId: string,
  payload: UpdateAdminPayload,
): Promise<UpdateAdminResponse> => {
  const response = await writeClient.patch(
    `/api/v1/admins/${adminId}`,
    buildAdminFormData(payload),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const deleteAdmin = async (
  adminId: string,
): Promise<DeleteAdminResponse> => {
  const response = await writeClient.delete(`/api/v1/admins/${adminId}`);
  return response.data;
};

export const changeAdminPassword = async (
  payload: ChangeAdminPasswordPayload,
): Promise<ChangeAdminPasswordResponse> => {
  const response = await writeClient.patch("/api/v1/admins/password", payload);
  return response.data;
};
