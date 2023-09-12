import { Select } from "@chakra-ui/react";

interface CategoryFilterProps {
  categories: string[];
  onCategoryChange: (selectedCategory: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, onCategoryChange }) => {
  return (
    <Select mt={2} defaultValue="Anything" required placeholder="Select category" onChange={(e) => onCategoryChange(e.target.value)}>
      {categories.map((category, index) => (
        <option key={index} value={category}>
          {category}
        </option>
      ))}
    </Select>
  );
};

export default CategoryFilter;
