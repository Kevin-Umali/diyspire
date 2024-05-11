import { randomInt } from "crypto";
import { join } from "path";
import OpenAI from "openai";
import { createApi } from "unsplash-js";
import PromisePool from "@supercharge/promise-pool";
import { EmailSubscription, PrismaClient } from "@prisma/client";
import { fillTemplate, generateList, generateProjectSteps, sendEmail } from "../utils";
import { generateTokens } from "../utils/generate-tokens";
import logger from "../utils/logger";

export const processEmailQueue = async (
  prisma: PrismaClient,
  openai: OpenAI,
  unsplash: ReturnType<typeof createApi>,
  data: {
    allEmailSubscribers: EmailSubscription[];
    excludedProjectsList: string;
  },
) => {
  const { allEmailSubscribers, excludedProjectsList } = data;

  const prompt: string = `Generate a unique and engaging DIY project idea that is not included in my current list: [${excludedProjectsList}]. The project should not only inspire and motivate the audience to start crafting but also provide them with all necessary details to assess if they can undertake the project based on their skills and resources available.

    The output should be structured as a JSON object for an email campaign, containing:
    - "welcome": An object containing:
        - "title": "A welcoming title for the email, engaging and inviting.",
        - "content": "A short introduction to the newsletter or email content, setting the tone."
    - "title": The project title, intriguing and descriptive.
    - "fallback": A concise summary for email clients that do not support HTML.
    - "difficulty": Indicate whether the project is beginner, intermediate, or advanced.
    - "category": Specify the type of craft (e.g., woodworking, sewing, electronics).
    - "materials": List all materials required with detailed descriptions. This should be an array of strings.
    - "tools": Detail the tools needed to complete the project. This should be an array of strings.
    - "time": Estimate how long the project will take to complete.
    - "budget": Provide an approximate cost needed to complete the project.
    - "purpose": Explain what the project is used for or what problem it solves.
    - "currency": Specify the currency for the budget.
    - "details": Array of objects, each representing a step in the project. Each object should include:
        - "title": The title or number of the step.
        - "content": Detailed instructions for completing the step, make it clear and concise and longer.
        - "tips": Optional. Any tips or additional information to help complete the step more effectively.

    Ensure the response is comprehensive and formatted to be directly usable in an email marketing campaign, providing a visually appealing and informative guide for the DIY project.
    `;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_CHATGPT_MODEL,
    response_format: {
      type: "json_object",
    },
    messages: [
      {
        role: "system",
        content:
          "You are an instructive assistant capable of generating unique and engaging DIY project ideas that are not currently listed in the user's collection. Your output should inspire and motivate the audience to start crafting and provide them with all necessary details to assess if they can undertake the project based on their skills and resources. Your guidance should include a comprehensive overview and a detailed step-by-step guide, each step possibly including tips or additional information for better execution. Ensure the guide covers the project's difficulty level, category, required materials and tools, estimated time, budget, purpose, and currency. Each step should be clear, detailed, and considerate of safety and functionality, helping the audience to easily follow through and complete the project.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const projectIdea = completion?.choices?.[0]?.message?.content
    ? (JSON.parse(completion.choices[0].message.content) as {
        welcome: {
          title: string;
          content: string;
        };
        title: string;
        fallback: string;
        difficulty: string;
        category: string;
        materials: string[];
        tools: string[];
        time: string;
        budget: string;
        currency: string;
        purpose: string;
        details: {
          title: string;
          content: string;
          tips?: string;
        }[];
      })
    : null;

  if (!projectIdea) {
    throw new Error("Failed to generate project idea.");
  }

  const unsplashResponse = await unsplash.search.getPhotos({
    query: projectIdea.title,
    page: 1,
    perPage: 10,
  });

  let unsplashImage;

  if (unsplashResponse.errors || !unsplashResponse.response.results.length) {
    unsplashImage = {
      alt_description: "No images found",
      urls: { regular: "https://via.placeholder.com/300x400?text=No+images+found" },
    };
  } else {
    const maxLength = unsplashResponse.response.results.length < 5 ? unsplashResponse.response.results.length : 6;
    const randomIndex = randomInt(maxLength);
    const photo = unsplashResponse.response.results[randomIndex];

    if (!photo) {
      unsplashImage = {
        alt_description: "No images found",
        urls: { regular: "https://via.placeholder.com/300x400?text=No+images+found" },
      };
    } else {
      await unsplash.photos.trackDownload({ downloadLocation: photo.links.download_location });
      unsplashImage = {
        id: photo.id,
        width: photo.width,
        height: photo.height,
        color: photo.color ?? "transparent",
        alt_description: photo.alt_description ?? "No description found",
        urls: photo.urls,
        links: photo.links,
        user: {
          username: photo.user.username,
          name: photo.user.name,
          link: photo.user.links.html,
        },
      } as {
        id?: string;
        width?: number;
        height?: number;
        color?: string;
        alt_description: string;
        urls: {
          regular: string;
        };
        links?: {
          html?: string;
        };
        user?: {
          username?: string;
          name?: string;
          link?: string;
        };
      };
    }
  }

  const generatedHtml = await fillTemplate(join(__dirname, "..", "template", "index.html"), {
    header_image: "https://www.diyspire.online/android-chrome-192x192.png",
    header_alt: "DIYspire - diyspire.online logo",
    header_title: "DIYspire",
    welcome_title: projectIdea.welcome.title,
    welcome_content: projectIdea.welcome.content,
    project_image: unsplashImage.urls.regular,
    project_alt: unsplashImage.alt_description ?? "DIY Project Image",
    photographer_url: unsplashImage.user?.link ?? "",
    photographer_name: unsplashImage.user?.name ?? "",
    project_title: projectIdea.title,
    project_difficulty: projectIdea.difficulty,
    project_category: projectIdea.category,
    project_purpose: projectIdea.purpose,
    project_materials: generateList(projectIdea.materials),
    project_tools: generateList(projectIdea.tools),
    project_time: projectIdea.time,
    project_budget: projectIdea.budget,
    project_currency: projectIdea.currency,
    cta_url: "https://www.diyspire.online/?is_safe=false",
    project_steps: generateProjectSteps(projectIdea.details),
  });

  const subscriberResults = await PromisePool.for(allEmailSubscribers)
    .withConcurrency(50)
    .process(async (subscriber) => {
      const { accessToken } = await generateTokens({
        options: { id: subscriber.id, email: subscriber.address },
      });

      const unsubscribeUrl = `${process.env.BACKEND_URL}api/v1/email/unsubscribe?email=${subscriber.address}&token=${accessToken}`;

      const updatedGeneratedHtml = await fillTemplate(
        generatedHtml,
        {
          unsubscribe_url: unsubscribeUrl,
        },
        true,
      );

      return {
        to: subscriber.address,
        subject: `DIYspire - ${projectIdea.title}`,
        text: `DIYspire - ${projectIdea.title}`,
        html: updatedGeneratedHtml,
        unsubscribeUrl: unsubscribeUrl,
      };
    });

  const emailSendingResults = await PromisePool.for(subscriberResults.results)
    .withConcurrency(50)
    .process(async (result) => {
      return await sendEmail(result);
    });

  if (subscriberResults.errors.length || emailSendingResults.errors.length) {
    logger.error("Errors occurred during email sending:", subscriberResults.errors.length || emailSendingResults.errors.length);
  }

  await prisma.generatedMonthlyDIY.create({
    data: {
      name: projectIdea.title,
    },
  });

  logger.info(`${emailSendingResults.results.length} emails sent successfully.`);
};
