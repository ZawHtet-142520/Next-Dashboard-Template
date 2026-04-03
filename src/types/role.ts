export interface RolePermission {
  _id: string;
  name: string;
}

export interface PermissionName {
  _id: string;
  name: string;
  resource?: string;
  action?: string;
}

export type PermissionGroups = Record<string, PermissionName[]>;

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: RolePermission[];
  type: "system" | "custom" | string;
  createdAt: string;
}

export interface RolesPagination {
  foundCount: number;
  totalCount: number;
  page: number;
  limit: number;
}

export interface GetRolesResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    roles: Role[];
    pagination: RolesPagination;
  };
}

export interface CreateRolePayload {
  name: string;
  description: string;
}

export interface CreateRoleResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    _id: string;
  };
}

export interface UpdateRolePayload {
  name: string;
  description: string;
  permissions: string[];
}

export interface UpdateRoleResponse {
  success: boolean;
  message: string;
  status: number;
  data?: {
    _id?: string;
  };
}

export interface GetPermissionNamesResponse {
  success: boolean;
  message: string;
  status: number;
  data: PermissionGroups;
}

export interface DeleteRoleResponse {
  success: boolean;
  message: string;
  status: number;
}
