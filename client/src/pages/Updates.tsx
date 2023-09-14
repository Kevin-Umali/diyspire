import { VStack, Heading, Box, Container, HStack, Text, Icon, Center } from "@chakra-ui/react";
import { Fragment } from "react";
import MilestoneItem from "../components/MilestoneItems";
import { FaBug, FaCode, FaFile, FaPaintBrush, FaPlusCircle, FaRocket, FaShieldAlt } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { Operation } from "../types";
import { commits } from "../constants";

const iconLegends = [
  { icon: FaCode, description: "Code Updates" },
  { icon: FaBug, description: "Bug Fixes" },
  { icon: FaPlusCircle, description: "Feature Additions" },
  { icon: FaRocket, description: "Performance Enhancements" },
  { icon: FaFile, description: "Documentation" },
  { icon: FaShieldAlt, description: "Security Updates" },
  { icon: FaPaintBrush, description: "UI/UX Improvements" },
];

const operationToIcon: Record<Operation, React.ElementType> = {
  "code-updates": FaCode,
  "bug-fixes": FaBug,
  "feature-additions": FaPlusCircle,
  "performance-enhancements": FaRocket,
  documentation: FaFile,
  "security-updates": FaShieldAlt,
  "ui-ux-improvements": FaPaintBrush,
};

const Updates = () => {
  return (
    <Container maxW="7xl" p={{ base: 2, sm: 10 }}>
      <VStack spacing={10} alignItems="center" justifyContent="center">
        <Box textAlign="center">
          <Heading as="h1" mb={3} fontSize={["lg", "xl", "2xl"]}>
            "MakeMeDIYspire" Updates
          </Heading>
          <Text fontSize={["sm", "md"]}>Track the latest improvements, features, and fixes introduced to the DIY project generator.</Text>
        </Box>

        <HStack spacing={5}>
          {iconLegends.map((legend, index) => (
            <Center key={index} flexDirection="column">
              <Icon as={legend.icon} boxSize={5} />
              <Text mt={2} fontSize="sm">
                {legend.description}
              </Text>
            </Center>
          ))}
        </HStack>
      </VStack>

      {Object.entries(commits).map(([year, commitsInYear]) => (
        <VStack key={year} textAlign="start" align="start" mb={5}>
          <Box zIndex={5}>
            <Heading fontSize="4xl" fontWeight="600" my={5}>
              {year}
            </Heading>
            {commitsInYear.map((commit) => (
              <Fragment key={commit.date}>
                <Heading fontSize="xl" fontWeight="400" my={3}>
                  {commit.date}
                </Heading>
                <MilestoneItem icon={FiCheckCircle}>
                  <Text fontWeight="300">{commit.summary}</Text>
                  <HStack mt={3} spacing={3}>
                    {commit.operations.map((operation, index) => (
                      <Icon as={operationToIcon[operation]} key={index} />
                    ))}
                  </HStack>
                </MilestoneItem>
              </Fragment>
            ))}
          </Box>
        </VStack>
      ))}
    </Container>
  );
};

export default Updates;
