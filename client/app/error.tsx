"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorComponent: React.FC<ErrorProps> = ({ error, reset }) => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center py-5 sm:py-10">
      <div className="p-6 text-center">
        <Label className="mb-2 block text-2xl font-bold">Oops, something went wrong!</Label>
        <Label className="text-md my-4 block">{error.message}</Label>
        <div className="mt-4 flex flex-col space-y-2">
          <Button onClick={() => router.push("/")} className="w-full border px-4 py-2">
            Go Back to Home
          </Button>
          <Button onClick={reset} className="w-full border px-4 py-2">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorComponent;
