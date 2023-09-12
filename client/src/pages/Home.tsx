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
  useToast,
  Flex,
  Divider,
  Icon,
} from "@chakra-ui/react";
import MaterialInput from "../components/MaterialInput";
import CategoryFilter from "../components/CategoryFilter";
import DifficultyFilter from "../components/DifficultyFilter";
import { generateProjectIdeas } from "../api/open-ai-api";
import ProjectTabs from "../components/ProjectTabs";
import LoadingComponent from "../components/LoadingComponen";
import { FaRegLightbulb, FaInfoCircle } from "react-icons/fa";
import { categories } from "../constants";

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

  const toast = useToast();

  const handleSubmit = async () => {
    try {
      goToNext();

      const response = await generateProjectIdeas(materials, selectedDifficulty, selectedCategory);

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
      <Box width="100%" bgGradient="linear(to-r, teal.400, blue.500)" borderRadius="lg" p={5} boxShadow="lg">
        <Heading as="h1" mb={3} fontSize={["lg", "xl", "2xl"]}>
          <Icon as={FaRegLightbulb} w={6} h={6} mr={2} />
          DIY Project Ideas
        </Heading>

        <Text fontSize={["sm", "md"]} mb={3}>
          Ever found yourself gazing at random materials scattered around your home, your imagination itching to craft something unique? You're not alone. Here at DIY Project Ideas, we're driven by
          the joy of creation. Whether you have colorful strings, spare wood planks, beads, or even old magazines, there's a world of possibilities waiting for you. Feed your creativity and turn your
          materials into masterpieces. Simply input what you have, sit back, and let us provide you with a treasure trove of DIY projects tailored just for you. Ready to embark on a journey of
          creation?
        </Text>

        <Divider my={3} />

        <Box display="flex" alignItems="center">
          <Icon as={FaInfoCircle} w={5} h={5} mr={2} />
          <Text fontSize="sm" fontStyle="italic" color="gray.600">
            Note: Our system caches suggestions for 10 minutes. If you re-enter the same items within this timeframe, you'll see the same suggestions.
          </Text>
        </Box>
      </Box>

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
        <Box width="100%" p={4} borderWidth="1px" borderRadius="md" borderColor="gray.200">
          <MaterialInput materials={materials} setMaterials={setMaterials} />
          <Box mt={4}>
            {" "}
            <DifficultyFilter onDifficultyChange={setSelectedDifficulty} />
          </Box>
          <Box mt={4}>
            {" "}
            <CategoryFilter categories={categories} onCategoryChange={setSelectedCategory} />
          </Box>
          <Flex mt={4} justifyContent="flex-end">
            {" "}
            <Button width="150px" onClick={handleSubmit}>
              {" "}
              Next
            </Button>
          </Flex>
        </Box>
      )}

      {activeStep === 1 && <LoadingComponent />}
      {activeStep === 2 && (
        <Box width="100%">
          <ProjectTabs projects={projects} />
        </Box>
      )}
    </VStack>
  );
};

export default Home;
