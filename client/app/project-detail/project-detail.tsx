"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError, ProjectDetails, ProjectImages } from "@/interfaces";
import { generateProjectExplanations, saveShareLinkData, searchImages } from "@/lib";

import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import ProjectImage from "@/components/project-detail/project-image";
import ProjectInfo from "@/components/project-detail/project-info";
import ProjectSteps from "@/components/project-detail/project-step";
import ShareDialog from "@/components/project-detail/share-dialog";

export default function ProjectDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectParams: ProjectDetails = JSON.parse(searchParams.get("project") as string);

  const [isExplanationLoading, setIsExplanationLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [projectExplanation, setProjectExplanation] = useState<string | null>(null);
  const [relatedImages, setRelatedImages] = useState<ProjectImages | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [project] = useState<ProjectDetails | null>(projectParams);
  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (!project) {
      router.push("/");
    }
  }, [project, router]);

  useEffect(() => {
    async function fetchExplanation() {
      setIsExplanationLoading(true);
      try {
        if (project) {
          const explanationResult = await generateProjectExplanations({
            title: project.title,
            materials: project.materials,
            tools: project.tools,
            time: project.time,
            budget: project.budget,
            description: project.description,
          });
          setProjectExplanation(explanationResult.data.explanation);
        }
      } catch (error) {
        const apiError = error as ApiError;

        if (apiError.statusCode) {
          toast({
            title: "API Error!",
            description: apiError.message || "An error occurred while fetching data from the API.",
          });
        } else {
          toast({
            title: "Unexpected Error!",
            description: "An unexpected error occurred. Please try again later.",
          });
        }
      } finally {
        setIsExplanationLoading(false);
      }
    }
    fetchExplanation();
  }, [project, toast]);

  useEffect(() => {
    async function fetchImages() {
      setIsImageLoading(true);
      try {
        if (project) {
          const imageResult = await searchImages(project.title);
          setRelatedImages(imageResult.data);
        }
      } catch (error) {
        const apiError = error as ApiError;

        if (apiError.statusCode) {
          toast({
            title: "API Error!",
            description: apiError.message || "An error occurred while fetching data from the API.",
          });
        } else {
          toast({
            title: "Unexpected Error!",
            description: "An unexpected error occurred. Please try again later.",
          });
        }
      } finally {
        setIsImageLoading(false);
      }
    }
    fetchImages();
  }, [project, toast]);

  const handleSaveProject = useCallback(async () => {
    try {
      setIsSaving(true);
      if (!shareLink) {
        const response = await saveShareLinkData({ projectDetails: project, projectImage: relatedImages, explanation: projectExplanation });

        setShareLink(`${process.env.NEXT_PUBLIC_PROJECT_URL}/project-detail/${response.data.id}`);
      }
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.statusCode) {
        toast({
          title: "API Error!",
          description: apiError.message || "An error occurred while fetching data from the API.",
        });
      } else {
        toast({
          title: "Unexpected Error!",
          description: "An unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      setIsSaving(false);
    }
  }, [project, projectExplanation, relatedImages, shareLink, toast]);

  return (
    <div className="container mx-auto py-5 sm:py-10">
      {project && (
        <>
          <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2">
            <ProjectImage
              isLoading={isImageLoading}
              isLoaded={isExplanationLoading}
              relatedImages={relatedImages}
              projectTitle={project.title}
              onOpen={() => {
                handleSaveProject();
                setIsOpen(true);
              }}
            />
            <ShareDialog isOpen={isOpen} onClose={() => setIsOpen(false)} isSaving={isSaving} shareLink={shareLink} />
            <ProjectInfo isLoading={isImageLoading} project={project} />
          </div>
          <Separator className="mt-10" />
          <ProjectSteps isLoading={isExplanationLoading} projectExplanation={projectExplanation} />
        </>
      )}
    </div>
  );
}
