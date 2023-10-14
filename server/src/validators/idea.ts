import { checkSchema } from "express-validator";
import { escapeArrayStrings } from "../utils";

export const ideaValidationSchema = checkSchema({
  materials: {
    in: ["body"],
    isArray: {
      errorMessage: "Materials should be an array of strings",
    },
    custom: {
      options: (value: any) => value.every((v: any) => typeof v === "string"),
      errorMessage: "All elements in materials should be strings",
    },
    customSanitizer: {
      options: escapeArrayStrings,
    },
  },
  onlySpecified: {
    in: ["body"],
    isBoolean: {
      errorMessage: "onlySpecified should be a boolean",
    },
  },
  difficulty: {
    in: ["body"],
    isString: true,
    trim: true,
    escape: true,
  },
  category: {
    in: ["body"],
    isString: true,
    trim: true,
    escape: true,
  },
  tools: {
    in: ["body"],
    isArray: {
      errorMessage: "Tools should be an array of strings",
    },
    custom: {
      options: (value: any) => value.every((v: any) => typeof v === "string"),
      errorMessage: "All elements in tools should be strings",
    },
    customSanitizer: {
      options: escapeArrayStrings,
    },
  },
  time: {
    in: ["body"],
    isString: true,
    trim: true,
    escape: true,
  },
  budget: {
    in: ["body"],
    isString: true,
    trim: true,
    escape: true,
  },
  currency: {
    in: ["body"],
    isString: true,
    trim: true,
    escape: true,
  },
  endPurpose: {
    in: ["body"],
    isString: true,
    trim: true,
    escape: true,
  },
});
