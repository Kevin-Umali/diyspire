export interface FAQ {
  id: string;
  question: string;
  answer?: string;
  answerType?: string;
}

export interface StepContent {
  type: "text" | "image" | "gif" | "video";
  content: string;
  src?: string; // Used for images, gifs, and videos
  alt?: string; // Used for image and gif alt text
}

export interface GuideSection {
  type: "paragraph" | "image" | "subheading" | "steps" | "video";
  content: string | StepContent[];
  src?: string;
  alt?: string;
}

export interface HowToGuide {
  title: string;
  intro: string;
  body: GuideSection[];
  buttonURL?: string; // Optional URL for the button
}

export interface Footer {
  label: string;
  href: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface Steps {
  title: string;
  description: string;
}

export type Operation = "code-updates" | "bug-fixes" | "feature-additions" | "performance-enhancements" | "documentation" | "security-updates" | "ui-ux-improvements";

export interface Commit {
  date: string;
  summary: string;
  operations: Operation[]; // This ensures only allowed operation types are used.
}
