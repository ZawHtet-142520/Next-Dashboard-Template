import { readClient } from "@/api/readClient";
import { writeClient } from "@/api/writeClient";
import {
  DeleteLogResponse,
  GetLogsParams,
  GetLogsResponse,
  LogType,
} from "@/types/log";

export const getLogs = async (params: GetLogsParams) => {
  const response = await readClient.get<GetLogsResponse>("/api/v1/logs", {
    params,
  });
  return response.data;
};

export const deleteLog = async (logId: string) => {
  const response = await writeClient.delete<DeleteLogResponse>(
    `/api/v1/logs/${logId}`,
  );
  return response.data;
};

export const deleteAllLogs = async (type: LogType) => {
  const response = await writeClient.delete<DeleteLogResponse>(
    `api/v1/logs/all/${type}`,
  );
  return response.data;
};
