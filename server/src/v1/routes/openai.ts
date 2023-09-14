import express, { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/response-template";
import { ideaValidationSchema } from "../schemas/idea";
import { validationResult } from "express-validator/src/validation-result";

const router = express.Router();

interface IdeaRequestBody {
  materials: string[];
  onlySpecified: boolean;
  difficulty: string;
  category: string;
  tools: string[];
  time: number;
  budget: number;
  endPurpose: string;
}

router.post(
  "/idea",
  ideaValidationSchema,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return sendSuccess(res, { errors: errors.array() }, 400);
      }

      const {
        materials,
        onlySpecified,
        difficulty,
        category,
        tools,
        time,
        budget,
        endPurpose,
      }: IdeaRequestBody = req.body;

      const openai = req.app.get("openai");

      const materialsString = onlySpecified
        ? `Only use the following specified materials: ${materials.join(", ")}.`
        : `Include any materials, especially the specified ones: ${materials.join(
            ", ",
          )}.`;

      const toolsString =
        tools.length > 0
          ? `Work with these tools: ${tools.join(", ")}.`
          : "Recommend tools that might be beneficial for the projects.";

      const timeString =
        time === 0
          ? "There's no strict time constraint."
          : `The available time to complete the project is approximately ${time} hours.`;

      const budgetString =
        budget === 0
          ? "The budget is flexible."
          : `The budget is set between ₱0 and ₱${budget}.`;

      const purposeString =
        endPurpose !== "other"
          ? `The desired outcome of these projects is primarily for ${endPurpose}.`
          : "The end goal for these projects is versatile.";

      const prompt: string = `
      Please generate a response in the following JSON format:

      {
          "ideas": [
              {
                  "title": "The name of the project",
                  "materials": ["List of required materials"],
                  "tools": ["List of required tools"],
                  "time": "Estimated time to complete the project",
                  "budget": "Estimated budget for the project in ₱",
                  "steps": ["Detailed step-by-step guide to complete the project"],
                  "description": "A short descriptive text of the project"
              },
              ... // And so on for three ideas
          ]
      }

      I'm looking for 3 unique DIY project concepts suitable for a ${difficulty} difficulty within the ${category} category.
      ${materialsString}
      ${toolsString}
      ${timeString}
      ${budgetString}
      ${purposeString}
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      if (completion?.choices?.[0]?.message?.content) {
        sendSuccess(res, JSON.parse(completion.choices[0].message.content));
      }
    } catch (error) {
      next(error);
    }
  },
);

export default router;
