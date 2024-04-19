"use client";

import { useState } from "react";
import { Categories } from "@/interfaces";
import { getMainAndSubCategory } from "@/lib";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CategoryFilterProps {
  categories: Categories;
  initialCategory: string; // Renamed for clarity
  onCategoryChange: (selectedCategory: string) => void;
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, initialCategory, onCategoryChange, className }) => {
  const { mainCategory, subCategory } = getMainAndSubCategory(initialCategory, categories);

  const [currentCategory, setCurrentCategory] = useState<string | null>(mainCategory);
  const [currentSubCategory, setCurrentSubCategory] = useState<string | null>(subCategory);
  const [subCategoryOptions, setSubCategoryOptions] = useState<string[]>(Object.keys(categories[mainCategory].subcategories));

  const handleCategoryClick = (category: string, subcategories: any) => {
    setCurrentCategory(category);
    setCurrentSubCategory(null);
    setSubCategoryOptions(Object.keys(subcategories));
  };

  const handleSubCategoryClick = (subCategory: string) => {
    onCategoryChange(subCategory);
    setCurrentSubCategory(subCategory);
  };

  return (
    <div className={`space-y-4 border px-4 pb-10 pt-5 sm:px-20 ${className}`}>
      <div className="mb-2 flex flex-col items-center text-center sm:flex-col sm:items-center sm:text-center">
        <div className="mb-2 flex flex-col items-center space-x-0 sm:mb-0 sm:flex-row sm:space-x-2">
          <div className="mb-2 flex size-8 items-center justify-center rounded-full border sm:mb-0 sm:mr-2">1</div>
          <Label className="text-md block font-medium">Which category of DIY projects interests you?</Label>
        </div>
        <Label className="text-xs">Choose a category to explore projects</Label>
      </div>
      <div className="flex justify-center">
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Object.keys(categories).map((category) => {
            const isSelected = currentCategory === category;
            const { icon: IconComponent, subcategories } = categories[category];
            return (
              <div
                key={category}
                onClick={() => handleCategoryClick(category, subcategories)}
                className={`flex cursor-pointer flex-col items-center justify-center space-y-2 p-2 transition duration-300 ease-in-out`}
                aria-label={`Filter by ${category} category`}
                tabIndex={0}
              >
                {IconComponent && (
                  <Button variant="outline" size="icon" className={`size-12 rounded-full ${isSelected ? "border-primary" : ""}`} aria-label={`Filter by ${category} category`}>
                    <IconComponent size={20} />
                  </Button>
                )}
                <span className="text-sm">{category}</span>
              </div>
            );
          })}
        </div>
      </div>
      {subCategoryOptions.length > 0 && (
        <div className="mt-4 text-center">
          <Label className="text-md block font-medium">Select Subcategory</Label>
          <div className="mt-2 grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {subCategoryOptions.map((subCategory) => (
              <Button
                key={subCategory}
                onClick={() => handleSubCategoryClick(subCategory)}
                variant="outline"
                className={`cursor-pointer border p-2 ${
                  currentSubCategory === subCategory ? "border-primary" : ""
                } flex items-center justify-center space-x-2 transition duration-300 ease-in-out focus:bg-transparent active:bg-transparent`}
                aria-label={`Filter by ${subCategory} subcategory`}
              >
                {subCategory}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
