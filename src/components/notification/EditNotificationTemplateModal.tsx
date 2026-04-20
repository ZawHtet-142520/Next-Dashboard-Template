"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModalPortal } from "@/hooks/useModalPortal";
import { UseFormReturn } from "react-hook-form";
import { UpdateNotificationTemplateType } from "@/schemas/updateNotificationTemplateSchema";
import { useTheme } from "next-themes";
import { useMemo } from "react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface EditNotificationTemplateModalProps {
  open: boolean;
  isPending: boolean;
  updateNotificationForm: UseFormReturn<UpdateNotificationTemplateType>;
  onClose: () => void;
  updateNotificationTemplate: (data: UpdateNotificationTemplateType) => void;
}

export function EditNotificationTemplateModal({
  open,
  isPending,
  updateNotificationForm,
  onClose,
  updateNotificationTemplate,
}: EditNotificationTemplateModalProps) {
  const { isMounted, createPortal } = useModalPortal();

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

  if (!open || !isMounted) return null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = updateNotificationForm;
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/35 backdrop-blur-[4px]  p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-slate-200 bg-[var(--background)] p-6 shadow-lg dark:border-slate-700">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[var(--secodary-foreground)]">
            Edit Template
          </h2>
          <p className="text-sm text-[var(--foreground)]">
            Update template details
          </p>
        </div>

        <form
          onSubmit={handleSubmit(updateNotificationTemplate)}
          className="space-y-3"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="subject"
              className="text-sm font-medium text-slate-900 dark:text-slate-100"
            >
              Subject
            </label>
            <Input
              id="subject"
              placeholder="Subject"
              {...register("subject")}
            />
            {errors.subject && (
              <span className="text-sm text-destructive">
                {errors.subject.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="edit-admin-email"
              className="text-sm font-medium text-slate-900 dark:text-slate-100"
            >
              Template
            </label>
            <JoditEditor
              onChange={(value) => setValue("template", value)}
              value={getValues("template")}
              config={config}
            />
            {errors.template && (
              <span className="text-sm text-destructive">
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
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent);
}
