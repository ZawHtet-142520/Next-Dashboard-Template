"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, VerifyOtpInput } from "@/schemas/verifyOtpSchema";
import { useForgetPassword, useVerifyOtp } from "@/queries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const RESEND_COUNTDOWN_SECONDS = 60;

const VerifyOtpForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN_SECONDS);
  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const { mutate: verifyOtp, status } = useVerifyOtp();
  const { mutate: resendOtp } = useForgetPassword();
  const isLoading = status === "pending";

  useEffect(() => {
    if (!email) {
      router.push("/forgot-password");
      return;
    }
    setValue("email", email);
  }, [email, router, setValue]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendOtp = () => {
    if (!email) return;
    // Reset the countdown and resend OTP
    setCountdown(RESEND_COUNTDOWN_SECONDS);
    setCanResend(false);
    resendOtp({ email });
  };

  const onSubmit = (data: VerifyOtpInput) => {
    verifyOtp(data);
  };

  if (!email) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white dark:bg-[#2F3349]">
      {/* Left - Form Section */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to forgot password
          </Link>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Verify OTP
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                We&apos;ve sent a 6-digit verification code to{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {email}
                </span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  htmlFor="otp"
                >
                  Verification Code
                </label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  {...register("otp")}
                  className="text-center text-2xl tracking-widest"
                />
                {errors.otp && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                    {errors.otp.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>

              <div className="text-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Resend OTP in{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {countdown}s
                    </span>
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right - Illustration */}
      <div className="hidden md:flex items-center justify-center bg-[#E9E5FB] dark:bg-[#3a3f5c]">
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

const VerifyOtpPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-[#2F3349] flex items-center justify-center">
          <p className="text-gray-900 dark:text-white">Loading...</p>
        </div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
};

export default VerifyOtpPage;
