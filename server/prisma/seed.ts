import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const howToGuideData: Prisma.HowToGuideCreateInput[] = [
  {
    path: "how-to-use-the-makmediyspire-diy-idea-generator",
    content: `
    # How to use the MakeMeDIYspire DIY Idea Generator

    Master the basics of the MakeMeDIYspire platform with this comprehensive guide. Learn how to utilize the DIY Idea Generator for your creative projects.
    
    ### Getting Started
    
    1. Go to the MakeMeDIYspire home or root page
       ![MakeMeDIYspire homepage](https://gxzbitundyxasssqfgde.supabase.co/storage/v1/object/public/makemediyspire-bucket/homepage.jpg)
    2. Input the materials you have at hand in the input box or leave it as empty to use random materials
       ![Input process](https://gxzbitundyxasssqfgde.supabase.co/storage/v1/object/public/makemediyspire-bucket/input-process.gif)
    3. Select difficulty and category
       ![Selecting difficulty and category](https://gxzbitundyxasssqfgde.supabase.co/storage/v1/object/public/makemediyspire-bucket/difficulty-category-process.gif)
    4. If you are already done, click the safety checkbox
       ![Marking the safety checkbox](https://gxzbitundyxasssqfgde.supabase.co/storage/v1/object/public/makemediyspire-bucket/safety-check.gif)
    5. Click the 'Next' or 'Generate' button to receive a list of possible DIY projects
    6. It will proceed to the next step to generate project ideas
       ![Loading generator](https://gxzbitundyxasssqfgde.supabase.co/storage/v1/object/public/makemediyspire-bucket/generate-loading.gif)
    7. After generation, it will proceed to the next step where you can view the generated 3 DIY projects
       ![Generated DIY projects](https://gxzbitundyxasssqfgde.supabase.co/storage/v1/object/public/makemediyspire-bucket/generated-projects.jpg)
    
    ### Tips and Tricks
    
    - Ensure that you input accurate materials to get more relevant results. The more precise you are, the better your suggestions will be.
    - If you're looking for a challenge, select a higher difficulty and see what complex projects you can create!
    - Don't forget to explore the various categories available, as they can guide the generator towards projects that truly interest you.
    
    ### Troubleshooting
    
    If the generator isn't working as expected, ensure you've selected all necessary options. If issues persist, contact support for assistance.`.trim(),
    metadata: {
      create: {
        title: "How to use the MakeMeDIYspire DIY Idea Generator",
        description:
          "A comprehensive guide on how to effectively use the MakeMeDIYspire DIY Idea Generator to spark your creativity and come up with innovative DIY projects.",
        imageUrl: null,
      },
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const guide of howToGuideData) {
    const howTo = await prisma.howToGuide.create({
      data: guide,
    });
    console.log(`Created guide with id: ${howTo.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
