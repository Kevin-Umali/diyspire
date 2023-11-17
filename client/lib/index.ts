import { Categories } from "@/interfaces";

export const cleanMarkdown = (content: string): string => {
  return content
    .split("\n")
    .map((line) => line.trimStart())
    .join("\n");
};

export const createSubCategoryToMainCategoryMapping = (categories: Categories): Record<string, string> => {
  const mapping: Record<string, string> = {};
  Object.entries(categories).forEach(([mainCategory, { subcategories }]) => {
    Object.keys(subcategories).forEach((subCategory) => {
      mapping[subCategory] = mainCategory;
    });
  });
  return mapping;
};

export const getMainAndSubCategory = (initialCategory: string, categories: Categories) => {
  const mapping = createSubCategoryToMainCategoryMapping(categories);
  const mainCategory = mapping[initialCategory] || "General";
  const subCategory = initialCategory || "Anything";
  return { mainCategory, subCategory };
};
