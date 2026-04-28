"use client";

import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  openTestEmail: () => void;
}

export function EmailHeader({ openTestEmail }: AdminHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Email Setting</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[var(--primary)] text-white" onClick={openTestEmail}>Test Email</Button>
        </div>
      </div>
    </div>
  );
}
