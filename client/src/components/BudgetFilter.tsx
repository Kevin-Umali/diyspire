import { Box, Text, NumberInput, NumberInputField } from "@chakra-ui/react";

interface BudgetFilterProps {
  onBudgetChange: (budget: number) => void;
}

const BudgetFilter: React.FC<BudgetFilterProps> = ({ onBudgetChange }) => {
  return (
    <Box>
      <Text mb={2}>Budget (in PHP):</Text>
      <NumberInput min={0} onChange={(value) => onBudgetChange(Number(value))}>
        <NumberInputField />
      </NumberInput>
    </Box>
  );
};

export default BudgetFilter;
