"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ImagePlus, Trash2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmins, useUpdateAdmin, useRoles } from "@/queries";
import toast from "react-hot-toast";

export default function EditAdminPage() {
  const router = useRouter();
  const params = useParams();
  const adminId = params.adminId as string;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRoleId, setEditRoleId] = useState("");
  const [editProfileFile, setEditProfileFile] = useState<File | null>(null);
  const [editProfilePreview, setEditProfilePreview] = useState("");

  const { data: adminsResponse } = useAdmins({});
  const { data: rolesResponse } = useRoles();
  const updateAdminMutation = useUpdateAdmin();

  const admins = adminsResponse?.data?.admins ?? [];
  const admin = admins.find((a) => a._id === adminId);
  const roleOptions = rolesResponse?.data?.roles ?? [];

  // Load existing admin data
  useEffect(() => {
    if (admin) {
      setEditName(admin.username || admin.name || "");
      setEditEmail(admin.email || "");
      const roleId = typeof admin.role === "string" ? admin.role : admin.role?._id || "";
      setEditRoleId(roleId);
      setEditProfilePreview(admin.profile || "");
    }
  }, [admin]);

  const onEditProfileFileChange = (file: File | null) => {
    setEditProfileFile(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setEditProfilePreview(preview);
    } else {
      if (admin?.profile) {
        setEditProfilePreview(admin.profile);
      } else {
        setEditProfilePreview("");
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editName.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!editEmail.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!editRoleId) {
      toast.error("Role is required");
      return;
    }

    updateAdminMutation.mutate(
      {
        adminId,
        payload: {
          username: editName,
          email: editEmail,
          ...(editPassword && { password: editPassword }),
          role: editRoleId,
          profile: editProfileFile,
        },
      },
      {
        onSuccess: () => {
          toast.success("Admin updated successfully");
          router.push("/dashboard/settings/admin");
        },
        onError: (error: unknown) => {
          const message =
            typeof error === "object" && error !== null && "response" in error
              ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
                "Failed to update admin"
              : "Failed to update admin";
          toast.error(message);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-transparent p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="border-border bg-card text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Admin</h1>
            <p className="text-sm text-muted-foreground">
              Update admin account details
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg shadow-slate-900/5">
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Profile Section */}
          <div className="rounded-xl border border-border bg-muted/35 p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">Profile Photo</p>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border bg-background">
                {editProfilePreview ? (
                  <Image
                    src={editProfilePreview}
                    alt="Profile preview"
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xl font-semibold text-muted-foreground">
                    {(editName?.trim()?.charAt(0) || "A").toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    onEditProfileFileChange(e.target.files?.[0] || null)
                  }
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-border bg-background text-foreground hover:bg-accent"
                  >
                    <ImagePlus className="h-4 w-4" />
                    Pick Image
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={!editProfilePreview}
                    onClick={() => onEditProfileFileChange(null)}
                    className="text-foreground hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP image files are supported.
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label htmlFor="edit-admin-name" className="text-sm font-semibold text-foreground">
                Username *
              </label>
              <Input
                id="edit-admin-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g., john.doe"
                className="h-10 border-input bg-background text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-admin-email" className="text-sm font-semibold text-foreground">
                Email *
              </label>
              <Input
                id="edit-admin-email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="e.g., admin@example.com"
                className="h-10 border-input bg-background text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-admin-password" className="text-sm font-semibold text-foreground">
                Password <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                id="edit-admin-password"
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Leave empty to keep current password"
                className="h-10 border-input bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-admin-role" className="text-sm font-semibold text-foreground">
                Role *
              </label>
              <select
                id="edit-admin-role"
                value={editRoleId}
                onChange={(e) => setEditRoleId(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                required
              >
                <option value="" className="text-foreground">Select a role</option>
                {roleOptions.map((role) => (
                  <option key={role._id} value={role._id} className="text-foreground">
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={updateAdminMutation.isPending}
              className="border-border bg-background text-foreground hover:bg-accent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateAdminMutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {updateAdminMutation.isPending ? "Updating..." : "Update Admin"}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
