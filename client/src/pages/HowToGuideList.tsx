import { useEffect, useState } from "react";
import { Box, Container, Heading, Text, LinkBox, LinkOverlay, VStack, useToast } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { getAllGuides } from "../api/backend-api";
import MetaTag from "../components/MetaTag";

type Guide = {
  path: string;
  metadata: {
    title: string;
  };
};

const HowToGuidesList = () => {
  const [guides, setGuides] = useState<Guide[]>([]);

  const toast = useToast();

  useEffect(() => {
    getAllGuides()
      .then((fetchedGuides) => {
        setGuides(fetchedGuides.data);
      })
      .catch((error) => {
        console.error("Error fetching the guide paths:", error);
        toast({
          title: "Guide Fetching Error",
          description: "Unable to fetch the list of how-to guides.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      });
  }, [toast]);

  return (
    <Container maxW="7xl" p={{ base: 5, sm: 10 }}>
      <MetaTag title="MakeMeDIYspire How-to Guides" description="Explore our detailed guides to get the most out of the MakeMeDIYspire DIY project generator." />
      <Box textAlign="center" mb={10}>
        <Heading as="h1" mb={3} fontSize={["lg", "xl", "2xl"]}>
          "MakeMeDIYspire" Guides
        </Heading>
        <Text fontSize={["sm", "md"]} mb={3}>
          From usage to troubleshooting, explore our detailed guides to get the most out of the DIY project generator.
        </Text>
      </Box>

      <VStack spacing={3} align="start">
        {guides.map((guide, index) => (
          <LinkBox key={index} width="100%" p={4} borderWidth="1px">
            <LinkOverlay as={RouterLink} to={`/guide/${guide.path}`}>
              {guide.metadata.title}
            </LinkOverlay>
          </LinkBox>
        ))}
      </VStack>
    </Container>
  );
};

export default HowToGuidesList;
