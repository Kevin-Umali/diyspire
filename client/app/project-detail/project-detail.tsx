"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/authContext";
import withAuth from "@/hocs/withAuth";
import { ProjectDetails, ProjectImages } from "@/interfaces";
import { AxiosError } from "axios";

import { generateProjectExplanations, saveShareLinkData, searchImages } from "@/lib/api-helper";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import ProjectImage from "@/components/project-detail/project-image";
import ProjectInfo from "@/components/project-detail/project-info";
import ProjectSteps from "@/components/project-detail/project-step";
import ShareDialog from "@/components/project-detail/share-dialog";

function ProjectDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isExplanationLoading, setIsExplanationLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [projectExplanation, setProjectExplanation] = useState<string | null>(null);
  const [relatedImages, setRelatedImages] = useState<ProjectImages | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const isMountedRef = useRef(true);

  const { toast } = useToast();
  const { accessToken } = useAuth();

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const title = searchParams.get("title") ?? "";
    const time = searchParams.get("time") ?? "";
    const budget = searchParams.get("budget") ?? "";
    const description = searchParams.get("description") ?? "";

    const materials = searchParams.getAll("materials") ?? [];
    const tools = searchParams.getAll("tools") ?? [];
    const tags = searchParams.getAll("tags") ?? [];

    if (!title || !time || !budget) {
      router.push("/");
      return;
    }

    setProject({
      title,
      time,
      budget,
      description,
      materials,
      tools,
      tags,
    });
  }, [router, searchParams]);

  const fetchProjectExplanation = useCallback(async () => {
    if (!project) return;

    setIsExplanationLoading(true);
    try {
      const explanationResult = await generateProjectExplanations(
        {
          title: project.title,
          materials: project.materials,
          tools: project.tools,
          time: project.time,
          budget: project.budget,
          description: project.description,
        },
        accessToken!,
      );
      setProjectExplanation(explanationResult.data.explanation);
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
      setIsExplanationLoading(false);
    }
  }, [accessToken, project, toast]);

  const fetchProjectImages = useCallback(async () => {
    if (!project) return;

    setIsImageLoading(true);
    try {
      const imageResult = await searchImages(project.title, accessToken!);
      setRelatedImages(imageResult.data);
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
      setIsImageLoading(false);
    }
  }, [accessToken, project, toast]);

  useEffect(() => {
    fetchProjectExplanation();
    fetchProjectImages();
  }, [fetchProjectExplanation, fetchProjectImages]);

  const handleSaveProject = useCallback(async () => {
    try {
      setIsSaving(true);
      if (!shareLink && accessToken) {
        const response = await saveShareLinkData({ projectDetails: project, projectImage: relatedImages, explanation: projectExplanation }, accessToken!);

        setShareLink(`${process.env.NEXT_PUBLIC_PROJECT_URL}/project-detail/${response.data.id}`);
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
      setIsSaving(false);
    }
  }, [accessToken, project, projectExplanation, relatedImages, shareLink, toast]);

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

export default withAuth(ProjectDetail);
