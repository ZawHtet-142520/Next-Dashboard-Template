"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  ResetPasswordInput,
} from "@/schemas/resetPasswordSchema";
import { useResetPassword } from "@/queries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      newPassword: "",
    },
  });

  const { mutate: resetPassword, status } = useResetPassword();
  const isLoading = status === "pending";

  useEffect(() => {
    if (!email) {
      router.push("/login");
      return;
    }
    setValue("email", email);
  }, [email, router, setValue]);

  if (!email) {
    return null;
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background text-foreground md:grid-cols-2">
      {/* Left - Form Section */}
      <div className="flex items-center justify-center px-6 py-12">
        <form
          onSubmit={handleSubmit((data) => resetPassword(data))}
          className="w-full max-w-md space-y-6"
        >
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-foreground"
                htmlFor="password"
              >
                New Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-[var(--destructive)]">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full border border-transparent bg-[var(--primary)] text-white dark:border-primary/40"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Back to login
              </Link>
            </p>
          </div>
        </form>
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

const ResetPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
          <p className="text-foreground">Loading...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
