"use client";

import { useEffect, useState } from "react";
import { ProjectDetails, ProjectImages } from "@/interfaces";
import { getShareLinkData } from "@/lib";
import { AxiosError } from "axios";

import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import ProjectImage from "@/components/project-detail/project-image";
import ProjectInfo from "@/components/project-detail/project-info";
import ProjectSteps from "@/components/project-detail/project-step";
import ShareDialog from "@/components/project-detail/share-dialog";

export default function ProjectDetailById({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [projectExplanation, setProjectExplanation] = useState<string | null>(null);
  const [relatedImages, setRelatedImages] = useState<ProjectImages | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        if (params.id) {
          const response = await getShareLinkData(params.id);
          setProjectExplanation(response.data.explanation);
          setRelatedImages(response.data.projectImage);
          setProject(response.data.projectDetails);
        } else {
          return;
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            title: `API ERROR - ${error.code}`,
            description: error.response?.data.error || "An error occurred while fetching data from the API.",
          });
        } else {
          toast({
            title: "Unexpected Error!",
            description: "An unexpected error occurred. Please try again later.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [params.id, toast]);

  return (
    <div className="container mx-auto py-5 sm:py-10">
      {project && (
        <>
          <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2">
            <ProjectImage
              isLoading={isLoading}
              isLoaded={isLoading}
              relatedImages={relatedImages}
              projectTitle={project.title}
              onOpen={() => {
                setShareLink(`${process.env.NEXT_PUBLIC_PROJECT_URL}/project-detail/${params.id}`);
                setIsOpen(true);
              }}
            />
            <ShareDialog isOpen={isOpen} onClose={() => setIsOpen(false)} isSaving={false} shareLink={shareLink} />
            <ProjectInfo isLoading={isLoading} project={project} />
          </div>
          <Separator className="mt-10" />
          <ProjectSteps isLoading={isLoading} projectExplanation={projectExplanation} />
        </>
      )}
    </div>
  );
}
