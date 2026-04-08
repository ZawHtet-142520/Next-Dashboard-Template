"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/loginSchema";
import { useLogin } from "@/queries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useShallow } from "zustand/react/shallow";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { mutate: login, status } = useLogin();
  const isLoading = status === "pending";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { initializeAuth, isTokenExpired } = useAuthStore(
    useShallow((state) => ({
      initializeAuth: state.initializeAuth,
      isTokenExpired: state.isTokenExpired,
    })),
  );

  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  useEffect(() => {
    initializeAuth();
    const token = useAuthStore.getState().token;
    if (token && !isTokenExpired()) {
      router.replace("/dashboard");
    }
  }, [router, initializeAuth, isTokenExpired]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white dark:bg-[#2F3349]">
      {/* Left - Form Section */}
      <div className="flex items-center justify-center px-6 py-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6"
        >
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please enter your details
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...register("identifier")}
              />
              {errors.identifier && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <input type="checkbox" className="accent-purple-600" />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
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

export default LoginPage;
