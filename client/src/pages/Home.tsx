import { useState, useCallback, useMemo } from "react";
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
  useBreakpointValue,
  Container,
} from "@chakra-ui/react";
import { FaRegLightbulb, FaInfoCircle } from "react-icons/fa";

import MaterialInput from "../components/MaterialInput";
import CategoryFilter from "../components/CategoryFilter";
import DifficultyFilter from "../components/DifficultyFilter";
import { generateProjectIdeas } from "../api/open-ai-api";
import ProjectTabs from "../components/ProjectTabs";
import LoadingComponent from "../components/LoadingComponent";
import { categories, steps } from "../constants";
import BudgetFilter from "../components/BudgetFilter";
import PurposeFilter from "../components/PurposeFilter";
import TimeAvailabilityFilter from "../components/TimeAvailabilityFilter";
import ToolsAvailableInput from "../components/ToolsAvailableInput";
import SafetyCheck from "../components/SafetyCheck";

type Orientation = "horizontal" | "vertical";

const Home = () => {
  const [materials, setMaterials] = useState([""]);
  const [onlySpecified, setOnlySpecified] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("Anything");
  const [availableTime, setAvailableTime] = useState(1);
  const [budget, setBudget] = useState(0);
  const [tools, setTools] = useState([""]);
  const [purpose, setPurpose] = useState("");
  const [safetyConfirmed, setSafetyConfirmed] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const { activeStep, goToNext, goToPrevious, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [projects, setProjects] = useState([]);

  const orientation: Orientation | undefined = useBreakpointValue({
    base: "vertical",
    md: "horizontal",
  }) as Orientation | undefined;

  const toast = useToast();

  const handleSubmit = useCallback(async () => {
    try {
      if (!safetyConfirmed) throw new Error("Please check the safety checkbox");

      goToNext();

      const response = await generateProjectIdeas(materials, onlySpecified, selectedDifficulty, selectedCategory, tools, availableTime, budget, purpose);

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
  }, [safetyConfirmed, goToNext, materials, onlySpecified, selectedDifficulty, selectedCategory, tools, availableTime, budget, purpose, toast, goToPrevious]);

  const advancedOptions = useMemo(
    () => (
      <Box mt={4}>
        <TimeAvailabilityFilter onTimeChange={setAvailableTime} />
        <BudgetFilter onBudgetChange={setBudget} mt={4} />
        <ToolsAvailableInput tools={tools} setTools={setTools} mt={4} />
        <PurposeFilter onPurposeChange={setPurpose} mt={4} />
      </Box>
    ),
    [tools]
  );

  return (
    <Container as="main" maxW="7xl" py={5}>
      <VStack spacing={10} p={5} width="100%">
        <Box width="100%" overflowX="auto" borderRadius="lg" p={5} boxShadow="lg">
          <Heading as="h1" mb={3} fontSize={["lg", "xl", "2xl"]}>
            <Icon as={FaRegLightbulb} w={6} h={6} mr={2} />
            DIY Project Ideas
          </Heading>
          <Text fontSize={["sm", "md"]} mb={3}>
            Ever found yourself gazing at random materials scattered around your home, your imagination itching to craft something unique? You're not alone. Here at DIY Project Ideas, we're driven by
            the joy of creation. Whether you have colorful strings, spare wood planks, beads, or even old magazines, there's a world of possibilities waiting for you. Feed your creativity and turn
            your materials into masterpieces. Simply input what you have, sit back, and let us provide you with a treasure trove of DIY projects tailored just for you. Ready to embark on a journey of
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
        <Stepper index={activeStep} width="100%" orientation={orientation}>
          {steps.map((step, index) => (
            <Step key={step.title}>
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
            <MaterialInput materials={materials} setMaterials={setMaterials} onlySpecified={onlySpecified} setOnlySpecified={setOnlySpecified} />
            <DifficultyFilter onDifficultyChange={setSelectedDifficulty} mt={4} />
            <CategoryFilter categories={categories} onCategoryChange={setSelectedCategory} mt={4} />
            <Button onClick={() => setShowAdvancedOptions(!showAdvancedOptions)} mt={4}>
              {showAdvancedOptions ? "Hide Advanced Options" : "Show Advanced Options"}
            </Button>
            {showAdvancedOptions && advancedOptions}
            <Flex mt={4} justifyContent="space-between" alignItems="center">
              <SafetyCheck onSafetyConfirmation={setSafetyConfirmed} />
              <Button variant="outline" width="250px" onClick={handleSubmit}>
                Generate
              </Button>
            </Flex>
          </Box>
        )}
        {activeStep === 1 && <LoadingComponent />}
        {activeStep === 2 && (
          <Box width="100%" p={4} borderWidth="1px" borderRadius="md" borderColor="gray.200">
            <ProjectTabs projects={projects} />
            <Flex mt={4} justifyContent="flex-end">
              <Button
                variant="outline"
                width="250px"
                onClick={() => {
                  setProjects([]);
                  setActiveStep(0);
                }}
                mr={4}
              >
                Generate new ideas
              </Button>
            </Flex>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Home;
