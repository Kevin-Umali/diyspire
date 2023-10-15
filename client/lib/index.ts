import { FetchApiOptions, HttpMethod } from "@/constants";
import {
  ApiError,
  CommunityIdeaResponse,
  CounterResponse,
  GeneratedIdeaResponse,
  GuidePathMetadataResponse,
  GuidePathResponse,
  GuideResponse,
  IdeaExplanationResponse,
  ImageSearchResponse,
  ProjectDetails,
  ProjectImages,
  ShareLinkDataMetadataResponse,
  ShareLinkDataResponse,
  ShareLinkResponse,
} from "@/interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchApi = async <T>(endpoint: string, { method = HttpMethod.GET, body, queryParams }: FetchApiOptions = {}): Promise<T> => {
  try {
    if (!API_URL) {
      throw new Error("API_URL is not configured");
    }

    if (method === HttpMethod.GET && body) {
      throw new Error("GET request should not contain a body.");
    }

    let queryString = "";
    if (queryParams) {
      const params = new URLSearchParams();
      for (const key in queryParams) {
        params.append(key, String(queryParams[key]));
      }
      queryString = `?${params.toString()}`;
    }

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(`${API_URL}${endpoint}${queryString}`, options);

    if (!response.ok) {
      const errorResponse = await response.json();
      const error: ApiError = new Error(errorResponse.error || "An unexpected error occurred. Please try again later.");
      error.statusCode = response.status;
      throw error;
    }

    return await response.json();
  } catch (error: any) {
    console.error("API Error: ", error.message);
    throw error;
  }
};

export const generateProjectIdeas = (params: {
  materials: string[];
  onlySpecified: boolean;
  difficulty: string;
  category: string;
  tools: string[];
  timeValue: number;
  timeUnit: string | null;
  budget: string | number;
  currency: string;
  endPurpose: string;
}): Promise<GeneratedIdeaResponse> => {
  const time = params.timeValue && params.timeUnit ? `${params.timeValue} ${params.timeUnit}` : "";
  return fetchApi<GeneratedIdeaResponse>("/v1/generate/idea", {
    method: HttpMethod.POST,
    body: { ...params, time },
  });
};

export const generateProjectExplanations = (params: { title: string; materials: string[]; tools: string[]; time: string; budget: string; description: string }): Promise<IdeaExplanationResponse> => {
  return fetchApi<IdeaExplanationResponse>("/v1/generate/explain", {
    method: HttpMethod.POST,
    body: params,
  });
};

export const searchImages = (query: string): Promise<ImageSearchResponse> => {
  return fetchApi<ImageSearchResponse>("/v1/image/search", {
    queryParams: { query },
  });
};

export const getGuideByPath = (path: string): Promise<GuidePathResponse> => {
  return fetchApi<GuidePathResponse>(`/v1/guide/${path}`);
};

export const getGuideByPathMetadata = (path: string): Promise<GuidePathMetadataResponse> => {
  return fetchApi<GuidePathMetadataResponse>(`/v1/guide/${path}`, {
    queryParams: { onlyMetadata: "true" },
  });
};

export const getAllGuides = (): Promise<GuideResponse> => {
  return fetchApi<GuideResponse>("/v1/guide");
};

export const saveShareLinkData = (params: { projectDetails: ProjectDetails | null; projectImage: ProjectImages | null; explanation: string | null }): Promise<ShareLinkResponse> => {
  return fetchApi<ShareLinkResponse>("/v1/share", {
    method: HttpMethod.POST,
    body: params,
  });
};

export const getShareLinkData = (id: string): Promise<ShareLinkDataResponse> => {
  return fetchApi<ShareLinkDataResponse>(`/v1/share/${id}`);
};

export const getShareLinkDataMetadata = (id: string): Promise<ShareLinkDataMetadataResponse> => {
  return fetchApi<ShareLinkDataMetadataResponse>(`/v1/share/${id}`, {
    queryParams: { onlyMetadata: "true" },
  });
};

export const getTotalCountOfGeneratedIdea = (): Promise<CounterResponse> => {
  return fetchApi<CounterResponse>("/v1/counter");
};

export const incrementCounterOfGeneratedIdea = (): Promise<void> => {
  return fetchApi("/v1/counter", { method: HttpMethod.POST });
};

export const getCommunityGeneratedIdea = (
  params: {
    limit?: number;
    orderBy?: string;
  } = {},
): Promise<CommunityIdeaResponse> => {
  return fetchApi<CommunityIdeaResponse>("/v1/community", {
    queryParams: params,
  });
};

export const cleanMarkdown = (content: string): string => {
  return content
    .split("\n")
    .map((line) => line.trimStart())
    .join("\n");
};
