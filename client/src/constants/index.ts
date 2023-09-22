import { Commit, FAQ, Footer, Steps } from "../types";

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
      { label: "How-to Guides", path: "/guide" },
    ],
  },
  {
    label: "FAQ",
    path: "/faq",
    hash: "#getting-started",
    links: [
      { label: "Getting Started", path: "/faq", hash: "#getting-started" },
      { label: "Usage Guidelines", path: "/faq", hash: "#usage-guidelines" },
      {
        label: "Security and Privacy",
        path: "/faq",
        hash: "#security-privacy",
      },
      { label: "Feedback and Suggestions", path: "/faq", hash: "#feedback" },
    ],
  },
  {
    label: "Social",
    hash: "#",
    links: [
      { label: "Email", href: "https://mail.google.com/" },
      { label: "Twitter", href: "https://twitter.com/" },
      { label: "Linkedin", href: "https://www.linkedin.com/" },
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
