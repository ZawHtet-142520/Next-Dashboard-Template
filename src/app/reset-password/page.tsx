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
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: resetPassword, status } = useResetPassword();
  const isLoading = status === "pending";

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    setValue("token", token);
  }, [token, router, setValue]);

  if (!token) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white dark:bg-[#2F3349]">
      {/* Left - Form Section */}
      <div className="flex items-center justify-center px-6 py-12">
        <form
          onSubmit={handleSubmit((data) => resetPassword(data))}
          className="w-full max-w-md space-y-6"
        >
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Reset Password
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-500 mt-2">
              Enter your new password below
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="password"
              >
                New Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>

            <p className="text-center text-sm text-gray-700 dark:text-gray-300">
              Remember your password?{" "}
              <Link href="/login" className="text-purple-600 hover:underline">
                Back to login
              </Link>
            </p>
          </div>
        </form>
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

const ResetPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-[#2F3349] flex items-center justify-center">
          <p className="text-gray-900 dark:text-white">Loading...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
