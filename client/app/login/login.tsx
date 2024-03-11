"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { AxiosError } from "axios";

import { loginUser, registerUser } from "@/lib/api-helper";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import SignIn from "@/components/login/signin";
import SignUp from "@/components/login/signup";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [tab, setTab] = useState("login");

  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectParams, setRedirectParams] = useState("");

  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    const queryString = new URLSearchParams(searchParams).toString();
    setRedirectParams(queryString);
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(`/generate?${redirectParams}`);
    }
  }, [isAuthenticated, redirectParams, router]);

  const handleLoginSubmit = async (data: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await loginUser(data);
      if (response?.data && login) {
        login({
          user: {
            id: response.data.id,
            username: response.data.username,
          },
          token: response.data.accessToken,
        });
        router.push(`/?${redirectParams}`);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: `API ERROR - ${error.code}`,
          description: error.response?.data.error || "An error occurred while fetching data from the API.",
        });
      } else {
        toast({
          title: "Unexpected Error!",
          description: "An unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (data: { signupUsername: string; signupPassword: string }) => {
    setIsLoading(true);
    try {
      const response = await registerUser(data);
      if (response?.data) {
        setSuccessMessage(response.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: `API ERROR - ${error.code}`,
          description: error.response?.data.error || "An error occurred while fetching data from the API.",
        });
      } else {
        toast({
          title: "Unexpected Error!",
          description: "An unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" disabled={isLoading}>
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" disabled={isLoading}>
            Signup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <SignIn isLoading={isLoading} handleLoginSubmit={handleLoginSubmit} />
        </TabsContent>

        <TabsContent value="signup">
          <SignUp isLoading={isLoading} successMessage={successMessage} handleSignupSubmit={handleSignupSubmit} />
        </TabsContent>
      </Tabs>

      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2">Login or Sign up now</span>
        </div>
      </div>

      <Label className="text-md mt-4 flex justify-center">Free Until It Has Credits</Label>
    </div>
  );
}
