export type MessageStatus = "pending" | "success" | "failed" | string;

export interface MessageWebsite {
  _id: string;
  name: string;
  email?: string | null;
  logo?: string | null;
  organization?: string | null;
}

export interface MessagePayload {
  full_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  body?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface MessageItem {
  _id: string;
  website: MessageWebsite;
  payload: MessagePayload;
  subject: string | null;
  status: MessageStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface MessagesPagination {
  foundCount: number;
  totalCount: number;
  page: number;
  limit: number;
}

export interface GetMessagesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  website?: string;
}

export interface GetMessagesResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    messages: MessageItem[];
    pagination: MessagesPagination;
    fileLocation?: {
      website?: string;
    };
  };
}

export interface WebsiteNameItem {
  _id: string;
  name: string;
}

export interface GetWebsiteNamesResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    websites: WebsiteNameItem[];
  };
}

export interface GetMessageByIdResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    message: MessageItem;
    fileLocation?: {
      website?: string;
    };
  };
}
