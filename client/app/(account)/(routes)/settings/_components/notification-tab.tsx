import { Controller, useFormContext } from "react-hook-form";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { SettingsFormData } from "../settings";

const NotificationsTab: React.FC = () => {
  const { control } = useFormContext<SettingsFormData>();

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
        <CardDescription>Manage your email notification preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Controller control={control} name="newsletter" render={({ field: { onChange, value } }) => <Checkbox id="newsletter" onCheckedChange={onChange} checked={value} />} />
            <label htmlFor="newsletter" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Receive newsletter
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Controller control={control} name="updates" render={({ field: { onChange, value } }) => <Checkbox id="updates" onCheckedChange={onChange} checked={value} />} />
            <label htmlFor="updates" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Receive updates
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
