import { Response, NextFunction } from "express";

import { sendSuccess } from "../utils/response-template";
import OpenAI from "openai";
import { BodyRequest } from "../middleware/schema-validate";
import { ExplainRequest, IdeaRequest } from "../schema/openai.schema";

export const generateIdea = async (req: BodyRequest<IdeaRequest>, res: Response, next: NextFunction) => {
  try {
    const { materials, onlySpecified, difficulty, category, tools, time, budget, currency, endPurpose } = req.body;

    const openai: OpenAI = req.app.get("openai");

    const materialsDescription = onlySpecified
      ? `Only use the following specified materials: ${materials.join(", ")}.`
      : `Include any materials, especially the specified ones: ${materials.join(", ")}.`;

    const toolsDescription = tools.filter(Boolean).length > 0 ? `Work with these tools: ${tools.join(", ")}.` : "Recommend tools that might be beneficial for the projects.";

    const timeDescription = time.length !== 0 ? "There's no strict time constraint." : `The available time to complete the project is approximately ${time}.`;

    const budgetDescription = budget === "0" ? "The budget is flexible." : `The budget is set ${budget}`;

    const purposeDescription = endPurpose.toLowerCase() !== "other" ? `The desired outcome of these projects is primarily for ${endPurpose}.` : "The end goal for these projects is versatile.";

    const prompt: string = `
    I'm looking for 3 unique DIY project concepts. Here are the details:

    - Difficulty: ${difficulty}
    - Category: ${category}
    - Materials: ${materialsDescription}
    - Tools: ${toolsDescription}
    - Time: ${timeDescription}
    - Budget: ${budgetDescription}
    - Purpose: ${purposeDescription}
    - Currency: ${currency}

    Please provide the ideas in the following JSON format:

    {
        "ideas": [
            {
                "title": "The name of the project",
                "materials": ["List of required materials"],
                "tools": ["List of required tools"],
                "time": "Estimated time to complete the project",
                "budget": "Estimated budget for the project, including the materials and tools cost if needed",
                "tags": ["Tags/Hashtag about this project"],
                "description": "A short descriptive text of the project"
            },
            ... // Please provide three ideas in total.
        ]
    }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0613",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides detailed, step-by-step guides for building DIY projects based on provided details such as title, materials, tools, time, budget, and a brief overview.",
        },
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

export const explainProjectByTitle = async (req: BodyRequest<ExplainRequest>, res: Response, next: NextFunction) => {
  try {
    const { title, materials, tools, time, budget, description } = req.body as ExplainRequestBody;

    const openai: OpenAI = req.app.get("openai");

    const prompt = `
    I need a detailed, step-by-step guide for building a project. Here are the project details:

    - **Title**: ${title}
    - **Materials Required**: ${materials.join(", ")}
    - **Tools Needed**: ${tools.join(", ")}
    - **Estimated Time for Completion**: ${time} hours
    - **Budget Estimate**: ${budget}
    - **Project Overview**: ${description}

    Please structure your guide as follows:
    1. **Brief Overview**: A short summary of the entire process.
    2. **Step-by-Step Guide**: Provide detailed, actionable steps, considering the provided materials and tools. Each step should be numbered and clear.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0613",
      messages: [
        {
          role: "system",
          content:
            "You are an instructive assistant capable of generating clear, detailed, and step-by-step guides for DIY projects based on provided information such as title, materials, tools, time, budget, and a short description. Your guidance should be easy to follow, accurate, and considerate of safety and functionality in the execution of the project. Responses should be structured with a brief overview followed by a detailed, numbered step-by-step guide in Raw Markdown format.",
        },
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
