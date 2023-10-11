import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PurposeFilterProps {
  purpose: string;
  onPurposeChange: (purpose: string) => void;
  className?: string;
}

const PurposeFilter: React.FC<PurposeFilterProps> = ({ purpose, onPurposeChange, className }) => {
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(purpose);

  const handlePurposeChange = (newPurpose: string) => {
    setSelectedPurpose(newPurpose);
    onPurposeChange(newPurpose);
  };

  return (
    <div className={`space-y-4 border px-4 pb-10 pt-5 sm:px-20 ${className}`}>
      <div className="mb-2 flex flex-col items-center text-center sm:flex-col sm:items-center sm:text-center">
        <div className="mb-2 flex flex-col items-center space-x-0 sm:mb-0 sm:flex-row sm:space-x-2">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border sm:mb-0 sm:mr-2">3</div>
          <Label htmlFor="purpose" className="text-md block font-medium">
            What&apos;s the purpose of the end result?
          </Label>
        </div>
        <Label className="text-xs">Specify the intention for the crafted item</Label>
      </div>

      <Select onValueChange={(e) => handlePurposeChange(e)} defaultValue={selectedPurpose ?? ""} aria-label="Select a purpose for the end result">
        <SelectTrigger className="w-full" aria-label="Select a purpose for the end result">
          <SelectValue placeholder="Select Purpose" />
        </SelectTrigger>
        <SelectContent aria-label="Select a purpose for the end result">
          <SelectGroup>
            <SelectItem value="Personal Use">Personal Use</SelectItem>
            <SelectItem value="Gift">Gift</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PurposeFilter;
