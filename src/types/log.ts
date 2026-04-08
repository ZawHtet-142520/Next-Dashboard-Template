export type LogType = "audit" | "user";

export interface GetLogsParams {
  page?: number;
  limit?: number;
  type: "user" | "audit";
  search?: string;
  role?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export interface LogItem {
  _id: string;
  admin: {
    _id: string;
    email: string;
    role: {
      _id: string;
      name: string;
    };
  };
  action: string;
  resource: string;
  ip: string;
  platform: string;
  agent: string;
  createdAt: string;
}

export interface LogsPagination {
  foundCount: number;
  totalCount: number;
  page: number;
  limit: number;
}

export interface GetLogsResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    logs: LogItem[];
    pagination: LogsPagination;
  };
}

export interface DeleteLogResponse {
  success: boolean;
  message: string;
  status: number;
}
