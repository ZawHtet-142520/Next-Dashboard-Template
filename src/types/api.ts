// Shared API response and error types

export interface BaseApiResponse {
  success: boolean;
  message: string;
  status: number;
}

export interface ApiErrorDetails {
  issue: string;
}

export interface ApiError {
  response?: {
    data?: {
      details?: ApiErrorDetails[];
      message?: string;
    };
  };
}
