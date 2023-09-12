import { Radio, RadioGroup, Stack } from "@chakra-ui/react";

interface DifficultyFilterProps {
  onDifficultyChange: (difficulty: string) => void;
}

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({ onDifficultyChange }) => {
  return (
    <RadioGroup defaultValue="all" onChange={onDifficultyChange}>
      <Stack spacing={5} direction="row">
        <Radio value="all">All</Radio>
        <Radio value="beginner">Beginner</Radio>
        <Radio value="intermediate">Intermediate</Radio>
        <Radio value="advanced">Advanced</Radio>
      </Stack>
    </RadioGroup>
  );
};

export default DifficultyFilter;
