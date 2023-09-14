import { Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Container, Heading, Link } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { faqs } from "../constants";
import { FAQ } from "../types";

const FAQPage = () => {
  const location = useLocation();

  const defaultIndices = [];
  if (location.hash) {
    const hash = location.hash.substring(1);
    const index = faqs.findIndex((faq) => faq.id === hash);
    if (index !== -1) {
      defaultIndices.push(index);
    }
  }

  const renderAnswer = (faq: FAQ) => {
    switch (faq.answerType) {
      case "feedbackWithLink":
        return (
          <>
            We're always eager to hear from our users! If you have any feedback or suggestions for MakeMeDIYspire, please
            <Link href="https://github.com/Kevin-Umali/make-me/issues" isExternal color="blue.500" ml={1} mr={1}>
              open a pull request or issue on our GitHub repository
            </Link>
            . Your insights can help us enhance the platform for everyone.
          </>
        );
      case "howWithLink":
        return (
          <>
            Utilizing the capabilities of OpenAI, our platform generates distinct DIY project ideas based on a variety of factors and categories. Once you select a project, you will receive a detailed
            list of materials needed and a step-by-step guide to complete the project. Refer to
            <Link href="/how-to-guide" isExternal color="blue.500" ml={1} mr={1}>
              How to use the MakeMeDIYspire DIY Idea Generator
            </Link>
            guide.
          </>
        );
      case "startedWithLink":
        return (
          <>
            It's straightforward! Visit the{" "}
            <Link href="/" isExternal color="blue.500" ml={1} mr={1}>
              MakeMeDIYspire homepage
            </Link>
            , input your preferences, such as materials and other options, and we'll generate a unique DIY project suggestion tailored for you. No sign-up required!
          </>
        );
      default:
        return faq.answer;
    }
  };

  return (
    <Container maxW="7xl" py={5}>
      <Box textAlign="center" mb={10}>
        <Heading as="h1" mb={3} fontSize={["lg", "xl", "2xl"]}>
          Frequently Asked Questions
        </Heading>
      </Box>

      <Accordion defaultIndex={defaultIndices} allowMultiple>
        {faqs.map((faq, index) => (
          <AccordionItem key={index}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {faq.question}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>{renderAnswer(faq)}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Container>
  );
};

export default FAQPage;
