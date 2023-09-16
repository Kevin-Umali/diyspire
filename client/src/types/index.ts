export interface FAQ {
  id: string;
  question: string;
  answer?: string;
  answerType?: string;
}

export interface Footer {
  label: string;
  path?: string;
  hash?: string;
  href?: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  path?: string;
  hash?: string;
  href?: string;
}

export interface Steps {
  title: string;
  description: string;
}

export type Operation = "code-updates" | "bug-fixes" | "feature-additions" | "performance-enhancements" | "documentation" | "security-updates" | "ui-ux-improvements";

export interface Commit {
  date: string;
  summary: string;
  operations: Operation[];
}

export interface HowToGuide {
  id: number;
  path: string;
  metadataId: number;
  content: string;
  metadata: Metadata;
}

export interface Metadata {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
}
