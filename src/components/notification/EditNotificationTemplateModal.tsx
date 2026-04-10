"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModalPortal } from "@/hooks/useModalPortal";
import { UseFormReturn } from "react-hook-form";
import { UpdateNotificationTemplateType } from "@/schemas/updateNotificationTemplateSchema";

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

  if (!open || !isMounted) return null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = updateNotificationForm;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-sm dark:bg-black/80 dark:backdrop-blur-md p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Edit Template</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Update template details
          </p>
        </div>

        <form
          onSubmit={handleSubmit(updateNotificationTemplate)}
          className="space-y-3"
        >
          <div className="space-y-1.5">
            <label htmlFor="subject" className="text-sm font-medium text-slate-900 dark:text-slate-100">
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
            <label htmlFor="edit-admin-email" className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Template
            </label>
            <JoditEditor
              onChange={(value) => setValue("template", value)}
              value={getValues("template")}
              config={{
                height: 250,
                toolbarSticky: false,
                showCharsCounter: false,
                showWordsCounter: false,
                saveSelectionOnBlur: false,
                uploader: {
                  url: "data:text/plain,disabled",
                },
              }}
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
