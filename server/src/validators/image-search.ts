import { checkSchema } from "express-validator";

export const searchValidationSchema = checkSchema({
  query: {
    in: ["query"],
    errorMessage: "Query is required and should be a string.",
    isString: true,
    trim: true,
    isLength: {
      options: { min: 1, max: 100 },
      errorMessage: "Query should be between 1 to 100 characters long.",
    },
    notEmpty: {
      errorMessage: "Query is required",
    },
  },
});
