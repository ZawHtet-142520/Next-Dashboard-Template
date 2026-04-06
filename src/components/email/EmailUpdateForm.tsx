import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "../ui/input";
import { updateEmailSettingType } from "@/schemas/updateEmailSettingSchema";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

interface EmailUpdateFormProps {
  emailSettingForm: UseFormReturn<updateEmailSettingType>;
  updateEmailSetting: (data: updateEmailSettingType) => void;
  emailSettingLoading: boolean;
  resetEmailSettingForm: () => void;
  isUpdating: boolean;
}

export function EmailUpdateForm({
  emailSettingForm,
  updateEmailSetting,
  emailSettingLoading,
  resetEmailSettingForm,
  isUpdating,
}: EmailUpdateFormProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = emailSettingForm;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        {emailSettingLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading configuration...
          </div>
        ) : (
          <form onSubmit={handleSubmit(updateEmailSetting)}>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3">
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
                <label
                  htmlFor="edit-admin-email"
                  className="text-sm font-medium"
                >
                  Secure
                </label>
                <Select
                  onValueChange={(value) =>
                    setValue("secure", value === "true")
                  }
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
              <div className="space-y-1.5">
                <label htmlFor="edit-from" className="text-sm font-medium">
                  From
                </label>
                <Input
                  id="edit-from"
                  type="string"
                  placeholder="From"
                  {...register("from")}
                />
                {errors.from && (
                  <span className="text-sm text-destructive">
                    {errors.from.message}
                  </span>
                )}
              </div>
              <div className="space-y-1.5 lg:col-span-3 md:col-span-2 sm:col-span-1">
                <label htmlFor="edit-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="edit-email"
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
            </div>
            <div className="my-5 flex justify-end">
              <div className="flex gap-3">
                <Button
                  variant={"outline"}
                  onClick={resetEmailSettingForm}
                  type="button"
                >
                  Reset
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
