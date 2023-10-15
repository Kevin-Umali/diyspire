export interface FAQ {
  id: string;
  question: string;
  answer?: string;
  answerType?: string;
  links?: {
    [key: string]: FAQLinkData;
  };
}

export interface FAQLinkData {
  href: string;
  text: string;
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

export interface Subcategories {
  [key: string]: React.ElementType;
}

export interface Category {
  icon: React.ElementType;
  subcategories: Subcategories;
}

export interface Categories {
  [key: string]: Category;
}

export interface Budget {
  label: string;
  value: string;
}

/* API RESPONSE INTERFACE */

export interface CounterResponse {
  success: boolean;
  data: CounterData;
}

export interface CounterData {
  totalCount: number;
}

export interface ShareLinkDataResponse {
  success: boolean;
  data: ShareLinkData;
}

export interface ShareLinkData {
  id: string;
  projectDetails: ProjectDetails;
  projectImage: ProjectImages;
  explanation: string;
}

export interface ProjectDetails {
  tags: string[];
  time: string;
  title: string;
  tools: any[];
  budget: string;
  materials: string[];
  description: string;
}

export interface ProjectImages {
  id: string;
  urls: ProjectImageUrls;
  user: ProjectImageUsers;
  color: string;
  links: ProjectImageLinks;
  width: number;
  height: number;
  alt_description: string;
}

export interface ProjectImageLinks {
  html: string;
  self: string;
  download: string;
  download_location: string;
}

export interface ProjectImageUrls {
  raw: string;
  full: string;
  small: string;
  thumb: string;
  regular: string;
  small_s3: string;
}

export interface ProjectImageUsers {
  link: string;
  name: string;
  username: string;
}

export interface ShareLinkDataMetadataResponse {
  success: boolean;
  data: ProjectDetailsMetadata;
}

export type ProjectDetailsMetadata = Pick<ProjectDetails, "title" | "tags" | "description">;

export interface GuideResponse {
  success: boolean;
  data: GuideData[];
}

export interface GuideData {
  path: string;
  metadata: GuideMetadata;
}

export interface GuideMetadata {
  title: string;
}

export interface GuidePathResponse {
  success: boolean;
  data: GuidePathData;
}

export interface GuidePathData {
  id: number;
  path: string;
  metadataId: number;
  content: string;
  metadata: GuidePathMetadata;
}

export interface GuidePathMetadata {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
}

export interface GuidePathMetadataResponse {
  success: boolean;
  data: GuidePathMetadataData;
}

export interface GuidePathMetadataData {
  path: string;
  metadata: GuidePathMetadata;
}

export interface GeneratedIdeaResponse {
  success: boolean;
  data: GeneratedIdeaData;
}

export interface GeneratedIdeaData {
  ideas: GeneratedIdea[];
}

export interface GeneratedIdea {
  title: string;
  materials: string[];
  tools: string[];
  time: string;
  budget: string;
  tags: string[];
  description: string;
}

export interface ImageSearchResponse {
  success: boolean;
  data: ImageSearchData;
}

export type ImageSearchData = ProjectImages;

export interface IdeaExplanationResponse {
  success: boolean;
  data: IdeaExplanationData;
}

export interface IdeaExplanationData {
  explanation: string;
}

export interface ShareLinkResponse {
  success: boolean;
  data: ShareLinkResponseData;
}

export interface ShareLinkResponseData {
  id: string;
}

export interface CommunityIdeaResponse {
  success: boolean;
  data: CommunityIdeaData[];
}

export interface CommunityIdeaData {
  id: number;
  title: string;
  description: string;
  tags: string[];
  projectImage: CommunityIdeaProjectImages;
  createdAt: string;
}

export interface CommunityIdeaProjectImages {
  urls: ProjectImageUrls;
  alt_description?: string;
}

export interface ApiError extends Error {
  statusCode?: number;
}
