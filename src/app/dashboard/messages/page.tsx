"use client";

import { MessageHeader } from "@/components/message/MessageHeader";
import { MessageDetailsModal } from "@/components/message/MessageDetailsModal";
import { MessagesTable } from "@/components/message/MessagesTable";
import { useMessageManagement } from "@/hooks/message/useMessageManagement";

export default function MessagesPage() {
  const message = useMessageManagement();

  return (
    <div className="space-y-4">
      <MessageHeader
        onClearFilters={message.clearFilters}
        search={message.search}
        statusFilter={message.statusFilter}
        websiteFilter={message.websiteFilter}
        websiteOptions={message.websiteOptions}
        onSearchChange={message.onSearchChange}
        onStatusFilterChange={message.onStatusFilterChange}
        onWebsiteFilterChange={message.onWebsiteFilterChange}
      />

      <MessagesTable
        messages={message.messages}
        messagesLoading={message.messagesLoading || message.websitesLoading}
        pagination={message.pagination}
        page={message.page}
        pageSize={message.limit}
        onView={(item) => message.openMessageDetail(item._id)}
        onPageSizeChange={message.onPageSizeChange}
        onPageChange={message.setPage}
      />

      <MessageDetailsModal
        open={Boolean(message.selectedMessageId)}
        isLoading={message.messageDetailLoading || message.messageDetailFetching}
        message={message.messageDetail || null}
        onClose={message.closeMessageDetail}
      />
    </div>
  );
}
