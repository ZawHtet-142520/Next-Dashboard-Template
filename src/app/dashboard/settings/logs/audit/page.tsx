"use client";

import { DeleteAllLogsConfirmModal } from "@/components/log/DeleteAllLogsConfirmModal";
import { DeleteLogConfirmModal } from "@/components/log/DeleteLogConfirmModal";
import { LogHeader } from "@/components/log/LogHeader";
import { LogsTable } from "@/components/log/LogsTable";
import { useLogManagement } from "@/hooks/log/useLogManagement";

export default function AuditLogPage() {
  const log = useLogManagement("audit");
  return (
    <div className="space-y-4">
      <LogHeader
        onClearFilters={log.clearFilters}
        search={log.search}
        onSearchChange={log.onSearchChange}
        roleFilter={log.roleFilter}
        roleOptions={log.roleOptions}
        onRoleFilterChange={log.onRoleFilterChange}
        createdAfter={log.createdAfter}
        createdBefore={log.createdBefore}
        onCreatedAfterChange={log.onCreatedAfterChange}
        onCreatedBeforeChange={log.onCreatedBeforeChange}
        onDelete={log.openDeleteAllLogsConfirm}
        title="Audit Logs"
      />
      <LogsTable
        logs={log.logs}
        logsLoading={log.logsLoading}
        pagination={log.pagination}
        page={log.page}
        pageSize={log.limit}
        deletingId={log.deletingId}
        onDelete={log.openDeleteLogConfirm}
        onPageSizeChange={log.onPageSizeChange}
        onPageChange={log.setPage}
        type="audit"
      />
      <DeleteLogConfirmModal
        open={Boolean(log.pendingDeleteLog)}
        isPending={Boolean(log.deletingId)}
        onClose={log.closeDeleteLogConfirm}
        onConfirm={log.confirmDeleteLog}
      />
      <DeleteAllLogsConfirmModal
        open={Boolean(log.pendingDeleteAllLogs)}
        isPending={Boolean(log.deletingLogs)}
        onClose={log.closeDeleteAllLogsConfirm}
        onConfirm={log.confirmDeleteAllLogs}
      />
    </div>
  );
}
