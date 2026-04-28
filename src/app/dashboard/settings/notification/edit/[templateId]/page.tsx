"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotificationTemplateManagement } from "@/hooks/notification/useNotificationTemplateManagement";
import { ArrowLeft, LoaderIcon } from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function UpdateNotificationTemplatePage() {
  const notification = useNotificationTemplateManagement();
  const params = useParams();
  const templateId = params?.templateId as string;
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = notification.updateTemplateForm;
  const { theme } = useTheme();

  // Memoize the config to prevent unnecessary recalculations on each render
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "",
      height: 300,
      buttons: "bold,italic,underline,|,link,|,table,source",
      theme: theme,
      style: {
        background: theme === "dark" ? "#1b1919" : "oklch(1 0 0)",
        color: theme === "dark" ? "#ffffff" : "#000000",
      },
      askBeforePasteFromHTML: false, // Prevent modal asking to keep HTML
      askBeforePasteHTML: false, // Prevent modal for HTML paste
      pasteHTML: true, // Automatically paste HTML
    }),
    [theme],
  );

  const template = notification.templates.find(
    (templates) => templates._id == templateId,
  );

  useEffect(() => {
    if (template) {
      reset(template);
    }
  }, [template, reset]);

  if (notification.templatesResponseLoading)
    return (
      <div className="min-h-screen bg-transparent p-4">
        <div className="mx-auto max-w-2xl space-y-6 flex justify-center items-center h-20">
          <LoaderIcon />
        </div>
      </div>
    );
  if (!template)
    return (
      <div className="min-h-screen bg-transparent p-4">
        <div className="mx-auto max-w-2xl space-y-6 flex justify-center items-center h-20">
          There is no template
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-transparent p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={notification.closeEdit}
            className="border-border bg-card text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Edit Notification Template
            </h1>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg shadow-slate-900/5">
          <form
            onSubmit={handleSubmit(notification.updateNotificationTemplate)}
            className="space-y-3"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="subject"
                className="text-sm font-medium text-[var(--foreground)]"
              >
                Subject
              </label>
              <Input
                id="subject"
                placeholder="Subject"
                {...register("subject")}
              />
              {errors.subject && (
                <span className="text-sm text-[var(--destructive)]">
                  {errors.subject.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="edit-admin-email"
                className="text-sm font-medium text-[var(--foreground)]"
              >
                Template
              </label>
              <JoditEditor
                onChange={(value) => setValue("template", value)}
                value={getValues("template")}
                config={config}
              />
              {errors.template && (
                <span className="text-sm text-[var(--destructive)]">
                  {errors.template.message}
                </span>
              )}
            </div>

            <div>
              <b>Variables : </b>
              {getValues("variables")
                ?.map((variable) => variable.replace(/[{}]/g, ""))
                ?.join(", ") || "None"}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={notification.closeEdit}
                disabled={notification.updating}
              >
                Cancel
              </Button>
             <Button type="submit" disabled={notification.updating} className="bg-[var(--primary)] text-white">
                {notification.updating ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
