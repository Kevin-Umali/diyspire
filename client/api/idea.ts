import { CommunityIdeaResponse, CounterResponse, GeneratedIdeaResponse, HttpMethod, IdeaExplanationResponse } from "@/interfaces";

import { fetchApi } from "@/lib/api-helper";

export const generateProjectIdeas = (
  params: {
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
  },
  accessToken: string,
): Promise<GeneratedIdeaResponse> => {
  const time = params.timeValue && params.timeUnit ? `${params.timeValue} ${params.timeUnit}` : "";
  return fetchApi<GeneratedIdeaResponse>("/v1/generate/idea", {
    method: HttpMethod.POST,
    body: { ...params, time },
    accessToken,
  });
};

export const generateProjectExplanations = (
  params: { title: string; materials: string[]; tools: string[]; time: string; budget: string; description: string },
  accessToken: string,
): Promise<IdeaExplanationResponse> => {
  return fetchApi<IdeaExplanationResponse>("/v1/generate/explain", {
    method: HttpMethod.POST,
    body: params,
    accessToken,
  });
};

export const getTotalCountOfGeneratedIdea = (): Promise<CounterResponse> => {
  return fetchApi<CounterResponse>("/v1/counter");
};

export const incrementCounterOfGeneratedIdea = (accessToken: string): Promise<void> => {
  return fetchApi("/v1/counter", { method: HttpMethod.POST, accessToken });
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
