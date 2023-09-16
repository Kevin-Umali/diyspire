import { Request, Response, NextFunction } from "express";

import { sendSuccess } from "../utils/response-template";
import OpenAI from "openai";

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

export const generateIdea = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
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

    const openai: OpenAI = req.app.get("openai");

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
};

interface ExplainRequestBody {
  title: string;
  materials: string[];
  tools: string[];
  time: string;
  budget: string;
  description: string;
}

export const explainProjectByTitle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, materials, tools, time, budget, description } =
      req.body as ExplainRequestBody;

    const openai: OpenAI = req.app.get("openai");

    const prompt = `
      Please provide a detailed, step-by-step guide on how to build the project described below:
      
      Title: ${title}
      Materials Required: ${materials.join(", ")}
      Tools Needed: ${tools.join(", ")}
      Estimated Time for Completion: ${time}
      Budget Estimate: ${budget}
      Project Overview: ${description}

      Begin with an overview, and then break down each step, keeping in mind the materials and tools mentioned.
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
      sendSuccess(res, {
        explanation: completion.choices[0].message.content,
      });
    }
  } catch (error) {
    next(error);
  }
};