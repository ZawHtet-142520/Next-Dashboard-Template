"use client";

import { getChangedFields, hasChanges } from "@/lib/changedFields";
import { useEmail } from "@/queries/email/useEmail";
import { useTestEmail } from "@/queries/email/useTestEmail";
import { useUpdateEmail } from "@/queries/email/useUpdateEmail";
import { testEmailSchema, TestEmailType } from "@/schemas/testEmailSchema";
import {
  updateEmailSettingSchema,
  updateEmailSettingType,
} from "@/schemas/updateEmailSettingSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function useEmailManagement() {
  const {
    data: emailSettingResponse,
    isLoading: emailSettingLoading,
    isFetching: emailSettingFetching,
  } = useEmail();
  const [updating, setUpdating] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const router = useRouter();

  const emailSetting = emailSettingResponse?.data?.emailSetting;
  const emailSettingForm = useForm<updateEmailSettingType>({
    defaultValues: {
      email: "",
      host: "",
      port: 0,
      secure: true,
      authUser: "",
      authPass: "",
      from: "",
    },
    resolver: zodResolver(updateEmailSettingSchema),
  });

  const testEmailForm = useForm<TestEmailType>({
    defaultValues: {
      from: "",
      email: "",
      subject: "",
      body: "",
    },
    resolver: zodResolver(testEmailSchema),
  });

  const resetEmailSettingForm = useCallback(() => {
    if (emailSetting) emailSettingForm.reset(emailSetting);
  }, [emailSettingForm, emailSetting]);

  const resetTestEmailForm = useCallback(() => {
    if (emailSetting) testEmailForm.reset(emailSetting);
  }, [testEmailForm, emailSetting]);

  const updateEmailMutation = useUpdateEmail();
  const testEmailMutation = useTestEmail();

  useEffect(() => {
    if (!emailSettingLoading && !emailSettingFetching) {
      resetEmailSettingForm();
      resetTestEmailForm();
    }
  }, [
    emailSettingLoading,
    emailSettingFetching,
    resetEmailSettingForm,
    resetTestEmailForm,
  ]);

  const openTestEmail = () => {
    router.push("/dashboard/settings/email/test");
  };

  const closeTestEmail = () => {
    if (sending) return;
    router.push("/dashboard/settings/email");
  };

  const updateEmailSetting = async (data: updateEmailSettingType) => {
    if (!emailSetting) return;
    if (emailSetting && !hasChanges(emailSetting, data)) {
      return toast.success("No changes");
    }
    setUpdating(true);
    const newFields = getChangedFields(emailSetting, data);
    try {
      const response = await updateEmailMutation.mutateAsync(newFields);
      toast.success(response?.message || "Email setting updated successfully");
    } catch (error) {
      console.error("Failed to update email setting:", error);
      toast.error("Unable to update email setting");
    } finally {
      setUpdating(false);
    }
  };

  const sendEmail = async (data: TestEmailType) => {
    setSending(true);
    try {
      const response = await testEmailMutation.mutateAsync(data);
      toast.success(response?.message || "Email is sent successfully");
      closeTestEmail();
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error("Unable to send email");
    } finally {
      setSending(false);
    }
  };

  return {
    emailSettingForm,
    emailSettingLoading,
    updateEmailSetting,
    resetEmailSettingForm,
    updating,
    testEmailForm,
    sendEmail,
    openTestEmail,
    closeTestEmail,
    sending,
  };
}
