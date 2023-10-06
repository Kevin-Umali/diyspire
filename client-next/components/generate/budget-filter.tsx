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
    [onBudgetChange]
  );

  return (
    <div className={`mb-4 ${className}`}>
      <Label htmlFor="budget" className="block text-md font-medium mb-2">
        Budget (in PHP):
      </Label>
      <Input type="number" id="budget" min={0} onChange={handleChange} className="p-2 w-full border rounded" placeholder="e.g., 5000" />
    </div>
  );
};

export default BudgetFilter;
