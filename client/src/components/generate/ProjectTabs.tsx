import { Heading, Tab, TabList, TabPanel, Tabs, Text, useBreakpointValue, Divider, TabPanels, Button, Icon, HStack, Tag } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaBookReader } from "react-icons/fa"; // Updated icons

interface Project {
  title: string;
  materials: string[];
  tools: string[];
  time: string;
  budget: string;
  tags: string[];
  description: string;
}

interface ProjectTabsProps {
  projects: Project[];
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ projects }) => {
  const tabOrientation = useBreakpointValue({
    base: "vertical",
    md: "horizontal",
  }) as "vertical" | "horizontal" | undefined;

  return (
    <Tabs variant="enclosed" isLazy orientation={tabOrientation} width="100%">
      <TabList mb={4}>
        {projects.map((project, index) => (
          <Tab key={index} py={{ base: 3, md: 2 }} px={{ base: 2, md: 4 }} fontSize={{ base: "xs", sm: "sm", md: "md" }}>
            {project.title}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {projects.map((project, index) => (
          <TabPanel key={index} p={4} itemID={`project-${project.title}`}>
            <Heading size="md" mb={3}>
              {project.title}
            </Heading>
            <Text fontSize="sm" mb={2}>
              {project.description}
            </Text>
            <Text fontSize="sm" mb={2}>
              <b>Materials:</b> {project.materials.join(", ")}
            </Text>
            <Text fontSize="sm" mb={2}>
              <b>Tools:</b> {project.tools.join(", ")}
            </Text>
            <Text fontSize="sm" mb={2}>
              <b>Time Required:</b> {project.time}
            </Text>
            <Text fontSize="sm" mb={2}>
              <b>Budget:</b> {project.budget}
            </Text>
            <HStack spacing={2} mb={2} mt={2}>
              {project.tags.map((tag, tagIndex) => (
                <Tag key={tagIndex} size="sm" borderRadius="full" variant="solid" bgColor="blue.500" color="white" _hover={{ bgColor: "blue.600" }}>
                  {tag}
                </Tag>
              ))}
            </HStack>

            <Divider my={3} />
            <HStack spacing={2}>
              <Text fontSize="md">Like this idea?</Text>
              <Button as={RouterLink} to={{ pathname: "/project-detail" }} state={{ project: { ...project } }} leftIcon={<Icon as={FaBookReader} />}>
                Provide Detailed Steps
              </Button>
            </HStack>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default ProjectTabs;
