import { Box, VStack, HStack, Text, Icon, BoxProps, useColorModeValue } from "@chakra-ui/react";
import React, { useState } from "react";
import { difficulties } from "../../constants";

interface DifficultyFilterProps extends BoxProps {
  onDifficultyChange: (difficulty: string) => void;
}

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({ onDifficultyChange, ...props }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const textLightColor = useColorModeValue("text.light", "text.dark");
  const primaryLightColor = useColorModeValue("primary.light", "primary.dark");
  const backgroundLightColor = useColorModeValue("background.light", "background.dark");

  const handleDifficultyClick = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    onDifficultyChange(difficulty);
  };

  return (
    <VStack spacing={4} align="stretch" {...props}>
      <HStack spacing={4} alignItems="center">
        <Text fontSize="md" color={textLightColor}>
          Difficulty:
        </Text>
      </HStack>
      <HStack spacing={4} wrap="wrap">
        {difficulties.map(({ level, icon }) => (
          <Box
            key={level}
            p={2}
            borderWidth={1}
            bg={selectedDifficulty === level ? primaryLightColor : backgroundLightColor}
            color={selectedDifficulty === level ? backgroundLightColor : textLightColor}
            _hover={{ bg: primaryLightColor, color: backgroundLightColor }}
            cursor="pointer"
            onClick={() => handleDifficultyClick(level)}
          >
            <HStack spacing={2}>
              {icon && <Icon as={icon} />}
              <Text>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
            </HStack>
          </Box>
        ))}
      </HStack>
    </VStack>
  );
};

export default DifficultyFilter;
