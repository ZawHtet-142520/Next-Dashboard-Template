"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWebsiteManagement } from "@/hooks/website/useWebsiteManagement";
import { ArrowLeft, ImagePlus, Trash2, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function CreateWebsitePage() {
  const website = useWebsiteManagement();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const newOrganizationRef = useRef<HTMLInputElement | null>(null);
  const [organizations, setOrganizations] = useState<string[]>([]);

  useEffect(() => {
    if (website.organizationOptions.length > 0)
      setOrganizations(
        website.organizationOptions.filter((organization) => organization),
      );
  }, [website.organizationOptions]);
  const {
    handleSubmit,
    getValues,
    register,
    setValue,
    formState: { errors },
  } = website.createWebsiteForm;

  return (
    <div className="min-h-screen bg-transparent p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={website.closeCreateWebsite}
            className="border-border bg-card text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Create Website
            </h1>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg shadow-slate-900/5">
          <form
            onSubmit={handleSubmit(website.onCreateWebsite)}
            className="space-y-3"
          >
            <div className="rounded-xl border bg-[var(--background)] p-4">
              <p className="mb-3 text-sm font-medium">Website Logo</p>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border bg-slate-200">
                  {website.logoPreview ? (
                    <Image
                      src={website.logoPreview}
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
                    onChange={(e) => {
                      website.onLogoFileChange(
                        e.target.files?.[0] || undefined,
                      );
                      e.target.value = "";
                    }}
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
                      disabled={!website.logoPreview}
                      onClick={() => website.onLogoFileChange(undefined)}
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
                <span className="text-sm text-[var(--destructive)]">
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
                <span className="text-sm text-[var(--destructive)]">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="organization" className="text-sm font-medium">
                Organization
              </label>
              <Select
                onValueChange={(value) => setValue("organization", value)}
              >
                <SelectTrigger className="w-full bg-[var(--background)] text-foreground">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent className="w-[var(--radix-select-trigger-width)] border-border bg-[var(--background)] text-popover-foreground">
                  <div className="max-h-48 overflow-auto">
                    <SelectGroup>
                      <SelectLabel className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Organizations ({organizations?.length || 0})
                      </SelectLabel>
                      {organizations?.length ? (
                        [...new Set([...organizations])].map(
                          (organization, index) => (
                            <SelectItem
                              key={index}
                              value={organization}
                              className="cursor-pointer px-4 py-2.5 hover:bg-accent focus:bg-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
                            >
                              <div className="flex items-center gap-3">
                                <span className="truncate font-medium">
                                  {organization}
                                </span>
                              </div>
                            </SelectItem>
                          ),
                        )
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

                  <div className="mt-2 border-t border-border bg-muted/40 p-2 dark:bg-muted/20">
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-background/80 p-2 transition-all duration-200 hover:bg-accent/60 focus-within:bg-accent/60 dark:bg-background/40">
                      <Input
                        ref={newOrganizationRef}
                        onKeyDown={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        placeholder="Create new organization..."
                        className="h-9 flex-1 border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 dark:bg-background/70"
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
                <span className="text-sm text-[var(--destructive)]">
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
                <span className="text-sm text-[var(--destructive)]">
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
                <span className="text-sm text-[var(--destructive)]">
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
                <span className="text-sm text-[var(--destructive)]">
                  {errors.subject.message}
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={website.closeCreateWebsite}
                disabled={website.isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={website.isCreating}>
                {website.isCreating ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
