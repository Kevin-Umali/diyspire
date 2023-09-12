import { useState } from "react";
import { Box, Spinner, Text, keyframes } from "@chakra-ui/react";
import useInterval from "../hooks/useInterval";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const LoadingComponent: React.FC = () => {
  const loadingMessages = ["Generating project ideas...", "Brewing some creativity...", "Almost there, hang tight...", "Fetching some inspiration..."];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useInterval(() => {
    setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
  }, 5000);

  return (
    <Box width="100%" textAlign="center" pt={5} bgGradient="linear(to-r, blue.500, teal.400)" borderRadius="lg" p={4}>
      <Spinner size="xl" thickness="4px" speed="0.65s" />
      <Text mt={4} fontSize="xl" fontWeight="medium" css={{ animation: `${pulse} 1.5s infinite` }}>
        {loadingMessages[currentMessageIndex]}
      </Text>
    </Box>
  );
};

export default LoadingComponent;
