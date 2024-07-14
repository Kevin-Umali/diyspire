"use client";

import { useEffect, useState } from "react";
import { useAccountSettings, useSaveAccountSettings } from "@/api/queries";
import { useAuth } from "@/context/authContext";
import withAuth from "@/hocs/withAuth";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotificationsTab from "@/account/components/notification-tab";
import PasswordTab from "@/account/components/password-tab";
import ProfileTab from "@/account/components/profile-tab";

export interface SettingsFormData {
  username: string;
  email: string;
  fullName: string;
  newsletter: boolean;
  updates: boolean;
  currentPassword: string;
  newPassword: string;
}

const Settings = () => {
  const { accessToken, logout } = useAuth();

  const queryClient = useQueryClient();

  const { data: accountSettings } = useAccountSettings(accessToken!);

  const [initialUsername, setInitialUsername] = useState("");

  const methods = useForm<SettingsFormData>({
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      newsletter: false,
      updates: false,
      currentPassword: "",
      newPassword: "",
    },
    mode: "onBlur",
    criteriaMode: "all",
  });

  useEffect(() => {
    if (accountSettings) {
      methods.reset({
        username: accountSettings?.data.username,
        email: accountSettings?.data.profile.email,
        fullName: accountSettings?.data.profile.fullName,
        newsletter: accountSettings?.data.notifications.isNewsletterEnabled,
        updates: accountSettings?.data.notifications.isUpdatesEnabled,
      });
      setInitialUsername(accountSettings?.data.username);
    }
  }, [accountSettings, methods]);

  const { mutate, isPending } = useSaveAccountSettings();

  const onSubmit = (data: SettingsFormData) => {
    mutate(
      {
        params: {
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          newsletter: data.newsletter,
          updates: data.updates,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        accessToken: accessToken!,
      },
      {
        onSuccess: () => {
          console.log(data.username, initialUsername);
          if (data.username !== initialUsername) {
            toast.info("Settings saved successfully! Logging out in 3 seconds...");
            setTimeout(() => {
              logout!();
            }, 3000);
          } else {
            queryClient.invalidateQueries({ queryKey: ["account"] });
          }
        },
        onError: (error) => {
          if (error && error instanceof AxiosError) {
            const errorMessage = error.response?.data.error || "An error occurred while fetching data from the API.";

            toast.error(`API ERROR - ${error.code}`, {
              description: errorMessage,
            });
          } else if (error) {
            toast.error("Unexpected Error!", {
              description: "An unexpected error occurred. Please try again later.",
            });
          }
        },
      },
    );
  };

  return (
    <>
      <div className="flex flex-col">
        <h1 className="mb-1 text-3xl font-semibold lg:text-4xl">Settings</h1>
        <Label className="text-md mb-5 mt-2 block text-sm">Manage your application settings.</Label>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full flex-1 flex-col">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Tabs defaultValue="profile">
                <div className="flex items-center">
                  <TabsList>
                    <TabsTrigger value="profile">
                      Profile
                      {(methods.formState.errors.username || methods.formState.errors.email || methods.formState.errors.fullName) && <span className="ml-2 text-red-500">*</span>}
                    </TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="password">
                      Password
                      {(methods.formState.errors.currentPassword || methods.formState.errors.newPassword) && <span className="ml-2 text-red-500">*</span>}
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="profile">
                  <ProfileTab />
                </TabsContent>
                <TabsContent value="notifications">
                  <NotificationsTab />
                </TabsContent>
                <TabsContent value="password">
                  <PasswordTab />
                </TabsContent>
              </Tabs>
              <CardFooter className="px-6 py-4">
                <Button className="ml-auto flex w-1/2" type="submit" disabled={isPending}>
                  {isPending && <Loader className="mr-2 size-4 animate-spin" />}
                  Save
                </Button>
              </CardFooter>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default withAuth(Settings);
