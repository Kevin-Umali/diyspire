import { Box, Text, NumberInput, NumberInputField, BoxProps } from "@chakra-ui/react";
import { useCallback } from "react";

interface BudgetFilterProps extends BoxProps {
  onBudgetChange: (budget: number) => void;
}

const BudgetFilter: React.FC<BudgetFilterProps> = ({ onBudgetChange, ...props }) => {
  const handleChange = useCallback(
    (value: string | number) => {
      onBudgetChange(Number(value));
    },
    [onBudgetChange]
  );

  return (
    <Box {...props}>
      <Text mb={2}>Budget (in PHP):</Text>
      <NumberInput min={0} onChange={handleChange}>
        <NumberInputField />
      </NumberInput>
    </Box>
  );
};

export default BudgetFilter;
