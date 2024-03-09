import { useState } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { Label } from "@radix-ui/react-label";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SignUpProps {
  isLoading: boolean;
  successMessage: null | string;
  handleSignupSubmit: (data: { signupUsername: string; signupPassword: string }) => Promise<void>;
}

const SignUp: React.FC<SignUpProps> = ({ isLoading, successMessage, handleSignupSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    signupUsername: string;
    signupPassword: string;
  }>({ criteriaMode: "all" });

  return (
    <form onSubmit={handleSubmit(handleSignupSubmit)}>
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>Create a new account and be part of our community.</CardDescription>
        </CardHeader>
        <CardContent>
          {successMessage && <Label className="text-md mb-4 text-green-500">{successMessage}</Label>}
          <div className="space-y-2">
            <Label className="mt-2 block" htmlFor="signupUsername">
              Username
            </Label>
            <Input
              id="signupUsername"
              {...register("signupUsername", {
                required: "Username is required.",
                minLength: {
                  value: 4,
                  message: "Username must be at least 4 characters long.",
                },
              })}
              placeholder="Choose a username"
              disabled={isLoading}
            />
            <ErrorMessage
              errors={errors}
              name="signupUsername"
              render={({ messages }) =>
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <Label key={type} className="text-md text-red-500">
                    {message}
                  </Label>
                ))
              }
            />

            <Label className="mt-2 block" htmlFor="signupPassword">
              Password
            </Label>
            <div className="relative">
              <Input
                id="signupPassword"
                {...register("signupPassword", {
                  required: "Password is required.",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long.",
                  },
                })}
                placeholder="Choose a password"
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="mr-2" /> : <Eye className="mr-2" />}
              </span>
              <ErrorMessage
                errors={errors}
                name="signupPassword"
                render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <Label key={type} className="text-md text-red-500">
                      {message}
                    </Label>
                  ))
                }
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && <Loader className="mr-2 size-4 animate-spin" />}
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default SignUp;
