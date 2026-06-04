import { useRoles } from "@/queries";
import { useDeleteAllLogs } from "@/queries/log/useDeleteAllLogs";
import { useDeleteLog } from "@/queries/log/useDeleteLog";
import { useLogs } from "@/queries/log/useLogs";
import { LogItem, LogType } from "@/types/log";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useLogManagement(type: LogType) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [createdAfter, setCreatedAfter] = useState("");
  const [createdBefore, setCreatedBefore] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteLog, setPendingDeleteLog] = useState<{
    id: string;
  } | null>(null);
  const [deletingLogs, setDeletingLogs] = useState<boolean>(false);
  const [pendingDeleteAllLogs, setPendingDeleteAllLogs] =
    useState<boolean>(false);

  const {
    data: logsResponse,
    isLoading: logsLoading,
    refetch: refetchLogs,
  } = useLogs({
    page,
    limit,
    search: debouncedSearch || undefined,
    role: roleFilter || undefined,
    createdAfter: createdAfter || undefined,
    createdBefore: createdBefore || undefined,
    type: type,
  });
  const { data: rolesResponse } = useRoles();

  const logs = logsResponse?.data?.logs ?? [];
  const roleOptions = rolesResponse?.data?.roles ?? [];

  const onCreatedAfterChange = (value: string) => {
    setCreatedAfter(value);
  };

  const onCreatedBeforeChange = (value: string) => {
    setCreatedBefore(value);
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
  };

  const onPageSizeChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setRoleFilter("");
    setCreatedAfter("");
    setCreatedBefore("");
    setPage(1);
  };

  const onRoleFilterChange = (nextRole: string) => {
    setRoleFilter(nextRole);
    setPage(1);
  };

  const pagination = logsResponse?.data?.pagination;

  const goToPreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    const activeLimit = pagination?.limit || limit || 1;
    const totalPages = Math.max(
      1,
      Math.ceil((pagination?.totalCount || 0) / activeLimit),
    );
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  const openDeleteLogConfirm = (log: LogItem) => {
    setPendingDeleteLog({
      id: log._id,
    });
  };

  const closeDeleteLogConfirm = () => {
    if (deletingId) return;
    setPendingDeleteLog(null);
  };

  const openDeleteAllLogsConfirm = () => {
    setPendingDeleteAllLogs(true);
  };

  const closeDeleteAllLogsConfirm = () => {
    if (deletingLogs) return;
    setPendingDeleteAllLogs(false);
  };

  const deleteLogMutation = useDeleteLog();
  const deleteAllLogsMutation = useDeleteAllLogs();

  const confirmDeleteAllLogs = async () => {
    if (!pendingDeleteAllLogs) return;
    setDeletingLogs(true);
    try {
      const response = await deleteAllLogsMutation.mutateAsync(type);
      await refetchLogs();
      toast.success(response?.message || "All logs deleted successfully");
    } catch (error) {
      console.error("Failed to delete all logs", error);
      console.error("Unable to delete all logs");
    } finally {
      setDeletingLogs(false);
      setPendingDeleteAllLogs(false);
    }
  };

  const confirmDeleteLog = async () => {
    if (!pendingDeleteLog) return;
    setDeletingId(pendingDeleteLog.id);
    try {
      const response = await deleteLogMutation.mutateAsync(pendingDeleteLog.id);
      await refetchLogs();
      toast.success(response?.message || "Log deleted successfully");
    } catch (error) {
      console.error("Failed to delete log:", error);
      toast.error("Unable to delete log");
    } finally {
      setDeletingId(null);
      setPendingDeleteLog(null);
    }
  };

  return {
    logs,
    logsLoading,
    search,
    page,
    limit,
    rolesResponse,
    roleOptions,
    roleFilter,
    pagination,
    createdAfter,
    createdBefore,
    deletingId,
    pendingDeleteLog,
    pendingDeleteAllLogs,
    deletingLogs,
    setPage,
    onSearchChange,
    onPageSizeChange,
    clearFilters,
    goToPreviousPage,
    goToNextPage,
    onRoleFilterChange,
    onCreatedAfterChange,
    onCreatedBeforeChange,
    openDeleteLogConfirm,
    closeDeleteLogConfirm,
    confirmDeleteLog,
    openDeleteAllLogsConfirm,
    closeDeleteAllLogsConfirm,
    confirmDeleteAllLogs,
  };
}
