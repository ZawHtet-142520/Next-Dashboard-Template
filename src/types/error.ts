export interface ErrorResponseInterface {
  message: string;
  details?: {
    field: string;
    issue: string;
  }[];
  status?: number;
}
