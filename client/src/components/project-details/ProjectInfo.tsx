import React from "react";
import { Heading, Stack, SkeletonText, Box, List, ListItem, StackDivider, VStack, Text, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";
import { ProjectLocationState } from "../../types";

interface ProjectInfoProps {
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  project: ProjectLocationState;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ isLoading, project }) => {
  const subHeading = useColorModeValue("gray.900", "gray.400");
  const description = useColorModeValue("gray.500", "gray.400");
  const toolsAndMaterials = useColorModeValue("yellow.500", "yellow.300");
  const ellipsisBreakpoint = useBreakpointValue({ base: undefined, lg: 3 });
  if (isLoading) {
    return (
      <>
        <SkeletonText noOfLines={1} skeletonHeight="20" />
        <SkeletonText noOfLines={5} spacing="4" />
      </>
    );
  }

  return (
    <Stack spacing={{ base: 6, md: 5 }}>
      <Box as={"header"}>
        <Heading lineHeight={1.1} fontWeight={600} fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}>
          {project.title}
        </Heading>
        <Text color={subHeading} fontWeight={300} fontSize={"lg"} mt={2}>
          {project.time} | {project.budget}
        </Text>
        <Stack direction="row" alignItems="center" mt={2}>
          <FaPaperPlane />
          <Text>Complete in {project.time}</Text>
        </Stack>
      </Box>

      <Stack spacing={{ base: 4, sm: 6 }} direction={"column"} divider={<StackDivider />}>
        <VStack spacing={{ base: 4, sm: 6 }}>
          <Text color={description} fontSize={"lg"} fontWeight={"300"} noOfLines={ellipsisBreakpoint}>
            {project.description}
          </Text>
        </VStack>

        <Box>
          <Text fontSize={{ base: "16px", lg: "18px" }} color={toolsAndMaterials} fontWeight={"500"} textTransform={"uppercase"} mb={"4"}>
            Materials
          </Text>
          <List spacing={2}>
            {project.materials.map((material, index) => (
              <ListItem key={index}>{material}</ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Text fontSize={{ base: "16px", lg: "18px" }} color={toolsAndMaterials} fontWeight={"500"} textTransform={"uppercase"} mb={"4"}>
            Tools
          </Text>
          <List spacing={2}>{project.tools.length >= 1 ? project.tools.map((tool, index) => <ListItem key={index}>{tool}</ListItem>) : <ListItem key={1}>Nothing</ListItem>}</List>
        </Box>
      </Stack>
      {/* <Button
        rounded={"none"}
        w={"full"}
        mt={8}
        size={"lg"}
        py={"7"}
        bg={useColorModeValue("gray.900", "gray.50")}
        color={useColorModeValue("white", "gray.900")}
        textTransform={"uppercase"}
        _hover={{ transform: "translateY(2px)", boxShadow: "lg" }}
      >
        Do Something
      </Button> */}
    </Stack>
  );
};

export default ProjectInfo;
