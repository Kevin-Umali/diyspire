import { useState, useEffect } from "react";
import { Container, SimpleGrid, Divider, useToast, useDisclosure, Box, Button, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateProjectExplanations, saveShareLinkData, searchImages } from "../api/open-ai-api";
import { ProjectImage, ProjectInfo, ProjectSteps, ShareModal } from "../components/project-details";
import { RelatedImages, ProjectLocationState } from "../types";

const ProjectDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isLoading, setIsLoading] = useState(true);
  const [projectExplanation, setProjectExplanation] = useState<string | null>(null);
  const [relatedImages, setRelatedImages] = useState<RelatedImages | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [project] = useState<ProjectLocationState | null>(location?.state?.project);
  const toast = useToast();

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
            handleFetchError(explanationResult.reason.message, "Explanation Error");
          }

          if (imageResult.status === "fulfilled") {
            setRelatedImages(imageResult.value.data);
          } else {
            handleFetchError(imageResult.reason.message, "Image Search Error");
          }
        } else {
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleFetchError(error.message, "Data Fetch Error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [project, toast]);

  const handleFetchError = (errorMessage: string, title: string) => {
    toast({
      title,
      description: errorMessage,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  };

  const handleSaveProject = async () => {
    try {
      if (shareLink) {
        return;
      }

      setIsSaving(true);

      const response = await saveShareLinkData(project, relatedImages, projectExplanation);

      setShareLink(`${import.meta.env.VITE_PROJECT_URL}/project-detail/${response.data.id}`);

      toast({
        title: "Project Saved",
        description: "The project details have been successfully saved.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Saving Error",
        description: "An error occurred while saving the project details.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!project) {
    return (
      <Container maxW={"7xl"} py={{ base: 5, sm: 10 }}>
        <Box p={6} textAlign="center">
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            No project details found.
          </Text>
          <Button onClick={() => navigate("/")} variant="outline">
            Go Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW={"7xl"} py={{ base: 5, sm: 10 }}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, md: 10 }}>
        <ProjectImage
          isLoading={isLoading}
          relatedImages={relatedImages}
          projectTitle={project.title}
          onOpen={() => {
            handleSaveProject();
            onOpen();
          }}
        />
        <ShareModal isOpen={isOpen} onClose={onClose} isSaving={isSaving} shareLink={shareLink} />
        <ProjectInfo isLoading={isLoading} project={project} />
      </SimpleGrid>
      <Divider mt={10} />
      <ProjectSteps isLoading={isLoading} projectExplanation={projectExplanation} />
    </Container>
  );
};

export default ProjectDetail;
