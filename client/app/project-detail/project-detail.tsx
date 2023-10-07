"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { RelatedImages, ProjectLocationState } from "@/interfaces";
import ProjectImage from "@/components/project-detail/project-image";
import ShareDialog from "@/components/project-detail/share-dialog";
import ProjectInfo from "@/components/project-detail/project-info";
import ProjectSteps from "@/components/project-detail/project-step";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { generateProjectExplanations, saveShareLinkData, searchImages } from "@/lib";

export default function ProjectDetail() {
  const searchParams = useSearchParams();
  const projectParams: ProjectLocationState = JSON.parse(searchParams.get("project") as string);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [projectExplanation, setProjectExplanation] = useState<string | null>(null);
  const [relatedImages, setRelatedImages] = useState<RelatedImages | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [project] = useState<ProjectLocationState | null>(projectParams);
  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        if (project) {
          const [explanationResult, imageResult] = await Promise.allSettled([
            generateProjectExplanations(project.title, project.materials, project.tools, project.time, project.budget, project.description),
            searchImages(project.title),
          ]);

          if (explanationResult.status === "fulfilled") {
            setProjectExplanation(explanationResult.value.data.explanation);
          } else {
            toast({ title: "Explanation Error", description: "Failed to generate project explanation." });
          }

          if (imageResult.status === "fulfilled") {
            setRelatedImages(imageResult.value.data);
          } else {
            toast({ title: "Image Search Error", description: "Failed to fetch related images." });
          }
        } else {
          return;
        }
      } catch (error) {
        toast({ title: "Data Fetch Error", description: "An error occurred while fetching project data." });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [project, toast]);

  const handleSaveProject = useCallback(async () => {
    try {
      if (shareLink) {
        return;
      }

      setIsSaving(true);

      const response = await saveShareLinkData(project, relatedImages, projectExplanation);

      setShareLink(`${process.env.NEXT_PUBLIC_PROJECT_URL}/project-detail/${response.data.id}`);

      toast({
        title: "Project Saved",
        description: "The project details have been successfully saved.",
      });
    } catch (error) {
      toast({
        title: "Saving Error",
        description: "An error occurred while saving the project details.",
      });
    } finally {
      setIsSaving(false);
    }
  }, [project, projectExplanation, relatedImages, shareLink, toast]);

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
            handleSaveProject();
            setIsOpen(true);
          }}
        />
        <ShareDialog isOpen={isOpen} onClose={() => setIsOpen(false)} isSaving={isSaving} shareLink={shareLink} />
        <ProjectInfo isLoading={isLoading} project={project} />
      </div>
      <Separator className="mt-10" />
      <ProjectSteps isLoading={isLoading} projectExplanation={projectExplanation} />
    </div>
  );
}
