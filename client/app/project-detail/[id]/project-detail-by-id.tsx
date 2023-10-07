"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProjectImage from "@/components/project-detail/project-image";
import ShareDialog from "@/components/project-detail/share-dialog";
import ProjectInfo from "@/components/project-detail/project-info";
import ProjectSteps from "@/components/project-detail/project-step";
import { RelatedImages, ProjectLocationState } from "@/interfaces";
import { useToast } from "@/components/ui/use-toast";
import { getShareLinkData } from "@/lib";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ProjectDetailById({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [projectExplanation, setProjectExplanation] = useState<string | null>(null);
  const [relatedImages, setRelatedImages] = useState<RelatedImages | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectLocationState | null>(null);
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
      } catch (error: any) {
        toast({
          title: "Data Fetch Error",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [params.id, project, toast]);

  if (!project) {
    return (
      <div className="container mx-auto py-5 sm:py-10 text-center">
        <div className="p-6">
          <Label className="text-xl font-bold mb-4">No project details found.</Label>
          <Button onClick={() => router.push("/")} className="border py-2 px-4 hover:bg-gray-200">
            Go Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-5 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        <ProjectImage
          isLoading={isLoading}
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
    </div>
  );
}
