import { readClient } from "@/api/readClient";
import { writeClient } from "@/api/writeClient";
import { UpdateNotificationTemplateType } from "@/schemas/updateNotificationTemplateSchema";
import {
  GetNotificationTemplatesResponse,
  UpdateNotificationTemplateResponse,
} from "@/types/template";

export const getAllNotificationTemplates = async () => {
  const response = await readClient.get<GetNotificationTemplatesResponse>(
    "/api/v1/notificationTemplates",
  );
  return response.data;
};

export const updateNotificationTemplate = async (
  payload: UpdateNotificationTemplateType,
) => {
  const response = await writeClient.patch<UpdateNotificationTemplateResponse>(
    `/api/v1/notificationTemplates/${payload._id}`,
    {
      subject: payload.subject,
      template: payload.template,
    },
  );
  return response.data;
};
