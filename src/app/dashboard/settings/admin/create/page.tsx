"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Trash2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateAdmin, useRoles } from "@/queries";
import toast from "react-hot-toast";

export default function CreateAdminPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState("");

  const { data: rolesResponse } = useRoles();
  const createAdminMutation = useCreateAdmin();

  const roleOptions = rolesResponse?.data?.roles ?? [];

  const onProfileFileChange = (file: File | null) => {
    setProfileFile(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setProfilePreview(preview);
    } else {
      setProfilePreview("");
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (!roleId) {
      toast.error("Role is required");
      return;
    }

    createAdminMutation.mutate(
      {
        username: name,
        email,
        password,
        role: roleId,
        profile: profileFile,
      },
      {
        onSuccess: () => {
          toast.success("Admin created successfully");
          router.push("/dashboard/settings/admin");
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "Failed to create admin";
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
            <h1 className="text-2xl font-bold text-foreground">Create Admin</h1>
            <p className="text-sm text-muted-foreground">
              Add a new admin account to your system
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
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    onProfileFileChange(e.target.files?.[0] || null)
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
                    disabled={!profilePreview}
                    onClick={() => onProfileFileChange(null)}
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
              <label htmlFor="admin-name" className="text-sm font-semibold text-foreground">
                Username *
              </label>
              <Input
                id="admin-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., john.doe"
                className="h-10 border-input bg-background text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-email" className="text-sm font-semibold text-foreground">
                Email *
              </label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., admin@example.com"
                className="h-10 border-input bg-background text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-sm font-semibold text-foreground">
                Password *
              </label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password"
                className="h-10 border-input bg-background text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-role" className="text-sm font-semibold text-foreground">
                Role *
              </label>
              <select
                id="admin-role"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                required
              >
                <option value="" className="text-foreground">
                  Select a role
                </option>
                {roleOptions.map((role) => (
                  <option
                    key={role._id}
                    value={role._id}
                    className="text-foreground"
                  >
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
              disabled={createAdminMutation.isPending}
              className="border-border bg-background text-foreground hover:bg-accent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAdminMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {createAdminMutation.isPending ? "Creating..." : "Create Admin"}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
