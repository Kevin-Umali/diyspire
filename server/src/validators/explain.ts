import { checkSchema } from "express-validator";
import { escapeArrayStrings } from "../utils";

export const explainValidationSchema = checkSchema({
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title should be a string",
    },
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Title is required",
    },
  },
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
    isString: {
      errorMessage: "Time should be a string",
    },
    trim: true,
    escape: true,
  },
  budget: {
    in: ["body"],
    isString: {
      errorMessage: "Budget should be a string",
    },
    trim: true,
    escape: true,
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage: "Description should be a string",
    },
    trim: true,
    escape: true,
  },
});
