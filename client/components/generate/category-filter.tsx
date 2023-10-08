import { useState } from "react";
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
      <div className="mb-2 flex items-center space-x-4">
        <Label className="text-md block font-medium">Filter by Category:</Label>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          const IconComponent = categoryIcons[category];
          return (
            <Button
              key={category}
              onClick={() => handleCategoryClick(category)}
              variant="outline"
              className={`cursor-pointer border p-2 ${
                isSelected ? "border-primary" : "border-secondary"
              } flex items-center justify-center space-x-2 text-black transition duration-300 ease-in-out focus:bg-transparent active:bg-transparent dark:text-white`}
              aria-label={`Filter by ${category} category`}
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
