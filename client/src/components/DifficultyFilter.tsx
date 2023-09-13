import { Radio, RadioGroup, Stack, HStack, Text, VStack } from "@chakra-ui/react";

interface DifficultyFilterProps {
  onDifficultyChange: (difficulty: string) => void;
}

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({ onDifficultyChange }) => {
  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={4} alignItems="center">
        <Text fontSize="md">Difficulty:</Text>
      </HStack>

      <RadioGroup defaultValue="all" onChange={onDifficultyChange}>
        <Stack spacing={5} direction={{ base: "column", md: "row" }}>
          <Radio value="all">All</Radio>
          <Radio value="beginner">Beginner</Radio>
          <Radio value="intermediate">Intermediate</Radio>
          <Radio value="advanced">Advanced</Radio>
        </Stack>
      </RadioGroup>
    </VStack>
  );
};

export default DifficultyFilter;
