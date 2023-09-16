import { useEffect, useState } from "react";
import { Box, Container, Heading, useToast } from "@chakra-ui/react";
import CustomMarkdown from "../components/CustomMarkdown";
import { useParams, useNavigate } from "react-router-dom";
import { getGuideByPath } from "../api/open-ai-api";
import { HowToGuide } from "../types";
import { trimLeadingWhitespace } from "../utils";
import MetaTag from "../components/MetaTag";

const HowToGuideDetail = () => {
  const [guideDetails, setGuideDetails] = useState<HowToGuide | null>(null);
  const { path } = useParams<{ path: string }>();
  const navigate = useNavigate();

  const toast = useToast();

  useEffect(() => {
    if (!path) {
      toast({
        title: "How-to Guide Error",
        description: "No how-to guide details found.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      navigate("/");
      return;
    }

    getGuideByPath(path)
      .then((fetchedGuide) => {
        setGuideDetails(fetchedGuide.data);
      })
      .catch((error) => {
        console.error("Error fetching the guide:", error);
      });
  }, [navigate, path, toast]);

  return (
    <Container maxW="7xl" p={{ base: 5, sm: 10 }}>
      {guideDetails && <MetaTag title={guideDetails.metadata.title} description={guideDetails.content.substring(0, 150) + "..."} />}
      <Box textAlign="center" mb={10}>
        <Heading as="h1" mb={3} fontSize={["lg", "xl", "2xl"]}>
          "MakeMeDIYspire" Guides
        </Heading>
      </Box>
      {guideDetails && (
        <Box width="100%" p={4}>
          <CustomMarkdown content={trimLeadingWhitespace(guideDetails.content)} />
        </Box>
      )}
    </Container>
  );
};

export default HowToGuideDetail;
