import { getMessageById } from "@/services/messageService";
import { useQuery } from "@tanstack/react-query";

export const useMessageById = (messageId: string | null, enabled = true) => {
  return useQuery({
    queryKey: ["message", messageId],
    queryFn: () => getMessageById(messageId as string),
    enabled: enabled && Boolean(messageId),
    staleTime: 60 * 1000,
    retry: 1,
  });
};
