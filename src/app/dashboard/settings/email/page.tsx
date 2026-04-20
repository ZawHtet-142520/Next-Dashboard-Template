"use client";

import { EmailHeader } from "@/components/email/EmailHeader";
import { EmailUpdateForm } from "@/components/email/EmailUpdateForm";
import { useEmailManagement } from "@/hooks/email/useEmailManagement";

export default function EmailPage() {
  const email = useEmailManagement();

  return (
    <div className="space-y-4">
      <EmailHeader openTestEmail={email.openTestEmail} />
      <EmailUpdateForm
        emailSettingForm={email.emailSettingForm}
        updateEmailSetting={email.updateEmailSetting}
        emailSettingLoading={email.emailSettingLoading}
        resetEmailSettingForm={email.resetEmailSettingForm}
        isUpdating={email.updating}
      />
    </div>
  );
}
