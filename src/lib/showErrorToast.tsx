import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/authStore";
import { TriangleAlert } from "lucide-react";
import { ErrorResponseInterface } from "@/types/error";
import { AxiosError } from "axios";

let sessionExpiredToastId: string | null = null;

export const showSessionExpiredToast = () => {
  if (window.location.pathname.startsWith("/signin")) return;

  if (sessionExpiredToastId) return;

  sessionExpiredToastId = toast.custom(
    () => (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="px-4 py-8 w-1/3 bg-background border-l-4 border-red-500 z-50 shadow-lg">
          <div className="flex justify-start items-start gap-4">
            <span className="bg-destructive/20 rounded-full w-12 h-12 grid place-items-center">
              <TriangleAlert />
            </span>
            <div className="">
              <h1 className="text-2xl">Your Session has been expired.</h1>
              <p className="">Please login again.</p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                toast.dismiss(sessionExpiredToastId!);
                sessionExpiredToastId = null;
                useAuthStore.getState().logout();
                window.location.href = "/signin";
              }}
              className="mt-3 bg-bg-blue text-right text-white px-4 py-2 rounded cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    ),
    { duration: Infinity }
  );
};

export const closeSessionExpiredToast = () => {
  if (sessionExpiredToastId) {
    toast.dismiss(sessionExpiredToastId);
  }
};

let errorToastId: string | null = null;

export const showErrorToast = (
  message: string,
  details?: { field: string; issue: string }[]
) => {
  if (errorToastId) return;

  errorToastId = toast.custom((t) => {
    // ✅ Auto-dismiss after 5 seconds
    setTimeout(() => {
      toast.dismiss(t.id);
      errorToastId = null;
    }, 5000);

    return (
      <div className="p-4 border-l-4 border-red-500 shadow-lg bg-background rounded-[2px]">
        <strong className="text-lg text-red-500">{message}</strong>
        {details && details.length > 0 && (
          <div className="mt-2">
            {details.map((detail, index) => (
              <div key={index} className="capitalize">
                <span>{detail.field}</span>: <span>{detail.issue}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  });
};

export const handleApiError = (
  error: AxiosError<ErrorResponseInterface>,
) => {
  const errorMessage =
    error?.response?.data?.message || "An error occurred. Please try again.";

  const details = error?.response?.data?.details;

  showErrorToast(errorMessage, details);
};
