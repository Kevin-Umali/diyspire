import { useState, useEffect } from "react";
import {
  Container,
  Heading,
  Text,
  List,
  ListItem,
  Box,
  useBreakpointValue,
  Skeleton,
  Flex,
  SimpleGrid,
  Stack,
  StackDivider,
  VStack,
  useColorModeValue,
  Image,
  SkeletonText,
  Divider,
  useToast,
  Link,
  Icon,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaInfoCircle, FaPaperPlane } from "react-icons/fa";
import { generateProjectExplanations, searchImages } from "../api/open-ai-api";
import { ExternalLinkIcon } from "@chakra-ui/icons";

interface ProjectLocationState {
  title: string;
  materials: string[];
  tools: string[];
  time: string;
  budget: string;
  description: string;
}

const UNSPLASH_PROJECT_NAME = import.meta.env.UNSPLASH_PROJECT_NAME;

const ProjectDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const subHeading = useColorModeValue("gray.900", "gray.400");
  const description = useColorModeValue("gray.500", "gray.400");
  const toolsAndMaterials = useColorModeValue("yellow.500", "yellow.300");
  const steps = useColorModeValue("gray.600", "gray.400");
  const ellipsisBreakpoint = useBreakpointValue({ base: undefined, lg: 3 });

  const [isLoading, setIsLoading] = useState(true);
  const [projectExplanation, setProjectExplanation] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [relatedImages, setRelatedImages] = useState<any | null>(null);

  const project = location?.state?.project as ProjectLocationState;

  const toast = useToast();

  useEffect(() => {
    if (!project) {
      toast({
        title: "Project Error",
        description: "No project details found.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      navigate("/");
      return;
    }

    setIsLoading(true);

    generateProjectExplanations(project.title, project.materials, project.tools, project.time, project.budget, project.description)
      .then((response) => {
        setProjectExplanation(response.data.explanation);

        return searchImages(project.title);
      })
      .then((imageResponse) => {
        setRelatedImages(imageResponse.data);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        toast({
          title: "An error occurred.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [project, navigate, toast]);

  if (!project) return null;

  const imageUrl = relatedImages && relatedImages.urls ? relatedImages.urls.regular : "https://via.placeholder.com/500";
  const photographerName = relatedImages?.user?.name;
  const photographerLink = relatedImages?.user?.link;

  const googleSearchLink = `https://www.google.com/search?q=${project.title}`;
  const youtubeSearchLink = `https://www.youtube.com/results?search_query=${project.title} Tutorial`;

  return (
    <Container maxW={"7xl"} py={{ base: 5, sm: 10 }}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, md: 10 }}>
        {isLoading ? (
          <Skeleton height={{ lg: "500px" }} />
        ) : (
          <Flex direction="column">
            <Image
              rounded={"md"}
              alt={relatedImages?.alt_description || ""}
              src={imageUrl}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={{ base: "100%", sm: "400px", lg: "500px" }}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />

            <Flex direction="column" align="center" w="100%">
              {photographerName && (
                <Text fontSize={"sm"} mt={2} textAlign="center">
                  Photo by
                  <Link mx={1} href={`${photographerLink}?utm_source=${UNSPLASH_PROJECT_NAME}&utm_medium=referral`} isExternal>
                    {`${photographerName}`}
                  </Link>
                  on
                  <Link ml={1} href={`https://unsplash.com/?utm_source=${UNSPLASH_PROJECT_NAME}&utm_medium=referral`} isExternal>
                    Unsplash
                  </Link>
                </Text>
              )}
            </Flex>

            <Flex align="center" mt={2} color="gray.500">
              <Icon as={FaInfoCircle} mr={2} />
              <Text fontSize={"sm"}>
                Note: The image may not accurately represent the project title. For more specific results, you can click to
                <Link mx={1} href={googleSearchLink} isExternal>
                  search on Google <ExternalLinkIcon w={4} h={5} />
                </Link>
                or watch tutorials on
                <Link ml={1} href={youtubeSearchLink} isExternal>
                  YouTube <ExternalLinkIcon w={4} h={5} />
                </Link>
                .
              </Text>
            </Flex>
          </Flex>
        )}

        <Stack spacing={{ base: 6, md: 5 }}>
          {isLoading ? (
            <>
              <SkeletonText noOfLines={1} skeletonHeight="20" />
              <SkeletonText noOfLines={5} spacing="4" />
            </>
          ) : (
            <>
              <Box as={"header"}>
                <Heading lineHeight={1.1} fontWeight={600} fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}>
                  {project.title}
                </Heading>
                <Text color={subHeading} fontWeight={300} fontSize={"2xl"} mt={2}>
                  {project.time} | {project.budget}
                </Text>
                <Stack direction="row" alignItems="center" mt={2}>
                  <FaPaperPlane />
                  <Text>Complete in {project.time}</Text>
                </Stack>
              </Box>

              <Stack spacing={{ base: 4, sm: 6 }} direction={"column"} divider={<StackDivider />}>
                <VStack spacing={{ base: 4, sm: 6 }}>
                  <Text color={description} fontSize={"xl"} fontWeight={"300"} noOfLines={ellipsisBreakpoint}>
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
            </>
          )}
          {/* 
          <Button rounded={'none'} w={'full'} mt={8} size={'lg'} py={'7'} bg={useColorModeValue('gray.900', 'gray.50')} color={useColorModeValue('white', 'gray.900')} textTransform={'uppercase'} _hover={{ transform: 'translateY(2px)', boxShadow: 'lg' }}>
            Do Something
          </Button>
          */}
        </Stack>
      </SimpleGrid>
      <Divider mt={10} />
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
    </Container>
  );
};

export default ProjectDetail;
