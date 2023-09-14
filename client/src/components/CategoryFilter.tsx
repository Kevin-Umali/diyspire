import { Select, HStack, Text, VStack, BoxProps } from "@chakra-ui/react";

interface CategoryFilterProps extends BoxProps {
  categories: string[];
  onCategoryChange: (selectedCategory: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, onCategoryChange, ...props }) => {
  return (
    <VStack spacing={4} align="stretch" {...props}>
      <HStack spacing={4} alignItems="center">
        <Text fontSize="md">Category:</Text>
      </HStack>
      <Select mt={2} defaultValue={"Anything"} placeholder="Select category" onChange={(e) => onCategoryChange(e.target.value)}>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>
    </VStack>
  );
};

export default CategoryFilter;
