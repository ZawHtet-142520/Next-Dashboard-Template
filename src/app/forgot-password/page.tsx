"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgetPasswordSchema, ForgetPasswordInput } from "@/schemas/forgetPasswordSchema";
import { useForgetPassword } from "@/hooks/useForgetPassword";
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

  const { mutate: forgetPassword, status, reset: resetMutation } = useForgetPassword();
  const isLoading = status === "pending";
  const isSuccess = status === "success";
  const [submittedEmail, setSubmittedEmail] = useState("");

  const onSubmit = (data: ForgetPasswordInput) => {
    setSubmittedEmail(data.email);
    forgetPassword(data);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white dark:bg-[#2F3349]">
      {/* Left - Form Section */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>

          {!isSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Forgot Password?</h1>
                <p className="text-sm text-gray-600 dark:text-gray-500 mt-2">
                  Enter your email address and we&apos;ll send you a link to reset your password
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-green-600 dark:text-green-500 mb-2">
                  Check your email
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="font-medium text-gray-900 dark:text-white">{submittedEmail}</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-400 mt-2">
                  Click the link in the email to reset your password. If you don&apos;t see the email, check your spam folder.
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
      <div className="hidden md:flex items-center justify-center bg-[#E9E5FB] dark:bg-[#E9E5FB]">
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
