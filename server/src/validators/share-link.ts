import { checkSchema } from "express-validator";

export const shareProjectValidationSchema = checkSchema({
  "projectDetails.title": {
    in: ["body"],
    errorMessage: "Title is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Title is required",
    },
  },
  "projectDetails.materials": {
    in: ["body"],
    errorMessage: "Materials should be an array.",
    isArray: true,
  },
  "projectDetails.tools": {
    in: ["body"],
    errorMessage: "Tools should be an array.",
    isArray: true,
  },
  "projectDetails.time": {
    in: ["body"],
    errorMessage: "Time is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Time is required",
    },
  },
  "projectDetails.budget": {
    in: ["body"],
    errorMessage: "Budget is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Budget is required",
    },
  },
  "projectDetails.description": {
    in: ["body"],
    errorMessage: "Description is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Description is required",
    },
  },
  "projectImage.id": {
    in: ["body"],
    errorMessage: "Image ID is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Image ID is required",
    },
  },
  "projectImage.width": {
    in: ["body"],
    errorMessage: "Image width should be an integer.",
    isInt: true,
  },
  "projectImage.height": {
    in: ["body"],
    errorMessage: "Image height should be an integer.",
    isInt: true,
  },
  "projectImage.color": {
    in: ["body"],
    errorMessage: "Image color is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Image color is required",
    },
  },
  "projectImage.alt_description": {
    in: ["body"],
    errorMessage: "Image alt description is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Image alt description is required",
    },
  },
  "projectImage.urls.raw": {
    in: ["body"],
    errorMessage: "Image raw URL is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Image raw URL is required",
    },
  },
  "projectImage.urls.full": {
    in: ["body"],
    errorMessage: "Image full URL is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Image full URL is required",
    },
  },
  "projectImage.urls.regular": {
    in: ["body"],
    errorMessage: "Image regular URL is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Image regular URL is required",
    },
  },
  "projectImage.urls.small": {
    in: ["body"],
    errorMessage: "Image small URL is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Image small URL is required",
    },
  },
  "projectImage.urls.thumb": {
    in: ["body"],
    errorMessage: "Image thumb URL is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Image thumb URL is required",
    },
  },
  "projectImage.urls.small_s3": {
    in: ["body"],
    errorMessage: "Image small_s3 URL is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Image small_s3 URL is required",
    },
  },
  "projectImage.links.self": {
    in: ["body"],
    errorMessage: "Image self link is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Image self link is required",
    },
  },
  "projectImage.links.html": {
    in: ["body"],
    errorMessage: "Image HTML link is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Image HTML link is required",
    },
  },
  "projectImage.links.download": {
    in: ["body"],
    errorMessage: "Image download link is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Image download link is required",
    },
  },
  "projectImage.links.download_location": {
    in: ["body"],
    errorMessage: "Image download location link is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Image download location link is required",
    },
  },
  "projectImage.user.username": {
    in: ["body"],
    errorMessage: "User username is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "User username is required",
    },
  },
  "projectImage.user.name": {
    in: ["body"],
    errorMessage: "User name is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "User name is required",
    },
  },
  "projectImage.user.link": {
    in: ["body"],
    errorMessage: "User link is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "User link is required",
    },
  },
  explanation: {
    in: ["body"],
    errorMessage: "Explanation is required and should be a string.",
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Explanation is required",
    },
  },
});
