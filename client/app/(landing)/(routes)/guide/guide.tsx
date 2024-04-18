"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useGuides } from "@/api/queries";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function HowToGuidesList() {
  const { data: guides, error, isLoading: loading } = useGuides();

  useEffect(() => {
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
  }, [error]);

  return (
    <>
      <div className="container mx-auto px-5 py-12 sm:px-10">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-3xl font-semibold lg:text-4xl">&ldquo;DIYspire&rdquo; Guides</h1>
          <Label className="sm:text-md mt-2 inline-block text-sm">From usage to troubleshooting, explore our detailed guides to get the most out of the DIY project generator.</Label>
        </div>

        {loading ? (
          [...Array(2)].map((_, i) => (
            <div key={i}>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              {i !== 1 && <Separator className="my-4" />}
            </div>
          ))
        ) : (
          <ul>
            {guides?.data.map((guide, index) => (
              <li key={index} className="py-1">
                <Link href={`/guide/${guide.path}`}>{guide.metadata.title}</Link>
                {index !== guides.data.length - 1 && <Separator className="my-4" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
