"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { UpdateWebsiteEmailSettingType } from "@/schemas/updateWebsiteEmailSettingSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ConfigureWebsiteEmailSettingModalProps {
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  configureEmailSettingForm: UseFormReturn<UpdateWebsiteEmailSettingType>;
  onSubmit: (data: UpdateWebsiteEmailSettingType) => void;
}

export function ConfigureWebsiteEmailSettingModal({
  open,
  isPending,
  onClose,
  configureEmailSettingForm,
  onSubmit,
}: ConfigureWebsiteEmailSettingModalProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = configureEmailSettingForm;
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Configure Setting</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
              <span className="text-sm text-destructive">
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
              <span className="text-sm text-destructive">
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
              <span className="text-sm text-destructive">
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
              placeholder="Passowrd"
              {...register("authPass")}
            />
            {errors.authPass && (
              <span className="text-sm text-destructive">
                {errors.authPass.message}
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="edit-admin-email" className="text-sm font-medium">
              Secure {watch("secure") ? "True" : "False"}
            </label>
            <Select
              onValueChange={(value) => setValue("secure", value === "true")}
              value={watch("secure") ? "true" : "false"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
            {errors.secure && (
              <span className="text-sm text-destructive">
                {errors.secure.message}
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
              {isPending ? "Configuring..." : "Configure"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
