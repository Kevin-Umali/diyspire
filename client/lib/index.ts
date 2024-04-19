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

export const serializeParams = (params: Record<string, any>): string => {
  const buildParamString = (key: string, value: any, prefix = ""): string[] => {
    const parts: string[] = [];

    if (value == null) {
      return parts;
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        parts.push(`${encodeURIComponent(prefix + key)}=${encodeURIComponent(item)}`);
      });
    } else if (typeof value === "object" && !(value instanceof Date)) {
      if (shouldStringify(value)) {
        parts.push(`${encodeURIComponent(prefix + key)}=${encodeURIComponent(JSON.stringify(value))}`);
      } else {
        Object.keys(value).forEach((subKey) => {
          const fullKey = `${key}[${subKey}]`;
          parts.push(...buildParamString(fullKey, value[subKey], prefix));
        });
      }
    } else {
      const encodedValue = value instanceof Date ? value.toISOString() : value;
      parts.push(`${encodeURIComponent(prefix + key)}=${encodeURIComponent(encodedValue)}`);
    }

    return parts;
  };

  const parts: string[] = [];
  Object.keys(params).forEach((key) => {
    const value = params[key];
    parts.push(...buildParamString(key, value));
  });

  return parts.join("&");
};

const shouldStringify = (obj: any): boolean => {
  return Object.values(obj).some((value) => typeof value === "object" && value !== null && !(value instanceof Date));
};
