"use client";

import { useEffect, useState } from "react";
import { useMessages } from "@/queries/message/useMessages";
import { useWebsiteNames } from "@/queries/message/useWebsiteNames";
import { useMessageById } from "@/queries/message/useMessageById";

export function useMessageManagement() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [websiteFilter, setWebsiteFilter] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const { data: messagesResponse, isLoading: messagesLoading } = useMessages({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    website: websiteFilter || undefined,
  });

  const { data: websitesResponse, isLoading: websitesLoading } =
    useWebsiteNames();
  const {
    data: messageDetailResponse,
    isLoading: messageDetailLoading,
    isFetching: messageDetailFetching,
  } = useMessageById(selectedMessageId, Boolean(selectedMessageId));

  const messages = messagesResponse?.data?.messages ?? [];
  const pagination = messagesResponse?.data?.pagination;
  const websiteOptions = websitesResponse?.data?.websites ?? [];

  const onSearchChange = (value: string) => {
    setSearch(value);
  };

  const onStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const onWebsiteFilterChange = (value: string) => {
    setWebsiteFilter(value);
    setPage(1);
  };

  const onPageSizeChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("");
    setWebsiteFilter("");
    setPage(1);
  };

  const openMessageDetail = (messageId: string) => {
    setSelectedMessageId(messageId);
  };

  const closeMessageDetail = () => {
    setSelectedMessageId(null);
  };

  return {
    messages,
    messagesLoading,
    websitesLoading,
    pagination,
    websiteOptions,
    page,
    limit,
    search,
    statusFilter,
    websiteFilter,
    selectedMessageId,
    messageDetail: messageDetailResponse?.data?.message,
    messageDetailLoading,
    messageDetailFetching,
    setPage,
    onSearchChange,
    onStatusFilterChange,
    onWebsiteFilterChange,
    onPageSizeChange,
    clearFilters,
    openMessageDetail,
    closeMessageDetail,
  };
}
