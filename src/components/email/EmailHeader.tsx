"use client";

import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  openTestEmailModal: () => void;
}

export function EmailHeader({ openTestEmailModal }: AdminHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Email Setting</h1>
          <p className="text-sm text-muted-foreground">
            Manage and test your email configuration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openTestEmailModal}>Test Email</Button>
        </div>
      </div>
    </div>
  );
}
