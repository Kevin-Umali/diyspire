"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { AxiosError } from "axios";
import { Eye, EyeOff, Loader } from "lucide-react";

import { loginUser, registerUser } from "@/lib/api-helper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({ username: "", password: "" });
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>("");
  const [successMessage, setSuccessMessage] = useState<string | null>("");
  const [signupErrorMessage, setSignUpErrorMessage] = useState<string | null>("");
  const [tab, setTab] = useState<string>("login");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectParams, setRedirectParams] = useState("");

  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    const queryString = new URLSearchParams(searchParams).toString();
    setRedirectParams(queryString);
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleLoginSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      try {
        e.preventDefault();
        setIsLoading(true);
        setLoginErrorMessage("");

        const response = await loginUser(loginData);

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
          setLoginErrorMessage(error.response?.data.error);
        } else {
          setLoginErrorMessage("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [loginData, login, router, redirectParams],
  );

  const handleSignupSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      try {
        e.preventDefault();

        if (signupData.username.length < 6 || signupData.password.length < 6) {
          setSignUpErrorMessage("Username and password should be at least 6 characters long.");
          return;
        }

        setIsLoading(true);
        setSignUpErrorMessage("");

        const response = await registerUser(signupData);
        if (response?.data) {
          handleTabChange("login");
          setSignupData({ username: "", password: "" });
          setSuccessMessage(response.data.message);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setSignUpErrorMessage(error.response?.data.error);
        } else {
          setSignUpErrorMessage("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [signupData],
  );

  const handleTabChange = (value: string) => {
    setTab(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" disabled={isLoading}>
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" disabled={isLoading}>
            Signup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={handleLoginSubmit}>
            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Login to your account and enjoy our services.</CardDescription>
              </CardHeader>
              <CardContent>
                {loginErrorMessage && <Label className="text-md mb-4 text-red-500">{loginErrorMessage}</Label>}
                {successMessage && <Label className="text-md mb-4 text-green-500">{successMessage}</Label>}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={loginData.username}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, username: e.target.value }))}
                    placeholder="Your username"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="username"
                    autoCorrect="off"
                    required
                    disabled={isLoading}
                  />

                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Your password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      disabled={isLoading}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <EyeOff className="mr-2" /> : <Eye className="mr-2" />}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={handleSignupSubmit}>
            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Signup</CardTitle>
                <CardDescription>Create a new account and be part of our community.</CardDescription>
              </CardHeader>
              <CardContent>
                {signupErrorMessage && <Label className="text-md mb-4 text-red-500">{signupErrorMessage}</Label>}
                <div className="space-y-2">
                  <Label htmlFor="signupUsername">Username</Label>
                  <Input
                    id="signupUsername"
                    value={signupData.username}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, username: e.target.value }))}
                    placeholder="Choose a username"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="username"
                    autoCorrect="off"
                    required
                    disabled={isLoading}
                  />

                  <Label htmlFor="signupPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="signupPassword"
                      value={signupData.password}
                      onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Choose a password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      disabled={isLoading}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <EyeOff className="mr-2" /> : <Eye className="mr-2" />}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Up
                </Button>
              </CardFooter>
            </Card>
          </form>
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

      <Label className="text-md mt-4 flex justify-center">No Credit Card Required</Label>
    </div>
  );
}
