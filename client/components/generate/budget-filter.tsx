import { useCallback } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BudgetFilterProps {
  onBudgetChange: (budget: number) => void;
  className?: string;
}

const BudgetFilter: React.FC<BudgetFilterProps> = ({ onBudgetChange, className }) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onBudgetChange(Number(event.target.value));
    },
    [onBudgetChange],
  );

  return (
    <div className={`mb-4 ${className}`}>
      <fieldset>
        <legend>
          <Label htmlFor="budget" className="text-md mb-2 block font-medium">
            Budget (in PHP):
          </Label>
        </legend>
        <Input type="number" id="budget" min={0} onChange={handleChange} className="w-full rounded border p-2" placeholder="Enter your budget in PHP" />
      </fieldset>
    </div>
  );
};

export default BudgetFilter;
