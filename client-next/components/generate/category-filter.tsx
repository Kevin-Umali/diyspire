import React, { useState } from "react";
import { categoryIcons } from "@/constants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CategoryFilterProps {
  categories: string[];
  onCategoryChange: (selectedCategory: string) => void;
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, onCategoryChange, className }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Anything");

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-4 mb-2">
        <Label className="block text-md font-medium">Category:</Label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          const IconComponent = categoryIcons[category];
          return (
            <Button
              key={category}
              variant="outline"
              onClick={() => handleCategoryClick(category)}
              className={`p-2 border cursor-pointer ${isSelected ? "text-black bg-secondary dark:text-white" : ""} flex items-center justify-center space-x-2 transition duration-300 ease-in-out`}
            >
              {IconComponent && <IconComponent size={20} />}
              <span className="text-sm">{category}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
