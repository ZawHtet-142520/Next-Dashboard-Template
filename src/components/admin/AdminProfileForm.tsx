"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/authStore";
import { useRoles, useAdminById } from "@/queries";
import { useUpdateAdmin } from "@/queries/admin/useUpdateAdmin";
import type { Admin } from "@/types/auth";
import type { Role as RoleOption } from "@/types/role";
import type { AdminItem } from "@/types/admin";

const getRoleName = (role: AdminItem["role"] | undefined): string => {
  if (!role) return "-";
  if (typeof role === "string") return role;
  return role.name;
};

const resolveRoleId = (
  role: AdminItem["role"] | undefined,
  roles: RoleOption[],
): string => {
  if (!role) return "";

  if (typeof role !== "string") {
    const exactIdMatch = roles.find((item) => item._id === role._id);
    if (exactIdMatch) return exactIdMatch._id;

    const nameMatch = roles.find(
      (item) => item.name.toLowerCase() === role.name.toLowerCase(),
    );
    if (nameMatch) return nameMatch._id;

    return role._id;
  }

  const stringIdMatch = roles.find((item) => item._id === role);
  if (stringIdMatch) return stringIdMatch._id;

  const stringNameMatch = roles.find(
    (item) => item.name.toLowerCase() === role.toLowerCase(),
  );
  if (stringNameMatch) return stringNameMatch._id;

  return role;
};

const resolveProfileUrl = (profile: string | null | undefined, baseUrl: string) => {
  if (!profile) return "";
  if (profile.startsWith("http://") || profile.startsWith("https://")) {
    return profile;
  }
  return `${baseUrl}${profile}`;
};

export function AdminProfileForm() {
  const { user, setUser } = useAuthStore();
  const { data: adminDetailResponse, isLoading: profileLoading } = useAdminById(
    user?._id,
  );
  const { data: rolesResponse } = useRoles();
  const updateAdminMutation = useUpdateAdmin();

  const profile = adminDetailResponse?.data?.admin;
  const profileBaseUrl = adminDetailResponse?.data?.fileLocation?.admin || "";
  const roleOptions = useMemo(
    () => rolesResponse?.data?.roles ?? [],
    [rolesResponse?.data?.roles],
  );

  const [adminId, setAdminId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState("");

  useEffect(() => {
    if (!profile) return;

    setAdminId(profile._id || "");
    setName(profile.username || profile.name || "");
    setEmail(profile.email || "");
    setProfilePreview(resolveProfileUrl(profile.profile, profileBaseUrl));
  }, [profile, profileBaseUrl]);

  useEffect(() => {
    if (!profile) return;
    const nextRoleId = resolveRoleId(profile.role, roleOptions);
    setRoleId((currentRoleId) => (currentRoleId === nextRoleId ? currentRoleId : nextRoleId));
  }, [profile, roleOptions]);

  const handleProfileFileChange = (file: File | null) => {
    setProfileFile(file);
    if (!file) {
      setProfilePreview(resolveProfileUrl(profile?.profile, profileBaseUrl));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setProfilePreview(objectUrl);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!adminId) {
      toast.error("Unable to identify profile");
      return;
    }

    if (!user) {
      toast.error("Unable to identify current user");
      return;
    }

    if (!name.trim() || !email.trim() || !roleId) {
      toast.error("Name, email, and role are required");
      return;
    }

    try {
      const response = await updateAdminMutation.mutateAsync({
        adminId,
        payload: {
          username: name.trim(),
          email: email.trim(),
          profile: profileFile,
          role: roleId,
        },
      });

      setUser({
        ...user,
        name: name.trim(),
        email: email.trim(),
        profile: profilePreview,
      } as Admin);

      toast.success(response?.message || "Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Unable to update profile");
    }
  };

  if (profileLoading && !profile) {
    return <div className="text-sm text-muted-foreground">Loading profile...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Admin Update</h1>
        <p className="text-sm text-muted-foreground">Update your profile information</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center gap-4 rounded-xl border bg-muted/20 p-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border bg-muted">
            {profilePreview ? (
              <Image
                src={profilePreview}
                alt="Profile preview"
                fill
                sizes="80px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-xl font-semibold text-muted-foreground">
                {(name?.trim()?.charAt(0) || "A").toUpperCase()}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm"
              onChange={(e) => handleProfileFileChange(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP image files are supported.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="profile-name" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="profile-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="profile-role" className="text-sm font-medium">
              Role
            </label>
            <Select value={roleId} onValueChange={setRoleId}>
              <SelectTrigger id="profile-role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role: RoleOption) => (
                  <SelectItem key={role._id} value={role._id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Current role: {getRoleName(profile?.role)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button type="submit" disabled={updateAdminMutation.isPending}>
            {updateAdminMutation.isPending ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
