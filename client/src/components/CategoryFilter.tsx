import { Select, HStack, Text, VStack } from "@chakra-ui/react";

interface CategoryFilterProps {
  categories: string[];
  onCategoryChange: (selectedCategory: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, onCategoryChange }) => {
  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={4} alignItems="center">
        <Text fontSize="md">Category:</Text>
      </HStack>

      <Select mt={2} defaultValue={"Anything"} placeholder="Select category" onChange={(e) => onCategoryChange(e.target.value)}>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </Select>
    </VStack>
  );
};

export default CategoryFilter;
