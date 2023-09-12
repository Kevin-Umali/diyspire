import { Box, Checkbox } from "@chakra-ui/react";
interface SafetyCheckFilterProps {
  onSafetyConfirmation: (isSafe: boolean) => void;
}

const SafetyCheck: React.FC<SafetyCheckFilterProps> = ({ onSafetyConfirmation }) => {
  return (
    <Box>
      <Checkbox onChange={(e) => onSafetyConfirmation(e.target.checked)}>I have all necessary safety equipment or precautions in place.</Checkbox>
    </Box>
  );
};

export default SafetyCheck;
