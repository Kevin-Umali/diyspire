"use client";

import { useState } from "react";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";

import { subscribeToNewsletter } from "@/lib/api-helper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<{ email: string }>({ criteriaMode: "all" });
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  const onSubmit = async (data: { email: string }) => {
    setSubmissionStatus("pending");
    try {
      await subscribeToNewsletter(data.email);
      setSubmissionStatus("success");
      reset();
      setTimeout(() => setSubmissionStatus("idle"), 5000);
    } catch (error) {
      setSubmissionStatus("error");
    }
  };

  return (
    <form className="border-t px-4 py-12" onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-auto max-w-xl text-center">
        <Label htmlFor="email" className="block text-3xl font-bold">
          Get Creative with DIY Ideas!
        </Label>
        <Label htmlFor="email" className="mt-3 block">
          Sign up for our newsletter and receive innovative DIY ideas directly to your inbox.
        </Label>
        <div className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Input
            id="email"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Entered value does not match email format.",
              },
            })}
            placeholder="Enter your email"
            type="email"
            className="w-full rounded-l-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:flex-1"
          />
          <Button type="submit" className="mt-4 w-full rounded-lg px-8 py-2 font-bold transition-colors sm:mt-0 sm:w-auto">
            {submissionStatus === "pending" ? "Subscribing..." : "Subscribe"}
          </Button>
        </div>
        {submissionStatus === "success" && <p className="mt-4 text-green-500">Thanks for subscribing!</p>}
        {submissionStatus === "error" && <p className="mt-4 text-red-500">Failed to subscribe or Email already subscribed. Please try again.</p>}
      </div>
    </form>
  );
};

export default Newsletter;
