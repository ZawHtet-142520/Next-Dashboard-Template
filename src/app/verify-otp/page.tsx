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
      otpCode: "",
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
    <div className="grid min-h-screen grid-cols-1 bg-background text-foreground md:grid-cols-2">
      {/* Left - Form Section */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to forgot password
          </Link>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Verify OTP
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We&apos;ve sent a 6-digit verification code to{" "}
                <span className="font-medium text-foreground">
                  {email}
                </span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-foreground"
                  htmlFor="otp"
                >
                  Verification Code
                </label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  {...register("otpCode")}
                  className="text-center text-2xl tracking-widest"
                />
                {errors.otpCode && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.otpCode.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full border border-transparent dark:border-primary/40"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>

              <div className="text-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm text-primary hover:underline"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Resend OTP in{" "}
                    <span className="font-medium text-foreground">
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

const VerifyOtpPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
          <p className="text-foreground">Loading...</p>
        </div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
};

export default VerifyOtpPage;
