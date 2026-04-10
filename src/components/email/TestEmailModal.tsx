"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModalPortal } from "@/hooks/useModalPortal";
import { UseFormReturn } from "react-hook-form";
import { TestEmailType } from "@/schemas/testEmailSchema";

interface TestEmailModalProps {
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  testEmailForm: UseFormReturn<TestEmailType>;
  sendEmail: (data: TestEmailType) => void;
}

export function TestEmailModal({
  open,
  isPending,
  onClose,
  testEmailForm,
  sendEmail,
}: TestEmailModalProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = testEmailForm;
  const { isMounted, createPortal } = useModalPortal();

  if (!open || !isMounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-sm dark:bg-black/80 dark:backdrop-blur-md p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Test Email</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Try to send email</p>
        </div>

        <form onSubmit={handleSubmit(sendEmail)} className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="from" className="text-sm font-medium text-slate-900 dark:text-slate-100">
              From
            </label>
            <Input id="from" placeholder="From" {...register("from")} />
            {errors.from && (
              <span className="text-sm text-destructive">
                {errors.from.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-sm text-destructive">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="subject" className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Subject
            </label>
            <Input
              id="subject"
              type="string"
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
            <label htmlFor="body" className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Body
            </label>
            <Input
              id="body"
              type="string"
              placeholder="Body"
              {...register("body")}
            />
            {errors.body && (
              <span className="text-sm text-destructive">
                {errors.body.message}
              </span>
            )}
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
              {isPending ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent);
}
