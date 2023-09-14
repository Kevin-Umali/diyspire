import { Box, Text, Select, BoxProps } from "@chakra-ui/react";

interface PurposeFilterProps extends BoxProps {
  onPurposeChange: (purpose: string) => void;
}

const PurposeFilter: React.FC<PurposeFilterProps> = ({ onPurposeChange, ...props }) => {
  return (
    <Box {...props}>
      <Text mb={2}>End Result Purpose:</Text>
      <Select onChange={(e) => onPurposeChange(e.target.value)}>
        <option value="personal">Personal Use</option>
        <option value="gift">Gift</option>
        <option value="other">Other</option>
      </Select>
    </Box>
  );
};

export default PurposeFilter;
