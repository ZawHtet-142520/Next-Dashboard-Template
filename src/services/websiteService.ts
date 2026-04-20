import { readClient } from "@/api/readClient";
import { writeClient } from "@/api/writeClient";
import { CreateWebsiteType } from "@/schemas/createWebsiteSchema";
import { UpdateWebsiteEmailSettingType } from "@/schemas/updateWebsiteEmailSettingSchema";
import {
  DeleteWebsiteResponse,
  GetWebisteParams,
  GetWebsiteEmailSettingResponse,
  GetWebsiteListResponse,
  GetWebstieNameListResponse,
  UpdateWebsiteEmailSettingResponse,
  UpdateWebsiteResponse,
} from "@/types/website";

export const getWebsiteList = async (params?: GetWebisteParams) => {
  const response = await readClient.get<GetWebsiteListResponse>(
    "/api/v1/websites",
    { params },
  );
  return response.data;
};

export const getWebsiteNameList = async () => {
  const response = await readClient.get<GetWebstieNameListResponse>(
    "/api/v1/websites/name",
  );
  return response.data;
};

export const getWebsiteEmailSetting = async (settingId: string | null) => {
  const response = await readClient.get<GetWebsiteEmailSettingResponse>(
    `/api/v1/websites/${settingId}/emailSetting`,
  );
  return response.data;
};

const buildWebsiteFormData = (payload: CreateWebsiteType): FormData => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("phone", payload.phone);

  if ("url" in payload && payload.url) {
    formData.append("url", payload.url);
  }

  if ("subject" in payload && payload.subject) {
    formData.append("subject", payload.subject);
  }

  if ("organization" in payload && payload.organization) {
    formData.append("organization", payload.organization);
  }

  if (payload.logo) {
    formData.append("logo", payload.logo);
  }
  return formData;
};

export const createWebsite = async (payload: CreateWebsiteType) => {
  const response = await writeClient.post(
    "/api/v1/websites",
    buildWebsiteFormData(payload),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const updateWebsite = async (
  websiteId: string,
  payload: CreateWebsiteType,
) => {
  const response = await writeClient.patch<UpdateWebsiteResponse>(
    `/api/v1/websites/${websiteId}`,
    buildWebsiteFormData(payload),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const updateWebsiteEmailSetting = async (
  websiteId: string,
  payload: UpdateWebsiteEmailSettingType,
) => {
  const response = await writeClient.patch<UpdateWebsiteEmailSettingResponse>(
    `api/v1/websites/${websiteId}/emailSetting`,
    payload,
  );
  return response.data;
};

export const deleteWebsite = async (websiteId: string) => {
  const response = await writeClient.delete<DeleteWebsiteResponse>(
    `/api/v1/websites/${websiteId}`,
  );
  return response.data;
};
