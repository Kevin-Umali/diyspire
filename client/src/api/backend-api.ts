import { ProjectLocationState, RelatedImages } from "../types";

const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000/api" : import.meta.env.VITE_OPEN_AI_API_URL;

const fetchApi = async (endpoint: string, method: string = "GET", body?: object) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json();
};

export const generateProjectIdeas = async (
  materials: string[],
  onlySpecified: boolean,
  difficulty: string,
  category: string,
  tools: string[],
  timeValue: number,
  timeUnit: string | null,
  budget: number,
  endPurpose: string,
) => {
  const time = timeValue !== 0 && timeUnit ? `${timeValue} ${timeUnit}` : "";
  return fetchApi("/v1/generate/idea", "POST", { materials, onlySpecified, difficulty, category, tools, time, budget, endPurpose });
};

export const generateProjectExplanations = async (title: string, materials: string[], tools: string[], time: string, budget: string, description: string) => {
  return fetchApi("/v1/generate/explain", "POST", { title, materials, tools, time, budget, description });
};

export const searchImages = async (query: string) => {
  return fetchApi(`/v1/image/search?query=${encodeURIComponent(query)}`);
};

export const getGuideByPath = async (path: string) => {
  return fetchApi(`/v1/guide/${path}`);
};

export const getAllGuides = async () => {
  return fetchApi("/v1/guide");
};

export const saveShareLinkData = async (projectDetails: ProjectLocationState | null, projectImage: RelatedImages | null, explanation: string | null) => {
  return fetchApi("/v1/share", "POST", { projectDetails, projectImage, explanation });
};

export const getShareLinkData = async (id: string) => {
  return fetchApi(`/v1/share/${id}`);
};

export const getTotalCountOfGeneratedIdea = async () => {
  return fetchApi("/v1/counter");
};

export const incrementCounterOfGeneratedIdea = async () => {
  return fetchApi("/v1/counter", "POST");
};
