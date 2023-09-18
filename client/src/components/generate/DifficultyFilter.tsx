import { Radio, RadioGroup, Stack, HStack, Text, VStack, BoxProps } from "@chakra-ui/react";

interface DifficultyFilterProps extends BoxProps {
  onDifficultyChange: (difficulty: string) => void;
}

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({ onDifficultyChange, ...props }) => {
  return (
    <VStack spacing={4} align="stretch" {...props}>
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
