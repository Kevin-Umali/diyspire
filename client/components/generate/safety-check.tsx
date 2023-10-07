import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SafetyCheckFilterProps {
  onSafetyConfirmation: (isSafe: boolean) => void;
  className?: string;
}

const SafetyCheck: React.FC<SafetyCheckFilterProps> = ({ onSafetyConfirmation, className }) => {
  const handleChange = (checkedState: boolean) => {
    onSafetyConfirmation(checkedState);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Checkbox aria-label="Checkbox for safety" id="safetyConfirmation" onCheckedChange={handleChange} />
      <Label htmlFor="safetyConfirmation">I have all necessary safety equipment or precautions in place.</Label>
    </div>
  );
};

export default SafetyCheck;
