import { useFormContext } from "react-hook-form";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { SettingsFormData } from "../settings";

const ProfileTab: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<SettingsFormData>();

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile information.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label className="mt-2 block" htmlFor="username">
            Username
          </Label>
          <Input
            id="username"
            {...register("username", {
              required: "Username is required.",
              minLength: {
                value: 4,
                message: "Username must be at least 4 characters long.",
              },
            })}
            placeholder="Your username"
          />
          {errors.username && <Label className="text-md text-red-500">{errors.username.message}</Label>}

          <Label className="mt-2 block" htmlFor="email">
            Email Address
          </Label>
          <Input
            id="email"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address.",
              },
            })}
            placeholder="Your email"
          />
          {errors.email && <Label className="text-md text-red-500">{errors.email.message}</Label>}

          <Label className="mt-2 block" htmlFor="fullName">
            Full Name
          </Label>
          <Input
            id="fullName"
            {...register("fullName", {
              required: "Full name is required.",
              minLength: {
                value: 2,
                message: "Full name must be at least 2 characters long.",
              },
            })}
            placeholder="Your full name"
          />
          {errors.fullName && <Label className="text-md text-red-500">{errors.fullName.message}</Label>}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
