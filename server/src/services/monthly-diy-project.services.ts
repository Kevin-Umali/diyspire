import { randomInt } from "crypto";
import { promises as fs } from "fs";
import { join } from "path";
import nodemailer from "nodemailer";
import type { OpenAI } from "openai";
import { createApi } from "unsplash-js";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import PromisePool from "@supercharge/promise-pool";
import type { Prisma, PrismaClient } from "@prisma/client";
import { generateTokens } from "../utils/generate-tokens";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
  unsubscribeUrl: string;
}

interface GeneratedMonthlyDIY {
  welcome: Welcome;
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
  details: ProjectDetail[];
}

interface Welcome {
  title: string;
  content: string;
}

interface ProjectDetail {
  title: string;
  content: string;
  tips?: string;
}

interface UnplashImage {
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
}

const sendEmail = async ({ to, subject, text, html, unsubscribeUrl }: EmailOptions) => {
  try {
    const { EMAIL_USER, EMAIL_PASSWORD, EMAIL_DOMAIN, EMAIL_HOST = "smtp.hostinger.com", EMAIL_PORT } = process.env;

    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT ?? "465", 10),
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
      list: {
        unsubscribe: {
          url: unsubscribeUrl,
          comment: "Unsubscribe",
        },
      },
    });

    await transporter.sendMail({
      from: EMAIL_DOMAIN,
      to,
      subject,
      text: text,
      html: html,
    });
  } catch (error) {
    console.error(`Failed to send to: ${to}`, error);
  }
};

const getEmailSubscription = async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) =>
  await prisma.emailSubscription.findMany({
    where: {
      unsubscribe: false,
    },
    select: {
      id: true,
      address: true,
      unsubscribe: true,
    },
  });

const getExistingMonthlyDiyProject = async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => await prisma.generatedMonthlyDIY.findMany();

const saveGeneratedDiyProject = async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, name: string) =>
  await prisma.generatedMonthlyDIY.create({
    data: {
      name: name,
    },
  });

const generateMonthlyDiyProject = async (
  openai: OpenAI,
  existingMonthlyDiyProject: {
    name: string;
    createdAt: Date;
  }[],
) => {
  const existingProjects: string[] = existingMonthlyDiyProject.map((diyProject) => diyProject.name);
  const excludedProjectsList: string = existingProjects.join(", ");

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
    model: "gpt-3.5-turbo-0613",
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

  if (completion?.choices?.[0]?.message?.content) {
    return JSON.parse(completion.choices[0].message.content) as GeneratedMonthlyDIY;
  }
};

const getUnplashImage = async (unsplash: ReturnType<typeof createApi>, query: string): Promise<UnplashImage> => {
  const defaultImage = {
    alt_description: "No images found",
    urls: { regular: "https://via.placeholder.com/300x400?text=No+images+found" },
  };

  const response = await unsplash.search.getPhotos({ query, page: 1, perPage: 10 });

  if (response.errors || !response.response.results.length) {
    return defaultImage;
  }

  const results = response.response.results;
  const randomIndex = randomInt(0, results.length);
  const photo = results[randomIndex];

  if (!photo) {
    return defaultImage;
  }

  await unsplash.photos.trackDownload({ downloadLocation: photo.links.download_location });

  return {
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
  };
};

const fillTemplate = async (templateSource: string, replacements: Record<string, string>, isHtml = false) => {
  let template = isHtml ? templateSource : await fs.readFile(templateSource, "utf8");

  for (const [key, value] of Object.entries(replacements)) {
    template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  return template;
};

const generateList = (items: string[]): string => items.map((item) => `<li class="list-item">${item}</li>`).join("");

const generateProjectSteps = (details: ProjectDetail[]): string =>
  details
    .map(
      (detail, index) => `
    <div class="subtitle"><strong>${index + 1}. ${detail.title}</strong></div>
    <p class="content">${detail.content}</p>
    <p class="content"><strong>Tips:</strong> ${detail.tips ?? "N/A"}</p>
  `,
    )
    .join("");

export const performMonthlyDiyEmailDistribution = async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, openai: OpenAI, unsplash: ReturnType<typeof createApi>) => {
  try {
    const subscribers = await getEmailSubscription(prisma);

    if (subscribers.length === 0) {
      console.info("No subscribers found.");
      return;
    }
    const existingMonthlyDiyProject = await getExistingMonthlyDiyProject(prisma);
    const monthlyDiyProject = await generateMonthlyDiyProject(openai, existingMonthlyDiyProject);

    if (!monthlyDiyProject) {
      console.info("No monthly DIY project generated.");
      return;
    }

    const unplashImage = await getUnplashImage(unsplash, monthlyDiyProject.title);
    const generatedHtml = await fillTemplate(join(__dirname, "..", "template", "index.html"), {
      header_image: "https://www.diyspire.online/android-chrome-192x192.png",
      header_alt: "DIYspire - diyspire.online logo",
      header_title: "DIYspire",
      welcome_title: monthlyDiyProject.welcome.title,
      welcome_content: monthlyDiyProject.welcome.content,
      project_image: unplashImage.urls.regular,
      project_alt: unplashImage.alt_description ?? "DIY Project Image",
      photographer_url: unplashImage.user?.link ?? "",
      photographer_name: unplashImage.user?.name ?? "",
      project_title: monthlyDiyProject.title,
      project_difficulty: monthlyDiyProject.difficulty,
      project_category: monthlyDiyProject.category,
      project_purpose: monthlyDiyProject.purpose,
      project_materials: generateList(monthlyDiyProject.materials),
      project_tools: generateList(monthlyDiyProject.tools),
      project_time: monthlyDiyProject.time,
      project_budget: monthlyDiyProject.budget,
      project_currency: monthlyDiyProject.currency,
      cta_url: "https://www.diyspire.online/?is_safe=false",
      project_steps: generateProjectSteps(monthlyDiyProject.details),
    });

    const subscriberResults = await PromisePool.for(subscribers)
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
          subject: `DIYspire - ${monthlyDiyProject.title}`,
          text: monthlyDiyProject.fallback,
          html: updatedGeneratedHtml,
          unsubscribeUrl: unsubscribeUrl,
        };
      });

    const emailSendingResults = await PromisePool.for(subscriberResults.results)
      .withConcurrency(20)
      .process(async (emailData) => {
        return await sendEmail(emailData);
      });

    const currentDate = new Date().toLocaleString();

    if (subscriberResults.errors.length || emailSendingResults.errors.length) {
      console.error("[${currentDate}]  Errors occurred during email sending:", subscriberResults.errors.length || emailSendingResults.errors.length);
    }

    await saveGeneratedDiyProject(prisma, monthlyDiyProject.title);

    console.info(`[${currentDate}] ${emailSendingResults.results.length} emails sent successfully.`);
  } catch (error) {
    console.error("Error during monthly DIY project email distribution:", error);
  }
};
