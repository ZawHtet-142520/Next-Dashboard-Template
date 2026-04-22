"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWebsiteManagement } from "@/hooks/website/useWebsiteManagement";
import { getWebsiteEmailSetting } from "@/services/websiteService";
import { ArrowLeft, LoaderIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Controller } from "react-hook-form";

export default function ConfigureWebsitePage() {
  const param = useParams();
  const websiteId = param?.websiteId as string;
  const website = useWebsiteManagement();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = website.configrueEmailSettingForm;

  const websiteInfo = website.websites.find(
    (website) => website._id == websiteId,
  );

  useEffect(() => {
    if (!websiteInfo) return;

    const loadEmailSettings = async () => {
      reset({
        host: "",
        port: 0,
        secure: false,
        authUser: "",
        authPass: "",
      });
      if (websiteInfo.emailSetting) {
        const response = await getWebsiteEmailSetting(websiteInfo._id);
        const emailSetting = response.data.emailSetting;

        reset({
          host: emailSetting.host,
          port: emailSetting.port,
          secure: emailSetting.secure,
          authUser: emailSetting.authUser,
          authPass: emailSetting.authPass,
        });
      }
    };
    loadEmailSettings();
  }, [websiteInfo, reset]);

  useEffect(() => {
    if (website && websiteInfo) {
      website.setConfigureId(websiteInfo._id);
    }
  }, [website, websiteInfo]);

  if (website.websiteListLoading)
    return (
      <div className="min-h-screen bg-transparent p-4">
        <div className="mx-auto max-w-2xl space-y-6 flex justify-center items-center h-20">
          <LoaderIcon />
        </div>
      </div>
    );
  if (!websiteInfo)
    return (
      <div className="min-h-screen bg-transparent p-4">
        <div className="mx-auto max-w-2xl space-y-6 flex justify-center items-center h-20">
          There is no website
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-transparent p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={website.closeConfigure}
            className="border-border bg-card text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Configure Email Setting
            </h1>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg shadow-slate-900/5">
          <form
            onSubmit={handleSubmit(website.onConfigureWebsiteEmailSetting)}
            className="space-y-3"
          >
            <div className="space-y-1.5">
              <label htmlFor="edit-host" className="text-sm font-medium">
                Host
              </label>
              <Input
                id="edit-host"
                type="string"
                placeholder="Host"
                {...register("host")}
              />
              {errors.host && (
                <span className="text-sm text-[var(--destructive)]">
                  {errors.host.message}
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="edit-port" className="text-sm font-medium">
                Port
              </label>
              <Input
                id="edit-port"
                type="number"
                placeholder="Port"
                {...register("port", { valueAsNumber: true })}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /[^0-9]/g,
                    "",
                  );
                }}
              />
              {errors.port && (
                <span className="text-sm text-[var(--destructive)]">
                  {errors.port.message}
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="edit-user" className="text-sm font-medium">
                User
              </label>
              <Input
                id="edit-user"
                type="string"
                placeholder="User"
                {...register("authUser")}
              />
              {errors.authUser && (
                <span className="text-sm text-[var(--destructive)]">
                  {errors.authUser.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="edit-password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="edit-password"
                type="string"
                placeholder="Password"
                {...register("authPass")}
              />
              {errors.authPass && (
                <span className="text-sm text-[var(--destructive)]">
                  {errors.authPass.message}
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="edit-admin-email" className="text-sm font-medium">
                Secure
              </label>
              <Controller
                name="secure"
                control={control}
                render={({ field }) => (
                  <Select
                    value={Boolean(field.value) ? "true" : "false"}
                    onValueChange={(value) => field.onChange(value === "true")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--background)]">
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.secure && (
                <span className="text-sm text-[var(--destructive)]">
                  {errors.secure.message}
                </span>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={website.closeConfigure}
                disabled={website.isConfiguring}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={website.isConfiguring}>
                {website.isConfiguring ? "Configuring..." : "Configure"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
