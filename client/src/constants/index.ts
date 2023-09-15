import { Commit, FAQ, Footer, HowToGuide, Steps } from "../types";

export const categories: string[] = [
  "Anything",
  "Home Decor",
  "Fashion",
  "Garden Projects",
  "Kids Crafts",
  "Jewelry Making",
  "Woodworking",
  "Paper Crafts",
  "Pottery & Clay Projects",
  "Textile & Sewing",
  "Upcycling",
  "Holiday Crafts",
  "Tech DIYs",
  "Beauty & Personal Care",
  "Outdoor Projects",
  "Kitchen Crafts",
  "Pet Crafts",
  "Furniture Makeovers",
  "Art Projects",
  "Photography DIYs",
  "Musical Instruments",
  "Car & Mechanical Crafts",
  "Eco-friendly Crafts",
  "Baking & Food Crafts",
  "Travel & Adventure DIYs",
];

export const steps: Steps[] = [
  { title: "Materials", description: "List your available materials" },
  { title: "Generate", description: "Create project ideas" },
  { title: "View", description: "See the generated projects" },
];

export const loadingMessages: string[] = ["Generating project ideas...", "Brewing some creativity...", "Almost there, hang tight...", "Fetching some inspiration..."];

export const footerData: Footer[] = [
  {
    label: "Explore",
    hash: "#",
    links: [
      { label: "Generate DIY Project Idea", path: "/" },
      { label: "How-to Guides", path: "/how-to-guide" },
    ],
  },
  {
    label: "FAQ",
    path: "/faq",
    hash: "#getting-started",
    links: [
      { label: "Getting Started", path: "/faq", hash: "#getting-started" },
      { label: "Usage Guidelines", path: "/faq", hash: "#usage-guidelines" },
      { label: "Security and Privacy", path: "/faq", hash: "#security-privacy" },
      { label: "Feedback and Suggestions", path: "/faq", hash: "#feedback" },
    ],
  },
  {
    label: "Social",
    hash: "#",
    links: [
      { label: "Email", href: "https://react-icons.github.io/react-icons/search?q=ellip" },
      { label: "Twitter", href: "#" },
      { label: "Linkedin", href: "#" },
    ],
  },
];

export const faqs: FAQ[] = [
  {
    id: "getting-started",
    question: "Getting Started",
    answerType: "startedWithLink",
  },
  {
    id: "makemediyspire",
    question: "What is MakeMeDIYspire?",
    answer:
      "MakeMeDIYspire is a revolutionary platform powered by OpenAI. It provides unique DIY (Do It Yourself) project suggestions tailored for enthusiasts of all levels. Our platform not only offers project ideas but also outlines the materials required and the steps to bring these projects to life. Whether you're a seasoned DIYer or just starting, MakeMeDIYspire has something for you!",
  },
  {
    id: "how",
    question: "How does MakeMeDIYspire work?",
    answerType: "howWithLink",
  },
  {
    id: "usage-guidelines",
    question: "Usage Guidelines",
    answer: "MakeMeDIYspire is entirely free to use. Dive in, explore the multitude of ideas, and get started on your DIY journey!",
  },
  {
    id: "security-privacy",
    question: "Security and Privacy",
    answer:
      "MakeMeDIYspire is a platform solely designed to generate DIY project ideas. We don't store or collect any personal information from our users. Just visit, generate ideas, and rest assured about your online privacy.",
  },
  {
    id: "feedback",
    question: "How can I give feedback or suggestions?",
    answerType: "feedbackWithLink",
  },
];

export const guides: HowToGuide[] = [
  {
    title: "How to use the MakeMeDIYspire DIY Idea Generator",
    intro: "Master the basics of the MakeMeDIYspire platform with this comprehensive guide. Learn how to utilize the DIY Idea Generator for your creative projects.",
    body: [
      {
        type: "subheading",
        content: "Getting Started",
      },
      {
        type: "steps",
        content: [
          {
            type: "text",
            content: "Go to the MakeMeDIYspire home or root page",
          },
          {
            type: "image",
            content: "",
            src: "/image/guide/homepage.jpg",
            alt: "MakeMeDIYspire homepage",
          },
          {
            type: "text",
            content: "Input the materials you have at hand in the input box or leave it as empty to use random materials",
          },
          {
            type: "gif",
            content: "",
            src: "/image/guide/input-process.gif",
            alt: "Input process",
          },
          {
            type: "text",
            content: "Select difficulty and category",
          },
          {
            type: "image",
            content: "",
            src: "/image/guide/difficulty-category-process.gif",
            alt: "Selecting difficulty and category",
          },
          {
            type: "text",
            content: "If you are already done, click the safety checkbox",
          },
          {
            type: "image",
            content: "",
            src: "/image/guide/safety-check.gif",
            alt: "Marking the safety checkbox",
          },
          {
            type: "text",
            content: "Click the 'Next' or 'Generate' button to receive a list of possible DIY projects",
          },
          {
            type: "text",
            content: "It will proceed to the next step to generate project ideas",
          },
          {
            type: "gif",
            content: "",
            src: "/image/guide/generate-loading.gif",
            alt: "Loading generator",
          },
          {
            type: "text",
            content: "After generation, it will proceed to the next step where you can view the generated 3 DIY projects",
          },
          {
            type: "image",
            content: "",
            src: "/image/guide/generated-projects.jpg",
            alt: "Generated DIY projects",
          },
        ],
      },
      {
        type: "subheading",
        content: "Tips and Tricks",
      },
      {
        type: "paragraph",
        content: "Ensure that you input accurate materials to get more relevant results. The more precise you are, the better your suggestions will be.",
      },
      {
        type: "paragraph",
        content: "If you're looking for a challenge, select a higher difficulty and see what complex projects you can create!",
      },
      {
        type: "paragraph",
        content: "Don't forget to explore the various categories available, as they can guide the generator towards projects that truly interest you.",
      },
      {
        type: "subheading",
        content: "Troubleshooting",
      },
      {
        type: "paragraph",
        content: "If the generator isn't working as expected, ensure you've selected all necessary options. If issues persist, contact support for assistance.",
      },
    ],
  },
];

export const commits: Record<string, Commit[]> = {
  "2023": [
    {
      date: "Sep 14, 2023",
      summary:
        "On Sep 14, 2023, multiple important changes and optimizations were made to the project. These changes included removing the 'robots.txt' file and updating the routing code, optimizing the build process through manual chunking, removing metadata for robots, and optimizing the home page. Additionally, there was a fix for the SEO score in Lighthouse. The most significant improvement involved enhancing SEO, adding FAQ and How-to guides, and improving the project's overall structure.",
      operations: ["code-updates", "performance-enhancements", "code-updates", "bug-fixes", "ui-ux-improvements"],
    },
    {
      date: "Sep 13, 2023",
      summary:
        "On Sep 13, 2023, multiple enhancements were made. Origin whitelisting, fine-tuning, meta data updates, and user experience improvements took place. The backend underwent an API URL correction, removed a package-lock, and addressed deployment issues. Concurrency improvements were also made. The overall design was updated with new headers and footers.",
      operations: ["code-updates", "bug-fixes", "ui-ux-improvements", "performance-enhancements"],
    },
    {
      date: "Sep 12, 2023",
      summary: "On Sep 12, 2023, foundational setup took place with the creation of README and environment configuration files.",
      operations: ["documentation"],
    },
  ],
};
