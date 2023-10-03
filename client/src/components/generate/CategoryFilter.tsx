import { Box, VStack, HStack, Text, BoxProps, useColorModeValue } from "@chakra-ui/react";
import React, { useState } from "react";
import { categoryIcons } from "../../constants";

interface CategoryFilterProps extends BoxProps {
  categories: string[];
  onCategoryChange: (selectedCategory: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, onCategoryChange, ...props }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Anything");

  const textLightColor = useColorModeValue("text.light", "text.dark");
  const primaryLightColor = useColorModeValue("primary.light", "primary.dark");
  const backgroundLightColor = useColorModeValue("background.light", "background.dark");

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  return (
    <VStack spacing={4} align="stretch" {...props}>
      <HStack spacing={4} alignItems="center">
        <Text fontSize="md" color={textLightColor}>
          Category:
        </Text>
      </HStack>
      <HStack spacing={4} wrap="wrap">
        {categories.map((category) => {
          const IconComponent = categoryIcons[category];
          return (
            <Box
              key={category}
              p={2}
              borderWidth={1}
              bg={selectedCategory === category ? primaryLightColor : backgroundLightColor}
              color={selectedCategory === category ? backgroundLightColor : textLightColor}
              _hover={{ bg: primaryLightColor, color: backgroundLightColor }}
              cursor="pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <HStack spacing={2}>
                {IconComponent && <IconComponent />}
                <Text>{category}</Text>
              </HStack>
            </Box>
          );
        })}
      </HStack>
    </VStack>
  );
};

export default CategoryFilter;
