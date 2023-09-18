// ProjectImage.tsx

import React from "react";
import { Flex, Image, Link, Text, Button, Skeleton, Icon } from "@chakra-ui/react";
import { FaInfoCircle, FaShare } from "react-icons/fa";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { RelatedImages } from "../../types";

interface ProjectImageProps {
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relatedImages: RelatedImages | null;
  projectTitle: string;
  onOpen: () => void;
  showShareButton: boolean;
}

const UNSPLASH_PROJECT_NAME = import.meta.env.VITE_UNSPLASH_PROJECT_NAME;

const ProjectImage: React.FC<ProjectImageProps> = ({ isLoading, projectTitle, relatedImages, onOpen, showShareButton }) => {
  const imageUrl = relatedImages?.urls ? relatedImages.urls.regular : "https://via.placeholder.com/500";
  const photographerName = relatedImages?.user?.name;
  const photographerLink = relatedImages?.user?.link;

  const googleSearchLink = `https://www.google.com/search?q=${projectTitle}`;
  const youtubeSearchLink = `https://www.youtube.com/results?search_query=${projectTitle} Tutorial`;

  if (isLoading) {
    return <Skeleton height={{ lg: "500px" }} />;
  }

  return (
    <Flex direction="column">
      <Image
        loading="lazy"
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
            <Link mx={1} href={`${photographerLink}?utm_source=${UNSPLASH_PROJECT_NAME}&utm_medium=referral`} textDecorationLine="underline" isExternal>
              {`${photographerName}`}
            </Link>
            on
            <Link ml={1} href={`https://unsplash.com/?utm_source=${UNSPLASH_PROJECT_NAME}&utm_medium=referral`} textDecorationLine="underline" isExternal>
              Unsplash
            </Link>
          </Text>
        )}
      </Flex>

      <Flex align="center" mt={2} color="gray.500">
        <Icon as={FaInfoCircle} mr={2} />
        <Text fontSize={"sm"}>
          Note: The image may not accurately represent the project title. For more specific results, you can click to
          <Link mx={1} href={googleSearchLink} textDecorationLine="underline" isExternal>
            search on Google <ExternalLinkIcon w={4} h={5} />
          </Link>
          or watch tutorials on
          <Link ml={1} href={youtubeSearchLink} textDecorationLine="underline" isExternal>
            YouTube <ExternalLinkIcon w={4} h={5} />
          </Link>
          .
        </Text>
      </Flex>

      {showShareButton && (
        <Button onClick={onOpen} mt={4} leftIcon={<FaShare />}>
          Share
        </Button>
      )}
    </Flex>
  );
};

export default ProjectImage;
