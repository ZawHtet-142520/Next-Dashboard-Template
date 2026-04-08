import { readClient } from "@/api/readClient";
import { writeClient } from "@/api/writeClient";
import { TestEmailType } from "@/schemas/testEmailSchema";
import { updateEmailSettingType } from "@/schemas/updateEmailSettingSchema";
import {
  EmailSettingResponse,
  EmailSettingUpdateResponse,
  EmailTestResponse,
} from "@/types/email";

export const getEmailSetting = async () => {
  const response = await readClient.get<EmailSettingResponse>(
    "/api/v1/emailSetting",
  );
  return response.data;
};

export const updateEmailSetting = async (
  payload: Partial<updateEmailSettingType>,
) => {
  const response = await writeClient.patch<EmailSettingUpdateResponse>(
    "/api/v1/emailSetting",
    payload,
  );
  return response.data;
};

export const testEmail = async (payload: TestEmailType) => {
  const response = await writeClient.patch<EmailTestResponse>(
    "/api/v1/emailSetting/test",
    payload,
  );
  return response.data;
};
