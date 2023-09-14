import { Heading, Tab, TabList, TabPanel, Tabs, Text, useBreakpointValue, List, ListItem, Divider, TabPanels, Button, Icon, Link, useToast } from "@chakra-ui/react";
import { FaFilePdf, FaShareAlt } from "react-icons/fa";
import { exportToPDF } from "../utils";
import { ExternalLinkIcon } from "@chakra-ui/icons";

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
  const toast = useToast();

  const handleShare = async (project: Project) => {
    if (navigator.share) {
      const pdfData = await exportToPDF(`project-${project.title}`, project.title);

      if (!pdfData) {
        toast({
          title: "An error occurred.",
          description: "Failed to generate PDF.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      const file = new File([pdfData.blob], pdfData.fileName, {
        type: "application/pdf",
      });

      try {
        await navigator.share({
          title: project.title,
          files: [file],
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("There was an error sharing the file.", err);
        toast({
          title: "An error occurred.",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } else {
      toast({
        title: "Unsupported Feature.",
        description: "Web Share API not supported in your browser.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleExport = async (project: Project) => {
    const pdfData = await exportToPDF(`project-${project.title}`, project.title);

    if (!pdfData) {
      toast({
        title: "An error occurred.",
        description: "Failed to generate PDF.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfData.blob);
    link.download = pdfData.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              <Link href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(project.title)}`} isExternal>
                {project.title} <ExternalLinkIcon w={4} h={5} mr={2} />
              </Link>
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
            <Button onClick={() => handleExport(project)} leftIcon={<Icon as={FaFilePdf} />} mt={3}>
              Export to PDF
            </Button>
            <Button onClick={() => handleShare(project)} leftIcon={<Icon as={FaShareAlt} />} mt={3} ml={2}>
              Share
            </Button>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default ProjectTabs;
