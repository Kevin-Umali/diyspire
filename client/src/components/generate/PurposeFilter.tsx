import { Box, Text, Select, BoxProps } from "@chakra-ui/react";

interface PurposeFilterProps extends BoxProps {
  onPurposeChange: (purpose: string) => void;
}

const PurposeFilter: React.FC<PurposeFilterProps> = ({ onPurposeChange, ...props }) => {
  return (
    <Box {...props}>
      <Text mb={2}>End Result Purpose:</Text>
      <Select defaultValue={0} onChange={(e) => onPurposeChange(e.target.value)}>
        <option value="Personal Use">Personal Use</option>
        <option value="Gift">Gift</option>
        <option value="Other">Other</option>
      </Select>
    </Box>
  );
};

export default PurposeFilter;
