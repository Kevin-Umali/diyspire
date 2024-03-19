"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGenerateProjectExplanations, useSaveProjectData, useSearchImages } from "@/api/queries";
import { useAuth } from "@/context/authContext";
import withAuth from "@/hocs/withAuth";
import { ProjectDetails } from "@/interfaces";
import { AxiosError } from "axios";

import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import ProjectImage from "@/components/project-detail/project-image";
import ProjectInfo from "@/components/project-detail/project-info";
import ProjectSteps from "@/components/project-detail/project-step";
import ShareDialog from "@/components/project-detail/share-dialog";

function ProjectDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [shareLink, setShareLink] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const isMountedRef = useRef(true);

  const { toast } = useToast();
  const { accessToken } = useAuth();

  const { mutate: mutateGenerateProjectExplanations, data: projectExplanation, isPending: isExplanationPending } = useGenerateProjectExplanations();
  const { mutate: mutateSaveProjectData, isPending: isSavingPending } = useSaveProjectData();
  const { data: relatedImages, error: imageError, isLoading: isImageLoading, isSuccess } = useSearchImages(project?.title ?? "", accessToken!);

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

  useEffect(() => {
    if (!project || !accessToken || !isSuccess) return;

    const handleError = (error: Error) => {
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
    };
    const { title, materials, tools, time, budget, description } = project;

    mutateGenerateProjectExplanations(
      {
        params: {
          title,
          materials,
          tools,
          time,
          budget,
          description,
        },
        accessToken: accessToken!,
      },
      {
        onSuccess: ({ data: { explanation } }, _variables, _context) => {
          if (!explanation || shareLink) return;
          mutateSaveProjectData(
            {
              params: {
                projectDetails: project,
                projectImage: relatedImages?.data,
                explanation: explanation,
              },
              accessToken: accessToken!,
            },
            {
              onSuccess: ({ data }) => setShareLink(`${process.env.NEXT_PUBLIC_PROJECT_URL}/project-detail/${data.slug}`),
              onError: handleError,
            },
          );
        },
        onError: handleError,
      },
    );
  }, [accessToken, mutateGenerateProjectExplanations, mutateSaveProjectData, project, relatedImages?.data, shareLink, toast]);

  useEffect(() => {
    if (imageError && imageError instanceof AxiosError) {
      toast({
        title: `API ERROR - ${imageError.code}`,
        description: imageError.response?.data.error || "An error occurred while fetching data from the API.",
      });
    }

    if (imageError) {
      toast({
        title: "Unexpected Error!",
        description: "An unexpected error occurred. Please try again later.",
      });
    }
  }, [imageError, toast]);

  return (
    <div className="container mx-auto py-5 sm:py-10">
      {project && (
        <>
          <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2">
            <ProjectImage isLoading={isImageLoading} isLoaded={isExplanationPending} relatedImages={relatedImages?.data} projectTitle={project.title} onOpen={() => setIsOpen(true)} />
            <ShareDialog isOpen={isOpen} onClose={() => setIsOpen(false)} isSaving={isSavingPending} shareLink={shareLink} />
            <ProjectInfo isLoading={isImageLoading} project={project} />
          </div>
          <Separator className="mt-10" />
          <ProjectSteps isLoading={isExplanationPending} projectExplanation={projectExplanation?.data.explanation ?? ""} />
        </>
      )}
    </div>
  );
}

export default withAuth(ProjectDetail);
