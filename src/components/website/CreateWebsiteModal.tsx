"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateWebsiteType } from "@/schemas/createWebsiteSchema";
import { ImagePlus, Trash2, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CreateWebsiteModalProps {
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onCreateWebsite: (data: CreateWebsiteType) => void;
  createWebsiteForm: UseFormReturn<CreateWebsiteType>;
  logoPreview: string;
  onLogoFileChange: (file: File | undefined) => void;
  organizationOptions: string[];
}

export function CreateWebsiteModal({
  open,
  isPending,
  onClose,
  onCreateWebsite,
  createWebsiteForm,
  logoPreview,
  onLogoFileChange,
  organizationOptions,
}: CreateWebsiteModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const newOrganizationRef = useRef<HTMLInputElement | null>(null);
  const [organizations, setOrganizations] = useState<string[]>([]);

  useEffect(() => {
    setOrganizations(
      organizationOptions.filter((organization) => organization),
    );
  }, [organizationOptions]);
  const {
    handleSubmit,
    getValues,
    register,
    setValue,
    formState: { errors },
  } = createWebsiteForm;

  if (!open) return null;

  return (
    <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg max-h-svh overflow-auto rounded-lg border bg-background p-6 shadow-lg">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Create Website</h2>
          <p className="text-sm text-muted-foreground">Add a new website</p>
        </div>

        <form onSubmit={handleSubmit(onCreateWebsite)} className="space-y-3">
          <div className="rounded-xl border bg-slate-50/60 p-4">
            <p className="mb-3 text-sm font-medium">Website Logo</p>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border bg-slate-200">
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Profile preview"
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xl font-semibold text-slate-600">
                    {(
                      getValues("name")?.trim()?.charAt(0) || "?"
                    ).toUpperCase()}
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
                    onLogoFileChange(e.target.files?.[0] || undefined)
                  }
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="h-4 w-4" />
                    Pick Image
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={!logoPreview}
                    onClick={() => onLogoFileChange(undefined)}
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

          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              type="string"
              placeholder="Name"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-sm text-destructive">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-sm text-destructive">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="organization" className="text-sm font-medium">
              Organization
            </label>
            <Select onValueChange={(value) => setValue("organization", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <div className="max-h-48 overflow-auto">
                  <SelectGroup>
                    <SelectLabel className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Organizations ({organizations?.length || 0})
                    </SelectLabel>
                    {organizations?.length ? (
                      organizations.map((organization, index) => (
                        <SelectItem
                          key={index}
                          value={organization}
                          className="px-4 py-2.5 cursor-pointer hover:bg-accent/50 focus:bg-accent/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary/60" />
                            <span className="truncate font-medium">
                              {organization}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem
                        value="-"
                        disabled
                        className="px-4 py-3 text-muted-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          No organizations yet
                        </div>
                      </SelectItem>
                    )}
                  </SelectGroup>
                </div>

                <div className="mt-2 pt-2 border-t border-border bg-gradient-to-r from-muted/50 to-background">
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent focus-within:bg-accent transition-all duration-200">
                    <Input
                      ref={newOrganizationRef}
                      onKeyDown={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                      placeholder="Create new organization..."
                      className="h-9 flex-1 bg-transparent border-0 shadow-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 px-3 py-1.5 text-sm"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="p-2 flex-shrink-0 border border-dashed border-input hover:bg-background hover:border-primary"
                      onClick={() => {
                        if (newOrganizationRef?.current?.value) {
                          setOrganizations([
                            ...organizations,
                            newOrganizationRef.current.value,
                          ]);
                          newOrganizationRef.current.value = "";
                        }
                      }}
                    >
                      Add New
                    </Button>
                  </div>
                </div>
              </SelectContent>
            </Select>
            {errors.organization && (
              <span className="text-sm text-destructive">
                {errors.organization.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>
            <Input
              id="phone"
              type="string"
              placeholder="Phone"
              {...register("phone")}
            />
            {errors.phone && (
              <span className="text-sm text-destructive">
                {errors.phone.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="url" className="text-sm font-medium">
              URL
            </label>
            <Input
              id="url"
              type="string"
              placeholder="URL"
              {...register("url")}
            />
            {errors.url && (
              <span className="text-sm text-destructive">
                {errors.url.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <Input
              id="subject"
              type="string"
              placeholder="Subject"
              {...register("subject")}
            />
            {errors.subject && (
              <span className="text-sm text-destructive">
                {errors.subject.message}
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
