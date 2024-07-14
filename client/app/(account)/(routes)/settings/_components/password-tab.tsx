import { useFormContext } from "react-hook-form";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { SettingsFormData } from "../settings";

const PasswordTab: React.FC = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<SettingsFormData>();

  const currentPasswordValue = watch("currentPassword");
  const newPasswordValue = watch("newPassword");

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your account password.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label className="mt-2 block" htmlFor="currentPassword">
            Current Password
          </Label>
          <Input
            id="currentPassword"
            type="password"
            {...register("currentPassword", {
              required: newPasswordValue ? "Current password is required if setting a new password." : false,
            })}
            placeholder="Your current password"
          />
          {errors.currentPassword && <Label className="text-red-500">{errors.currentPassword.message}</Label>}

          <Label className="mt-2 block" htmlFor="newPassword">
            New Password
          </Label>
          <Input
            id="newPassword"
            type="password"
            {...register("newPassword", {
              required: currentPasswordValue ? "New password is required." : false,
              minLength: currentPasswordValue
                ? {
                    value: 6,
                    message: "New password must be at least 6 characters long.",
                  }
                : undefined,
            })}
            placeholder="Your new password"
          />
          {errors.newPassword && <Label className="text-red-500">{errors.newPassword.message}</Label>}
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordTab;
