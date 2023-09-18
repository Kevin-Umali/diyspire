import { Box, BoxProps, Checkbox } from "@chakra-ui/react";

interface SafetyCheckFilterProps extends BoxProps {
  onSafetyConfirmation: (isSafe: boolean) => void;
}

const SafetyCheck: React.FC<SafetyCheckFilterProps> = ({ onSafetyConfirmation, ...props }) => {
  return (
    <Box {...props}>
      <Checkbox onChange={(e) => onSafetyConfirmation(e.target.checked)}>I have all necessary safety equipment or precautions in place.</Checkbox>
    </Box>
  );
};

export default SafetyCheck;
