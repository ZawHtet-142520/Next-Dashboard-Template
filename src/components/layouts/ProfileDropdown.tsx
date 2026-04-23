"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  //   DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useAuthStore } from "@/stores/authStore";
import { useShallow } from "zustand/react/shallow";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";
import { useChangeAdminPassword } from "@/queries/admin/useChangeAdminPassword";
import { useAdminById } from "@/queries/admin/useAdminById";
import toast from "react-hot-toast";
import { isAuthErrorStatus } from "@/lib/showErrorToast";
import { LogoutConfirmModal } from "../admin/LogoutConfirmModal";

export default function ProfileDropdown() {
  const router = useRouter();
  const handleLogout = useDashboardStore((state) => state.handleLogout);
  const [openLogout, setOpenLogout] = useState<boolean>(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const changePasswordMutation = useChangeAdminPassword();
  const { user, logout } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      logout: state.logout,
    })),
  );
  const { data: adminDetailResponse } = useAdminById(user?._id);

  const onLogout = () => {
    logout();
    handleLogout();
    router.push("/login");
  };

  // Get user initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  const getRoleName = (role: unknown) => {
    if (!role) return "User";
    if (typeof role === "string") return role;
    if (typeof role === "object" && role !== null && "name" in role) {
      return String((role as { name?: string }).name || "User");
    }
    return "User";
  };
  const userName =
    user?.name || adminDetailResponse?.data?.admin?.username || "User";
  const userEmail =
    user?.email ||
    adminDetailResponse?.data?.admin?.email ||
    "user@example.com";
  const userRole = getRoleName(
    user?.role || adminDetailResponse?.data?.admin?.role,
  );
  const userProfileBase = adminDetailResponse?.data?.fileLocation?.admin || "";
  const userProfileRaw =
    user?.profile || adminDetailResponse?.data?.admin?.profile;
  const userProfile = userProfileRaw
    ? userProfileRaw.startsWith("http://") ||
      userProfileRaw.startsWith("https://") ||
      userProfileRaw.startsWith("blob")
      ? userProfileRaw
      : `${userProfileBase}${userProfileRaw}`
    : "/profile.jpg";

  const openProfilePage = () => {
    router.push("/dashboard/settings/admin/profile");
  };

  const openChangePassword = () => {
    setChangePasswordOpen(true);
  };

  const closeChangePassword = () => {
    if (changePasswordMutation.isPending) return;
    setChangePasswordOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const onChangePasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!oldPassword.trim() || !newPassword.trim()) {
      toast.error("Old password and new password are required");
      return;
    }

    if (newPassword.trim() !== confirmNewPassword.trim()) {
      toast.error("New password and confirmation do not match");
      return;
    }

    try {
      const response = await changePasswordMutation.mutateAsync({
        oldPassword: oldPassword.trim(),
        newPassword: newPassword.trim(),
      });

      toast.success(response?.message || "Password updated successfully");
      closeChangePassword();
    } catch (error) {
      console.error("Failed to change password:", error);
      const apiStatus =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { status?: number } } }).response
          ?.data?.status === "number"
          ? (error as { response?: { data?: { status?: number } } }).response
              ?.data?.status
          : undefined;
      const hasApiResponse =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        Boolean((error as { response?: unknown }).response);

      if (isAuthErrorStatus(apiStatus)) return;

      // API errors are already toasted by interceptors; keep only one toast.
      if (hasApiResponse) return;

      toast.error("Unable to change password");
    }
  };

  return (
    <>
      <DropdownMenu>
        <div className="flex items-center gap-3 text-foreground">
          <div>
            <div className="hidden text-right text-sm font-bold text-foreground sm:block">
              {userName}
            </div>
            <div className="hidden text-right text-sm text-muted-foreground sm:block">
              {userRole}
            </div>
          </div>

          <DropdownMenuTrigger asChild>
            <Avatar className="h-10 w-10 cursor-pointer border border-border bg-card">
              <AvatarImage
                src={userProfile}
                alt="User Profile"
                className="object-cover"
              />
              <AvatarFallback className="bg-muted text-foreground">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
        </div>

        <DropdownMenuContent
          align="end"
          className="w-56 border-border bg-card p-2 text-card-foreground shadow-lg"
        >
          <div className="flex items-center gap-3 p-3">
            <Avatar className="h-10 w-10 border border-border bg-card">
              <AvatarImage
                src={userProfile}
                alt="User Profile"
                className="object-cover"
              />
              <AvatarFallback className="bg-muted text-foreground">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={openProfilePage}
          >
            <User className="w-4 h-4 mr-2" /> My Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={openChangePassword}
          >
            <Settings className="w-4 h-4 mr-2" /> Change Password
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setOpenLogout(true)}
            variant="destructive"
            className="cursor-pointer font-semibold"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutConfirmModal
        open={openLogout}
        onClose={() => setOpenLogout(false)}
        onConfirm={onLogout}
      />

      <ChangePasswordModal
        open={changePasswordOpen}
        oldPassword={oldPassword}
        newPassword={newPassword}
        confirmNewPassword={confirmNewPassword}
        isPending={changePasswordMutation.isPending}
        onOldPasswordChange={setOldPassword}
        onNewPasswordChange={setNewPassword}
        onConfirmNewPasswordChange={setConfirmNewPassword}
        onClose={closeChangePassword}
        onSubmit={onChangePasswordSubmit}
      />
    </>
  );
}
