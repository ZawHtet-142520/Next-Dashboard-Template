import { readClient } from "@/api/readClient";
import { GetOrganizationResponse } from "@/types/organization";

export const getOrganizationList = async () => {
  const response = await readClient.get<GetOrganizationResponse>(
    "/api/v1/websites/name/organization",
  );
  return response.data;
};
