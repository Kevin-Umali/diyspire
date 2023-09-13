import express, { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/response-template";

const router = express.Router();

router.post(
  "/idea",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        materials,
        difficulty,
        category,
        tools,
        time,
        budget,
        endPurpose,
      } = req.body;

      const openai = req.app.get("openai");

      const prompt: string = `
      Please generate a response in the following JSON format:
    
      {
        "ideas": [
          {
            "title": "The name of the project",
            "materials": ["List of required materials"],
            "tools": ["List of required tools"],
            "time": "Estimated time to complete the project",
            "budget": "Estimated budget for the project",
            "steps": ["Step-by-step guide to complete the project"],
            "description": "A short descriptive text of the project"
          },
          ... // And so on for three ideas
        ]
      }
      
      Provide 3 distinct DIY project ideas for a ${difficulty} level in the category of ${category} using the following materials: ${materials.join(
        ", ",
      )}. 
      ${tools.length > 0 ? `The available tools are: ${tools.join(", ")}.` : ""}
      ${
        time === 0
          ? ""
          : `The available time to complete the project is ${time} hours.`
      }
      ${
        budget === 0 ? "" : `The available budget ranges from ₱0 to ₱${budget}.`
      }
      ${
        endPurpose !== "other"
          ? `The end purpose for these projects is ${endPurpose}.`
          : ""
      }
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
