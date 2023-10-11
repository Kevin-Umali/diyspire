import { useState } from "react";
import { budgetOptions } from "@/constants";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface BudgetFilterProps {
  onBudgetChange: (budget: string) => void;
  className?: string;
}

const BudgetFilter: React.FC<BudgetFilterProps> = ({ onBudgetChange, className }) => {
  const [selectedBudget, setSelectedBudget] = useState<string | null>("0");

  const handleBudgetClick = (budget: string) => {
    setSelectedBudget(budget);
    onBudgetChange(budget);
  };

  return (
    <div className={`space-y-4 border px-4 pb-10 pt-5 sm:px-20 ${className}`}>
      <div className="mb-2 flex flex-col items-center text-center sm:flex-col sm:items-center sm:text-center">
        <div className="mb-2 flex flex-col items-center space-x-0 sm:mb-0 sm:flex-row sm:space-x-2">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border sm:mb-0 sm:mr-2">4</div>
          <Label className="text-md block font-medium">What&apos;s your budget?</Label>
        </div>
        <Label className="text-xs">Choose a budget range for your project</Label>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {budgetOptions.map(({ label, value }) => (
          <Button
            key={label}
            onClick={() => handleBudgetClick(value)}
            variant="outline"
            className={`cursor-pointer border p-2 ${
              selectedBudget === value ? "border-primary" : ""
            } flex items-center justify-center space-x-2 transition duration-300 ease-in-out focus:bg-transparent active:bg-transparent`}
            aria-label={`Filter by ${label} budget`}
          >
            <span className="text-sm capitalize">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BudgetFilter;
