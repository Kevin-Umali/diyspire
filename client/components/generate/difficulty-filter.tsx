import { useState } from "react";
import { difficulties } from "@/constants";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface DifficultyFilterProps {
  onDifficultyChange: (difficulty: string) => void;
  className?: string;
}

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({ onDifficultyChange, className }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const handleDifficultyClick = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    onDifficultyChange(difficulty);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="mb-2 flex items-center space-x-4">
        <Label className="text-md block font-medium">Filter by Difficulty:</Label>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
        {difficulties.map(({ level, icon: IconComponent }) => (
          <Button
            key={level}
            onClick={() => handleDifficultyClick(level)}
            variant="outline"
            className={`cursor-pointer border p-2 ${
              selectedDifficulty === level ? "border-primary" : "border-secondary"
            } flex items-center justify-center space-x-2 text-black transition duration-300 ease-in-out focus:bg-transparent active:bg-transparent dark:text-white`}
            aria-label={`Filter by ${level} difficulty`}
          >
            {IconComponent && <IconComponent size={20} />}
            <span className="text-sm capitalize">{level}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DifficultyFilter;
