import { useState, useCallback, useMemo, useEffect } from "react";
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

import { generateProjectIdeas, getTotalCountOfGeneratedIdea, incrementCounterOfGeneratedIdea } from "../api/backend-api";
import { categories, steps } from "../constants";
import {
  BudgetFilter,
  CategoryFilter,
  DifficultyFilter,
  LoadingComponent,
  MaterialInput,
  ProjectTabs,
  PurposeFilter,
  SafetyCheck,
  TimeAvailabilityFilter,
  ToolsAvailableInput,
} from "../components/generate";

type Orientation = "horizontal" | "vertical";

const Home = () => {
  const [materials, setMaterials] = useState([""]);
  const [onlySpecified, setOnlySpecified] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("Anything");
  const [timeValue, setTimeValue] = useState<number>(0);
  const [timeUnit, setTimeUnit] = useState<string | null>(null);
  const [budget, setBudget] = useState(0);
  const [tools, setTools] = useState([""]);
  const [purpose, setPurpose] = useState("Personal Use");
  const [safetyConfirmed, setSafetyConfirmed] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [projects, setProjects] = useState([]);

  const [totalCount, setTotalCount] = useState<number>(0);

  const orientation: Orientation | undefined = useBreakpointValue({
    base: "vertical",
    md: "horizontal",
  }) as Orientation | undefined;

  const toast = useToast();

  const fetchTotalCount = async () => {
    try {
      const response = await getTotalCountOfGeneratedIdea();
      if (response?.data?.totalCount) {
        setTotalCount(response.data.totalCount);
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
    }
  };

  useEffect(() => {
    fetchTotalCount();
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      if (!safetyConfirmed) throw new Error("Please check the safety checkbox");

      goToNext();

      const response = await generateProjectIdeas(materials, onlySpecified, selectedDifficulty, selectedCategory, tools, timeValue, timeUnit, budget, purpose);

      if (response.data?.ideas) {
        setProjects(response.data.ideas);

        goToNext();

        await incrementCounterOfGeneratedIdea();
        setTotalCount((count) => count + 1);
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
  }, [safetyConfirmed, goToNext, materials, onlySpecified, selectedDifficulty, selectedCategory, tools, timeValue, timeUnit, budget, purpose, toast, goToPrevious]);

  const advancedOptions = useMemo(
    () => (
      <Box mt={4}>
        <TimeAvailabilityFilter timeValue={timeValue} timeUnit={timeUnit} onValueChange={setTimeValue} onUnitChange={setTimeUnit} />
        <BudgetFilter onBudgetChange={setBudget} mt={4} />
        <ToolsAvailableInput tools={tools} setTools={setTools} mt={4} />
        <PurposeFilter purpose={purpose} onPurposeChange={setPurpose} mt={4} />
      </Box>
    ),
    [timeUnit, timeValue, tools, purpose],
  );

  return (
    <Container as="main" maxW="7xl" py={{ base: 5, sm: 10 }}>
      <VStack spacing={10} p={5} width="100%">
        <Box width="100%" overflowX="auto" p={5} boxShadow="lg">
          <Heading as="h1" mb={3} fontSize={["lg", "xl", "2xl"]}>
            <Icon as={FaRegLightbulb} w={6} h={6} mr={2} />
            DIY Project Ideas
          </Heading>
          <Text fontSize={["sm", "md"]} mb={2}>
            Ever found yourself gazing at random materials scattered around your home, your imagination itching to craft something unique?
          </Text>
          <Text fontSize={["sm", "md"]} mb={2}>
            You're not alone. Here at DIY Project Ideas, we're driven by the joy of creation. Whether you have colorful strings, spare wood planks, beads, or even old magazines, there's a world of
            possibilities waiting for you.
          </Text>
          <Text fontSize={["sm", "md"]} mb={2}>
            Feed your creativity and turn your materials into masterpieces. Simply input what you have, sit back, and let us provide you with a treasure trove of DIY projects tailored just for you.
          </Text>
          <Text fontSize={["sm", "md"]} mb={2}>
            Ready to embark on a journey of creation?
          </Text>

          <Divider my={3} />
          <Box display="flex" alignItems="center">
            <Icon as={FaInfoCircle} w={5} h={5} mr={2} />
            <Text fontSize="sm" fontStyle="italic" color="gray.600">
              Note: Our system caches suggestions for 2 hours. If you re-enter the same items within this timeframe, you'll see the same suggestions.
            </Text>
          </Box>
        </Box>
        {totalCount}
        {totalCount !== null && (
          <Box p={4} mb={2}>
            <Text fontSize={["md", "lg"]} textAlign="center" fontWeight="bold">
              🎉 Total generated ideas so far: {totalCount} 🎉
            </Text>
          </Box>
        )}
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
          <Box width="100%" p={4} borderWidth="1px" borderColor="gray.200">
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
          <Box width="100%" p={4} borderWidth="1px" borderColor="gray.200">
            <ProjectTabs projects={projects} />
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Home;
