"use client";

import { EmailHeader } from "@/components/email/EmailHeader";
import { EmailUpdateForm } from "@/components/email/EmailUpdateForm";
import { TestEmailModal } from "@/components/email/TestEmailModal";
import { useEmailManagement } from "@/hooks/email/useEmailManagement";

export default function EmailPage() {
  const email = useEmailManagement();

  return (
    <div className="space-y-4">
      <EmailHeader openTestEmailModal={email.openTestEmailModal} />
      <EmailUpdateForm
        emailSettingForm={email.emailSettingForm}
        updateEmailSetting={email.updateEmailSetting}
        emailSettingLoading={email.emailSettingLoading}
        resetEmailSettingForm={email.resetEmailSettingForm}
        isUpdating={email.updating}
      />
      <TestEmailModal
        open={email.isTestEmailModalOpen}
        isPending={email.sending}
        onClose={email.closeTestEmailModal}
        testEmailForm={email.testEmailForm}
        sendEmail={email.sendEmail}
      />
    </div>
  );
}
