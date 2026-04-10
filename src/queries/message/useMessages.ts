import { getMessages } from "@/services/messageService";
import { GetMessagesParams } from "@/types/message";
import { useQuery } from "@tanstack/react-query";

export const useMessages = (params: GetMessagesParams) => {
  return useQuery({
    queryKey: ["messages", params],
    queryFn: () => getMessages(params),
    staleTime: 60 * 1000,
    retry: 1,
  });
};
