import { useState } from "react";
import {
  VStack,
  Box,
  Heading,
  Text,
  Button,
  Step,
  StepTitle,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  Stepper,
  useSteps,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import MaterialInput from "../components/MaterialInput";
import CategoryFilter from "../components/CategoryFilter";
import DifficultyFilter from "../components/DifficultyFilter";
import { generateProjectIdeas } from "../api/open-ai-api";
import ProjectTabs from "../components/ProjectTabs";

const steps = [
  { title: "Materials", description: "List your available materials or leave it as empty to use random materials" },
  { title: "Generate", description: "Create project ideas" },
  { title: "View", description: "See the generated projects" },
];

const Home = () => {
  const [materials, setMaterials] = useState([""]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("Anything");
  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });
  const [projects, setProjects] = useState([]);

  const mockCategories = ["Anything", "Home Decor", "Fashion", "Garden Projects", "Kids Crafts"];

  const toast = useToast();

  const handleSubmit = async () => {
    try {
      goToNext();

      const response = await generateProjectIdeas(materials, selectedDifficulty, selectedCategory);
      // Check if the data exists in the response
      if (response.data?.ideas) {
        setProjects(response.data.ideas);

        goToNext();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      goToPrevious();
    }
  };

  return (
    <VStack spacing={10} p={5} width="100%">
      <Heading as="h1" mb={5}>
        DIY Project Ideas
      </Heading>
      <Text mb={5}>Ever had a bunch of random materials and thought, "What can I make with these?" Type in what you've got, and we'll give you some DIY project ideas to consider!</Text>

      <Stepper index={activeStep} width="100%">
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
            </StepIndicator>

            <Box flexShrink="2">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            {index !== steps.length - 1 && <StepSeparator />}
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box width="100%">
          <MaterialInput materials={materials} setMaterials={setMaterials} />
          <DifficultyFilter onDifficultyChange={setSelectedDifficulty} />
          <CategoryFilter categories={mockCategories} onCategoryChange={setSelectedCategory} />
          <Button mt={4} onClick={handleSubmit}>
            Next
          </Button>
        </Box>
      )}
      {activeStep === 1 && (
        <Box width="100%" textAlign="center" pt={5}>
          <Spinner size="xl" />
          <Text mt={4}>Generating project ideas...</Text>
        </Box>
      )}
      {activeStep === 2 && (
        <Box width="100%">
          <ProjectTabs projects={projects} />
        </Box>
      )}
    </VStack>
  );
};

export default Home;
