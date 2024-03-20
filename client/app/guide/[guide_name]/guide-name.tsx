"use client";

import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useGuideByPath } from "@/api/queries";
import { AxiosError } from "axios";

import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import CustomMarkdown from "@/components/custom-markdown";

export default function HowToGuideDetail({ params }: { params: { guide_name: string } }) {
  const router = useRouter();

  const { data: guideDetails, error, isLoading } = useGuideByPath(params.guide_name);
  const { toast } = useToast();

  useEffect(() => {
    if (!params.guide_name) {
      toast({
        title: "Oops!",
        description: "Not found",
      });

      router.push("/guide");
      return;
    }

    if (error && error instanceof AxiosError) {
      const errorMessage = error.response?.data.error || "An error occurred while fetching data from the API.";

      toast({
        title: `API ERROR - ${error.code}`,
        description: errorMessage,
      });
    } else if (error) {
      toast({
        title: "Unexpected Error!",
        description: "An unexpected error occurred. Please try again later.",
      });
    }
  }, [error, params.guide_name, router, toast]);

  return (
    <div className="container mx-auto p-5 sm:p-10">
      <Head>
        {guideDetails && (
          <>
            <title>{guideDetails.data.metadata.title}</title>
            <meta name="description" content={guideDetails.data.content.substring(0, 150) + " ..."} />
          </>
        )}
      </Head>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-lg sm:text-xl lg:text-2xl">&ldquo;MakeMeDIYspire&rdquo; Guides</h1>
          </div>

          {guideDetails && (
            <div className="w-full p-4">
              <CustomMarkdown content={guideDetails.data.content} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
