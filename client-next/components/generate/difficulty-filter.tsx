import React, { useState } from "react";
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
      <div className="flex items-center space-x-4 mb-2">
        <Label className="block text-md font-medium">Difficulty:</Label>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
        {difficulties.map(({ level, icon: IconComponent }) => (
          <Button
            key={level}
            variant="outline"
            onClick={() => handleDifficultyClick(level)}
            className={`p-2 border cursor-pointer ${selectedDifficulty === level ? "font-bold" : "font-normal"} flex items-center justify-center space-x-2 transition duration-300 ease-in-out`}
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
