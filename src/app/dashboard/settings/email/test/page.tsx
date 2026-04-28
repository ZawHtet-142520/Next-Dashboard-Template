"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEmailManagement } from "@/hooks/email/useEmailManagement";
import { ArrowLeft } from "lucide-react";

export default function TestEmailPage() {
  const email = useEmailManagement();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = email.testEmailForm;
  return (
    <div className="min-h-screen bg-transparent p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={email.closeTestEmail}
            className="border-border bg-card text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Test Email</h1>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg shadow-slate-900/5">
          <form onSubmit={handleSubmit(email.sendEmail)} className="space-y-3">
            <div className="space-y-1.5">
              <label
                htmlFor="from"
                className="text-sm font-medium text-[var(--secondary-foreground)]"
              >
                From
              </label>
              <Input id="from" placeholder="From" {...register("from")} />
              {errors.from && (
                <span className="text-sm text-[var(--destructive)]">
                  {errors.from.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-[var(--secondary-foreground)]"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-sm text-[var(--destructive)]">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="subject"
                className="text-sm font-medium text-[var(--secondary-foreground)]"
              >
                Subject
              </label>
              <Input
                id="subject"
                type="string"
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
                htmlFor="body"
                className="text-sm font-medium text-[var(--secondary-foreground)]"
              >
                Body
              </label>
              <textarea
                id="body"
                placeholder="Body"
                className="min-h-[120px] w-full rounded-md border px-3 py-2 outline-none 
             focus:outline-none focus:ring-2 focus:ring-background focus:border-black text-sm resize-none"
                {...register("body")}
              />
              {errors.body && (
                <span className="text-sm text-[var(--destructive)]">
                  {errors.body.message}
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={email.closeTestEmail}
                disabled={email.sending}
              >
                Cancel
              </Button>
              <Button type="submit"
                className="bg-[var(--primary)] text-white"
               disabled={email.sending}>
                {email.sending ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
