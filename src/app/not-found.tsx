/* eslint-disable react/no-unescaped-entities */
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl text-gray-600 font-semibold mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => router.push("/")}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Go Back Home
      </button>
    </div>
  );
}
