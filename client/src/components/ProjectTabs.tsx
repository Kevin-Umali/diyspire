import { Heading, Tab, TabList, TabPanel, Tabs, Text, useBreakpointValue, List, ListItem, Divider, TabPanels } from "@chakra-ui/react";

interface Project {
  title: string;
  materials: string[];
  tools: string[];
  time: string;
  budget: string;
  steps: string[];
  description: string;
}

interface ProjectTabsProps {
  projects: Project[];
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ projects }) => {
  const tabOrientation = useBreakpointValue({ base: "vertical", md: "horizontal" }) as "vertical" | "horizontal" | undefined;

  return (
    <Tabs variant="enclosed" isLazy orientation={tabOrientation} width="100%">
      <TabList mb={4}>
        {projects.map((project, index) => (
          <Tab key={index} py={2} px={4} fontSize={{ base: "xs", sm: "sm", md: "md" }}>
            {project.title}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {projects.map((project, index) => (
          <TabPanel key={index} p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
            <Heading size="md" mb={3}>
              {project.title}
            </Heading>
            <Text fontSize="sm" mb={2}>
              <b>Materials:</b> {project.materials.join(", ")}
            </Text>
            <Text fontSize="sm" mb={2}>
              <b>Tools:</b> {project.tools.join(", ")}
            </Text>
            <Text fontSize="sm" mb={2}>
              <b>Time:</b> {project.time}
            </Text>
            <Text fontSize="sm" mb={2}>
              <b>Budget:</b> {project.budget}
            </Text>
            <Divider my={2} />
            <Text fontSize="sm" mb={2}>
              {project.description}
            </Text>
            <List spacing={2} my={2}>
              {project.steps.map((step, sIndex) => (
                <ListItem key={sIndex}>
                  <Text as="span" fontWeight="bold" mr={2}>
                    {sIndex + 1}.
                  </Text>
                  {step}
                </ListItem>
              ))}
            </List>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default ProjectTabs;
