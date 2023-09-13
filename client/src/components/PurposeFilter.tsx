import { Box, Text, Select } from "@chakra-ui/react";

interface PurposeFilterProps {
  onPurposeChange: (purpose: string) => void;
}

const PurposeFilter: React.FC<PurposeFilterProps> = ({ onPurposeChange }) => {
  return (
    <Box>
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
