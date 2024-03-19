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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface CounterData {
  totalCount: number;
}

export interface ProjectData {
  id: string;
  projectDetails: ProjectDetails;
  projectImage: ProjectImages;
  explanation: string;
}

export interface ProjectDetails {
  tags: string[];
  time: string;
  title: string;
  tools: string[];
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

export type ProjectDetailsMetadata = Pick<ProjectDetails, "title" | "tags" | "description">;

export interface GuideData {
  path: string;
  metadata: GuideMetadata;
}

export interface GuideMetadata {
  title: string;
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

export interface GuidePathMetadataData {
  path: string;
  metadata: GuidePathMetadata;
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

export type ImageSearchData = ProjectImages;

export interface IdeaExplanationData {
  explanation: string;
}

export interface SaveProjectResponseData {
  id: string;
  slug: string;
}

export interface CommunityProjectData {
  projects: CommunityProjects[];
  totalCount: number;
}

export interface CommunityProjects {
  id: number;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  projectImage: CommunityProjectImages;
  createdAt: string;
}

export interface CommunityProjectImages {
  urls: ProjectImageUrls;
  alt_description?: string;
}

type StatusType = "Normal" | "Maintenance" | "Outage";

export interface ServiceStatusProps {
  serviceName: string;
  status: StatusType;
}

export interface HealthCheckData {
  uptime: number;
  responseTime: number[];
  message: string;
  timeStamp: number;
  openaiStatus: HealthCheckStatus;
  prismaStatus: HealthCheckStatus;
  apiStatus: HealthCheckStatus;
}

export interface HealthCheckStatus {
  name: string;
  status: ServiceStatusType;
  message: string;
}

export type ServiceStatusType = "Normal" | "Maintenance" | "Outage";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export type FetchApiOptions = {
  method?: HttpMethod;
  body?: object;
  queryParams?: Record<string, string | number | boolean>;
  accessToken?: string;
};
