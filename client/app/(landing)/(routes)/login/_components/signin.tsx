import { useState } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { Label } from "@radix-ui/react-label";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SignInProps {
  isLoading: boolean;
  handleLoginSubmit: (data: { username: string; password: string }) => Promise<void>;
}

const SignIn: React.FC<SignInProps> = ({ isLoading, handleLoginSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    username: string;
    password: string;
  }>({ criteriaMode: "all" });

  return (
    <form onSubmit={handleSubmit(handleLoginSubmit)}>
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your account and enjoy our services.</CardDescription>
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
              disabled={isLoading}
            />
            <ErrorMessage
              errors={errors}
              name="username"
              render={({ messages }) =>
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <Label key={type} className="text-md text-red-500">
                    {message}
                  </Label>
                ))
              }
            />

            <Label className="mt-2 block" htmlFor="password">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long.",
                  },
                })}
                placeholder="Your password"
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="mr-2" /> : <Eye className="mr-2" />}
              </span>
              <ErrorMessage
                errors={errors}
                name="password"
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
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default SignIn;
