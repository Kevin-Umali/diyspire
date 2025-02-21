"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginUser, useRegisterUser } from "@/api/queries";
import { useAuth } from "@/context/authContext";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignIn from "@/landing/components/signin";
import SignUp from "@/landing/components/signup";

export default function Login() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tab, setTab] = useState("login");

  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const [redirectTo, setRedirectTo] = useState("");
  const [searchParams, setSearchParams] = useState("");

  const { login, isAuthenticated } = useAuth();

  const { mutate: mutateLogin, isPending: loginPending } = useLoginUser();
  const { mutate: mutateRegister, isPending: registerPending } = useRegisterUser();

  useEffect(() => {
    const redirectString = decodeURIComponent(urlSearchParams.get("redirect") ?? "/generate");

    setRedirectTo(redirectString.startsWith("/") ? redirectString : `/${redirectString}`);

    const otherParams = new URLSearchParams(urlSearchParams.toString());
    otherParams.delete("redirect");
    const paramsString = otherParams.toString();

    setSearchParams(paramsString.length > 0 ? `?${encodeURIComponent(paramsString)}` : "");
  }, [urlSearchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(`${redirectTo}?${searchParams}`, {});
    }
  }, [isAuthenticated, redirectTo, router, searchParams]);

  const handleLoginSubmit = async (data: { username: string; password: string }) => {
    mutateLogin(data, {
      onSuccess(response, _variables, _context) {
        if (response?.data && login) {
          login({
            user: {
              id: response.data.id,
              username: response.data.username,
            },
            token: response.data.accessToken,
          });
        }

        router.push(`${redirectTo}?${searchParams}`);
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
    });
  };

  const handleSignupSubmit = async (data: { signupUsername: string; signupPassword: string }) => {
    mutateRegister(data, {
      onSuccess(response, _variables, _context) {
        if (response?.message) {
          setSuccessMessage(response.message);
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
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" disabled={loginPending || registerPending}>
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" disabled={registerPending || loginPending}>
            Signup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <SignIn isLoading={loginPending} handleLoginSubmit={handleLoginSubmit} />
        </TabsContent>

        <TabsContent value="signup">
          <SignUp isLoading={registerPending} successMessage={successMessage} handleSignupSubmit={handleSignupSubmit} />
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
