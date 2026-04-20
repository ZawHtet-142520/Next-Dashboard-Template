export interface GetOrganizationResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    organizations: string[];
  };
}
