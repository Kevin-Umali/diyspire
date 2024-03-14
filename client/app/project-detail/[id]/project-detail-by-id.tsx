"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useShareLinkData } from "@/api/queries";
import { AxiosError } from "axios";

import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import ProjectImage from "@/components/project-detail/project-image";
import ProjectInfo from "@/components/project-detail/project-info";
import ProjectSteps from "@/components/project-detail/project-step";
import ShareDialog from "@/components/project-detail/share-dialog";

export default function ProjectDetailById({ params }: { params: { id: string } }) {
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const { toast } = useToast();

  const { data: shareLinkData, error, isLoading } = useShareLinkData(params.id);

  useEffect(() => {
    if (!params.id) {
      toast({
        title: "Oops!",
        description: "Not found",
      });

      router.push("/community");
      return;
    }

    if (error && error instanceof AxiosError) {
      toast({
        title: `API ERROR - ${error.code}`,
        description: error.response?.data.error || "An error occurred while fetching data from the API.",
      });
    }

    if (error) {
      toast({
        title: "Unexpected Error!",
        description: "An unexpected error occurred. Please try again later.",
      });
    }
  }, [error, params.id, router, toast]);

  return (
    <div className="container mx-auto py-5 sm:py-10">
      {shareLinkData?.data && (
        <>
          <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2">
            <ProjectImage
              isLoading={isLoading}
              isLoaded={isLoading}
              relatedImages={shareLinkData.data.projectImage}
              projectTitle={shareLinkData.data.projectDetails.title}
              onOpen={() => {
                setShareLink(`${process.env.NEXT_PUBLIC_PROJECT_URL}/project-detail/${params.id}`);
                setIsOpen(true);
              }}
            />
            <ShareDialog isOpen={isOpen} onClose={() => setIsOpen(false)} isSaving={false} shareLink={shareLink} />
            <ProjectInfo isLoading={isLoading} project={shareLinkData.data.projectDetails} />
          </div>
          <Separator className="mt-10" />
          <ProjectSteps isLoading={isLoading} projectExplanation={shareLinkData.data.explanation} />
        </>
      )}
    </div>
  );
}
