import { SkeletonText, Text, Box, useColorModeValue } from "@chakra-ui/react";

interface ProjectStepsProps {
  isLoading: boolean;
  projectExplanation: string | null;
}

const ProjectSteps: React.FC<ProjectStepsProps> = ({ isLoading, projectExplanation }) => {
  const toolsAndMaterials = useColorModeValue("yellow.500", "yellow.300");
  const steps = useColorModeValue("gray.600", "gray.400");

  return (
    <Box mt={10}>
      {isLoading ? (
        <>
          <SkeletonText mt={5} noOfLines={1} skeletonHeight="30px" />
          <SkeletonText mt={5} noOfLines={6} spacing="4" />
        </>
      ) : (
        <>
          <Text fontSize={{ base: "16px", lg: "18px" }} color={toolsAndMaterials} fontWeight={"500"} textTransform={"uppercase"} mb={"4"}>
            Detailed Steps to Follow
          </Text>
          <Text color={steps} fontSize={{ base: "md", sm: "lg" }} lineHeight={"1.8"}>
            {projectExplanation
              ? projectExplanation.split("\n").map((line, index, array) => (
                  <>
                    {line}
                    {index === array.length - 1 ? null : <br />}
                  </>
                ))
              : "No detailed steps provided."}
          </Text>
        </>
      )}
    </Box>
  );
};

export default ProjectSteps;
