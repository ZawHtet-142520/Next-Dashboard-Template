export interface WebsiteItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  url: string;
  logo: string | null;
  organization: string;
  subject: string;
  emailSetting: string;
  createdAt: string;
  updatedAt?: string;
}

export interface WebsiteListPagination {
  foundCount: number;
  totalCount: number;
  page: number;
  limit: number;
}

export interface GetWebsiteListResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    websites: WebsiteItem[];
    pagination: WebsiteListPagination;
    fileLocation: {
      website?: string;
    };
  };
}

export interface WebsiteNameItem {
  _id: string;
  name: string;
}

export interface GetWebstieNameListResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    websites: WebsiteNameItem[];
  };
}

export interface GetWebisteParams {
  page?: number;
  limit?: number;
  search?: string;
  createdBefore?: string;
  createdAfter?: string;
}

export interface DeleteWebsiteResponse {
  success: boolean;
  message: string;
  status: boolean;
  data: {
    _id: string;
  };
}

export interface UpdateWebsiteEmailSettingResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    _id: string;
  };
}

export interface UpdateWebsiteResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    _id: string;
  };
}

export interface GetWebsiteEmailSettingResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    emailSetting: WebsiteEmailSetting;
  };
}

export interface WebsiteEmailSetting {
  _id: string;
  host: string;
  port: number;
  secure: boolean;
  authUser: string;
  authPass: string;
}
