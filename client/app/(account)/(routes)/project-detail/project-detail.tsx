"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGenerateProjectExplanations, useSaveProjectData, useSearchImages } from "@/api/queries";
import { useAuth } from "@/context/authContext";
import withAuth from "@/hocs/withAuth";
import { ProjectDetails } from "@/interfaces";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
      router.push("/generate");
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
              onSuccess: ({ data }) => setShareLink(`${process.env.NEXT_PUBLIC_PROJECT_URL}/community/project-detail/${data.slug}`),
              onError: handleError,
            },
          );
        },
        onError: handleError,
      },
    );
  }, [accessToken, isSuccess, mutateGenerateProjectExplanations, mutateSaveProjectData, project, relatedImages?.data, shareLink]);

  useEffect(() => {
    if (imageError && imageError instanceof AxiosError) {
      const errorMessage = imageError.response?.data.error || "An error occurred while fetching data from the API.";

      toast.error(`API ERROR - ${imageError.code}`, {
        description: errorMessage,
      });
    } else if (imageError) {
      toast.error("Unexpected Error!", {
        description: "An unexpected error occurred. Please try again later.",
      });
    }
  }, [imageError]);

  return (
    <>
      <div className="flex flex-col">
        <h1 className="mb-1 text-3xl font-semibold lg:text-4xl">Project Detail</h1>
        <Label className="text-md mb-5 mt-2 block text-sm">Here you can see the details of your generated diy project idea and share it.</Label>
      </div>
      {project && (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full flex-1 flex-col">
            <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2">
              <ProjectImage isLoading={isImageLoading} isLoaded={isExplanationPending} relatedImages={relatedImages?.data} projectTitle={project.title} onOpen={() => setIsOpen(true)} />
              <ShareDialog isOpen={isOpen} onClose={() => setIsOpen(false)} isSaving={isSavingPending} shareLink={shareLink} />
              <ProjectInfo isLoading={isImageLoading} project={project} />
            </div>
            <Separator className="mt-10" />
            <ProjectSteps isLoading={isExplanationPending} projectExplanation={projectExplanation?.data.explanation ?? ""} />
          </div>
        </div>
      )}
    </>
  );
}

export default withAuth(ProjectDetail);
