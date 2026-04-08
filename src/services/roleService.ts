import { readClient } from "@/api/readClient";
import { writeClient } from "@/api/writeClient";
import {
  CreateRolePayload,
  CreateRoleResponse,
  DeleteRoleResponse,
  GetPermissionNamesResponse,
  GetRolesResponse,
  UpdateRolePayload,
  UpdateRoleResponse,
} from "@/types/role";

export const getRoles = async (): Promise<GetRolesResponse> => {
  const response = await readClient.get("/api/v1/roles");
  return response.data;
};

export const createRole = async (
  payload: CreateRolePayload,
): Promise<CreateRoleResponse> => {
  const response = await writeClient.post("/api/v1/roles", payload);
  return response.data;
};

export const getPermissionNames =
  async (): Promise<GetPermissionNamesResponse> => {
    const response = await readClient.get("/api/v1/permissions/names");
    return response.data;
  };

export const updateRole = async (
  roleId: string,
  payload: UpdateRolePayload,
): Promise<UpdateRoleResponse> => {
  const response = await writeClient.patch(`/api/v1/roles/${roleId}`, payload);
  return response.data;
};

export const deleteRole = async (
  roleId: string,
): Promise<DeleteRoleResponse> => {
  const response = await writeClient.delete(`/api/v1/roles/${roleId}`);
  return response.data;
};
