/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  profile: string;
  role: Role;
  [key: string]: any;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    admin: Admin;
    jwt: {
      token: string;
      expiresIn: number;
    };
    fileLocation: {
      admin: string;
    };
  };
}
