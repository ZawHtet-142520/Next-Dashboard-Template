"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgetPasswordSchema,
  ForgetPasswordInput,
} from "@/schemas/forgetPasswordSchema";
import { useForgetPassword } from "@/queries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgetPasswordInput>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    mutate: forgetPassword,
    status,
    reset: resetMutation,
  } = useForgetPassword();
  const isLoading = status === "pending";
  const isSuccess = status === "success";
  const [submittedEmail, setSubmittedEmail] = useState("");

  const onSubmit = (data: ForgetPasswordInput) => {
    setSubmittedEmail(data.email);
    forgetPassword(data, {
      onSuccess: () => {
        // Redirect to OTP verification page after successful email submission
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        }, 500);
      },
    });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background text-foreground md:grid-cols-2">
      {/* Left - Form Section */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>

          {!isSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Forgot Password?
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your email address and we&apos;ll send you a
                  verification code
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-foreground"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full border border-transparent bg-[var(--primary)] text-white dark:border-primary/40"
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
                <h2 className="mb-2 text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                  Check your email
                </h2>
                <p className="text-sm text-muted-foreground">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="font-medium text-foreground">
                    {submittedEmail}
                  </span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Click the link in the email to reset your password. If you
                  don&apos;t see the email, check your spam folder.
                </p>
              </div>

              <Button
                onClick={() => {
                  setSubmittedEmail("");
                  reset();
                  resetMutation();
                  router.refresh();
                }}
                variant="outline"
                className="w-full"
              >
                Send another link
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right - Illustration */}
      <div className="hidden items-center justify-center bg-secondary md:flex">
        <Image
          src="/photos/login.png"
          alt="Illustration"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
