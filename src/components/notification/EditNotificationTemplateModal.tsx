"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  if (!open) return null;
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = updateNotificationForm;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl max-h-lvh overflow-scroll rounded-lg border bg-background p-6 shadow-lg">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Edit Template</h2>
          <p className="text-sm text-muted-foreground">
            Update template details
          </p>
        </div>

        <form
          onSubmit={handleSubmit(updateNotificationTemplate)}
          className="space-y-3"
        >
          <div className="space-y-1.5">
            <label htmlFor="subject" className="text-sm font-medium">
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
            <label htmlFor="edit-admin-email" className="text-sm font-medium">
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
}
