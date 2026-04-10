export interface AdminRoleRef {
  _id: string;
  name: string;
}

export interface AdminItem {
  _id: string;
  username: string;
  name?: string;
  email: string;
  profile?: string | null;
  role?: AdminRoleRef | string;
  status?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface AdminsPagination {
  foundCount: number;
  totalCount: number;
  page: number;
  limit: number;
}

export interface GetAdminsParams {
  page?: number;
  limit?: number;
  status?: string;
  role?: string;
  search?: string;
}

export interface GetAdminsResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    admins: AdminItem[];
    pagination?: AdminsPagination;
    fileLocation?: {
      admin?: string;
    };
  };
}

export interface GetAdminResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    admin: AdminItem;
    fileLocation?: {
      admin?: string;
    };
  };
}

export interface CreateAdminPayload {
  username: string;
  email: string;
  profile?: File | null;
  password: string;
  role: string;
}

export interface UpdateAdminPayload {
  username: string;
  email: string;
  profile?: File | null;
  role: string;
  password?: string;
}

export interface CreateAdminResponse {
  success: boolean;
  message: string;
  status: number;
  data?: {
    _id?: string;
  };
}

export interface UpdateAdminResponse {
  success: boolean;
  message: string;
  status: number;
  data?: {
    _id?: string;
  };
}

export interface DeleteAdminResponse {
  success: boolean;
  message: string;
  status: number;
}

export interface ChangeAdminPasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ChangeAdminPasswordResponse {
  success: boolean;
  message: string;
  status: number;
}
