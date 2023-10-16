import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const howToGuideData: Prisma.HowToGuideCreateInput[] = [
  {
    path: "how-to-use-the-makmediyspire-diy-idea-generator",
    content: `
    # **How to use the MakeMeDIYspire DIY Idea Generator**

    Unlock the potential of the MakeMeDIYspire platform with this step-by-step guide. Familiarize yourself with the features and functionalities of the DIY Idea Generator to bring your creative ideas to life.

    ---

    ## **Getting Started**

    Follow these simple steps to begin:

    1. **Access the Platform**
      - Navigate to the MakeMeDIYspire homepage.
        ![MakeMeDIYspire homepage](https://gxzbitundyxasssqfgde.supabase.co/storage/v1/object/public/makemediyspire-bucket/homepage.jpg)
    2. **Material Input**
      - Enter the materials you currently have into the provided input box. If unsure or looking for inspiration, leave it blank to generate ideas using random materials.
        ![Input process](https://gxzbitundyxasssqfgde.supabase.co/storage/v1/object/public/makemediyspire-bucket/input-process.gif)
    3. **Choose Difficulty & Category**
      - Personalize your experience by selecting your desired difficulty level and project category.
        ![Selecting difficulty and category](https://gxzbitundyxasssqfgde.supabase.co/storage/v1/object/public/makemediyspire-bucket/difficulty-category-process.gif)
    4. **Safety First**
      - Before proceeding, ensure you've clicked on the safety checkbox.
        ![Marking the safety checkbox](https://gxzbitundyxasssqfgde.supabase.co/storage/v1/object/public/makemediyspire-bucket/safety-check.gif)
    5. **Generate Ideas**
      - Click the 'Next' or 'Generate' button. The platform will then present you with potential DIY projects tailored to your selections.
        ![Loading generator](https://gxzbitundyxasssqfgde.supabase.co/storage/v1/object/public/makemediyspire-bucket/generate-loading.gif)
    6. **Explore Your DIY Options**
      - Dive into the three DIY projects specially curated for you (Look at the sample generated diy project idea below).
        ![Generated DIY projects](https://gxzbitundyxasssqfgde.supabase.co/storage/v1/object/public/makemediyspire-bucket/generated-projects.jpg)

    ---

    ## **Tips and Tricks**

    - **Precision is Key**: The more accurately you list your materials, the more tailored your project suggestions will be.
    - **Seek Challenge**: Elevate your DIY skills by opting for projects with a higher difficulty level.
    - **Broaden Your Horizons**: Explore various categories to discover projects you might not have considered before.

    ---

    ## **Troubleshooting**

    Encountering a hiccup? No worries:

    - Ensure all selections and inputs are correctly filled.
    - If the generator seems unresponsive or produces unexpected results, double-check your entered details.
    - For persistent issues, don't hesitate to [contact support](mailto:support@makemediyspire.com) for guidance.

    ## **Ready to go further?**

    Explore more features and customize your DIY experience with our [Advanced Guide to Mastering the MakeMeDIYspire Options](/guide/mastering-advanced-options-of-makemediyspire).

    ---

    Happy DIY-ing with MakeMeDIYspire!
    `.trim(),
    metadata: {
      create: {
        title: "How to use the MakeMeDIYspire DIY Idea Generator",
        description: "A comprehensive guide on how to effectively use the MakeMeDIYspire DIY Idea Generator to spark your creativity and come up with innovative DIY projects.",
        imageUrl: null,
      },
    },
  },
  {
    path: "mastering-advanced-options-of-makemediyspire",
    content: `
    # **Mastering the Advanced Options of the MakeMeDIYspire DIY Idea Generator**

    Welcome to the advanced guide for the MakeMeDIYspire DIY Idea Generator! If you're new to the MakeMeDIYspire platform or need a refresher on the basics, we recommend starting with our [Basic Guide to Using the MakeMeDIYspire DIY Idea Generator](/guide/how-to-use-the-makmediyspire-diy-idea-generator).

    ---

    ## **Table of Contents**

    - [Understanding the Advanced Options](#understanding)
    - [Setting Your Available Time](#time)
    - [Budgeting Your DIY Project](#budget)
    - [Listing Your Available Tools](#tools)
    - [Defining the End Purpose of Your Project](#purpose)
    - [Benefits of Using Advanced Options](#benefits)

    ---

    ### **Understanding the Advanced Options** <a name="understanding"></a>

    Delve deep into the nuances of the advanced features tailored to enhance your DIY experience.

    ---

    ### **Setting Your Available Time** <a name="time"></a>

    #### How to:

    - Navigate to the "Available Time" section.
    - Input the hours or days you're willing to invest in a DIY project.

    #### Benefits:

    - Ensure projects match your time constraints.
    - Customize projects for short engagements or extensive DIY weekends.

    ---

    ### **Budgeting Your DIY Project** <a name="budget"></a>

    #### How to:

    - Head to the "Budget" section.
    - State the amount you're looking to spend on a DIY project.

    #### Benefits:

    - Tailor projects to your financial comfort zone.
    - Maintain control over your DIY expenses.

    ---

    ### **Listing Your Available Tools** <a name="tools"></a>

    #### How to:

    - Proceed to the "Tools" section.
    - Highlight or select the tools you currently possess.

    #### Benefits:

    - Get projects that use tools you're familiar with.
    - Maximize the use of your existing toolkit.

    ---

    ### **Defining the End Purpose of Your Project** <a name="purpose"></a>

    #### How to:

    - Go to the "End Purpose" section.
    - Choose from:
      - Gift
      - Personal use
      - Other (specify if needed)

    #### Benefits:

    - Align projects with their intended use.
    - Enhance the sentiment behind gifts or create projects that cater to your personal needs.

    ---

    ### **Benefits of Using Advanced Options** <a name="benefits"></a>

    #### Personalization:

    - Dive into DIY projects curated for you.

    #### Efficiency:

    - Align projects with your current circumstances for a streamlined experience.

    #### Satisfaction:

    - Relish in projects that resonate with your preferences and resources.

    ---

    ## **Conclusion**

    With the MakeMeDIYspire DIY Idea Generator's advanced options, you're not just accessing features – you're unlocking a DIY realm tailored just for you. Dive in and let your creativity flourish!

    ---

    Happy Advanced DIY-ing with MakeMeDIYspire!
    `.trim(),
    metadata: {
      create: {
        title: "Mastering the Advanced Options of the MakeMeDIYspire DIY Idea Generator",
        description:
          "Dive deep into the advanced functionalities of the MakeMeDIYspire DIY Idea Generator. Personalize your experience, streamline your project selection, and ensure every DIY idea aligns with your preferences.",
        imageUrl: null,
      },
    },
  },
];

async function main() {
  console.debug(`Start seeding ...`);
  for (const guide of howToGuideData) {
    const howTo = await prisma.howToGuide.create({
      data: guide,
    });
    console.debug(`Created guide with id: ${howTo.id}`);
  }
  console.debug(`Seeding finished.`);
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
