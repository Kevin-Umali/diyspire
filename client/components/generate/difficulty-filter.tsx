import { useState } from "react";
import { difficulties } from "@/constants";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface DifficultyFilterProps {
  onDifficultyChange: (difficulty: string) => void;
  className?: string;
}

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({ onDifficultyChange, className }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("any difficulty");

  const handleDifficultyClick = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    onDifficultyChange(difficulty);
  };

  return (
    <div className={`space-y-4 border px-4 pb-10 pt-5 sm:px-20 ${className}`}>
      <div className="mb-2 flex flex-col items-center text-center sm:flex-col sm:items-center sm:text-center">
        <div className="mb-2 flex flex-col items-center space-x-0 sm:mb-0 sm:flex-row sm:space-x-2">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border sm:mb-0 sm:mr-2">2</div>
          <Label className="text-md block font-medium">What level of crafting difficulty suits you today?</Label>
        </div>
        <Label className="text-xs">Choose a difficulty level for your DIY project</Label>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {difficulties.map(({ level, icon: IconComponent }) => (
          <Button
            key={level}
            onClick={() => handleDifficultyClick(level)}
            variant="outline"
            className={`cursor-pointer border p-2 ${
              selectedDifficulty === level ? "border-primary" : ""
            } flex items-center justify-center space-x-2 transition duration-300 ease-in-out focus:bg-transparent active:bg-transparent`}
            aria-label={`Filter by ${level} difficulty`}
          >
            {IconComponent && <IconComponent className="mr-2" size={20} />}
            <span className="text-sm capitalize">{level}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DifficultyFilter;
