import { readClient } from "@/api/readClient";
import {
  GetMessageByIdResponse,
  GetMessagesParams,
  GetMessagesResponse,
  GetWebsiteNamesResponse,
} from "@/types/message";

export const getMessages = async (params: GetMessagesParams) => {
  const response = await readClient.get<GetMessagesResponse>("/api/v1/messages", {
    params,
  });
  return response.data;
};

export const getWebsiteNames = async () => {
  const response = await readClient.get<GetWebsiteNamesResponse>(
    "/api/v1/websites/name",
  );
  return response.data;
};

export const getMessageById = async (messageId: string) => {
  const response = await readClient.get<GetMessageByIdResponse>(
    `/api/v1/messages/${messageId}`,
  );
  return response.data;
};
