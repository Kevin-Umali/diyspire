"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCommunityProjectBySlugData } from "@/api/queries";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import ProjectImage from "@/components/project-detail/project-image";
import ProjectInfo from "@/components/project-detail/project-info";
import ProjectSteps from "@/components/project-detail/project-step";
import ShareDialog from "@/components/project-detail/share-dialog";

export default function ProjectDetailBySlug({ params }: { params: { slug: string } }) {
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const { data: communityProjectData, error, isLoading } = useCommunityProjectBySlugData(params.slug);

  useEffect(() => {
    if (!params.slug) {
      toast.info("Oops!", {
        description: "Not found",
      });

      router.push("/community");
      return;
    }

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
  }, [error, params.slug, router]);

  return (
    <div className="container mx-auto py-5 sm:py-10">
      {communityProjectData?.data && (
        <>
          <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2">
            <ProjectImage
              isLoading={isLoading}
              isLoaded={isLoading}
              relatedImages={communityProjectData.data.projectImage}
              projectTitle={communityProjectData.data.projectDetails.title}
              onOpen={() => {
                setShareLink(`${process.env.NEXT_PUBLIC_PROJECT_URL}/project-detail/${params.slug}`);
                setIsOpen(true);
              }}
            />
            <ShareDialog isOpen={isOpen} onClose={() => setIsOpen(false)} isSaving={false} shareLink={shareLink} />
            <ProjectInfo isLoading={isLoading} project={communityProjectData.data.projectDetails} />
          </div>
          <Separator className="mt-10" />
          <ProjectSteps isLoading={isLoading} projectExplanation={communityProjectData.data.explanation} />
        </>
      )}
    </div>
  );
}
