import { Box, Heading, Text, Container, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button, ListItem, OrderedList, Image } from "@chakra-ui/react";
import { guides as howToGuides } from "../constants";
import { GuideSection, StepContent } from "../types";

const HowToGuideComponent = () => {
  const renderContent = (section: GuideSection | StepContent) => {
    switch (section.type) {
      case "text":
      case "paragraph":
        return <Text mt={3}>{section.content as string}</Text>;
      case "image":
      case "gif":
        return <Image loading="lazy" src={section.src} alt={section.alt} my={4} borderRadius="md" />;
      case "video":
        return (
          <Box my={4}>
            <iframe
              width="100%"
              height="315"
              src={section.src}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={section.content as string}
            ></iframe>
          </Box>
        );
      case "subheading":
        return (
          <Heading fontSize="xl" my={4}>
            {section.content as string}
          </Heading>
        );
      case "steps":
        return (
          <OrderedList mt={3} spacing={2}>
            {(section.content as StepContent[]).map((stepContent, stepIdx) => {
              if (stepContent.type === "text") {
                const nextStepContent = section.content[stepIdx + 1] as StepContent | undefined;
                return (
                  <ListItem key={stepIdx}>
                    {stepContent.content}
                    {nextStepContent && (nextStepContent.type === "image" || nextStepContent.type === "gif") ? renderContent(nextStepContent) : null}
                  </ListItem>
                );
              } else if (stepContent.type !== "image" && stepContent.type !== "gif") {
                return (
                  <Box key={stepIdx} as="li" listStyleType="none">
                    {renderContent(stepContent)}
                  </Box>
                );
              }
              return null; // Return null for steps that don't match conditions
            })}
          </OrderedList>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxW="7xl" py={5}>
      <Box textAlign="center" mb={10}>
        <Heading as="h1" mb={3} fontSize={["lg", "xl", "2xl"]}>
          "MakeMeDIYspire" Guides
        </Heading>
        <Text fontSize={["sm", "md"]} mb={3}>
          From usage to troubleshooting, explore our detailed guides to get the most out of the DIY project generator.
        </Text>
      </Box>

      <Accordion defaultIndex={[]} allowMultiple>
        {howToGuides.map((guide, guideIndex) => (
          <AccordionItem key={guideIndex}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {guide.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Box key={guideIndex} width="100%" p={4}>
                <Heading fontSize="2xl" mb={3}>
                  {guide.title}
                </Heading>
                <Text fontStyle="italic" mb={5}>
                  {guide.intro}
                </Text>
                {guide.body.map((section) => renderContent(section))}
                {guide.buttonURL && (
                  <Button mt={4} colorScheme="teal" as="a" href={guide.buttonURL} target="_blank" rel="noopener noreferrer">
                    Learn More
                  </Button>
                )}
              </Box>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Container>
  );
};

export default HowToGuideComponent;
