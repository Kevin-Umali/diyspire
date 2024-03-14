import { ApiResponse, CommunityIdeaData, CounterData, GeneratedIdeaData, HttpMethod, IdeaExplanationData } from "@/interfaces";

import { fetchApi } from "@/lib/api-helper";

export const generateProjectIdeas = ({
  params,
  accessToken,
}: {
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
  };
  accessToken: string;
}): Promise<ApiResponse<GeneratedIdeaData>> => {
  const time = params.timeValue && params.timeUnit ? `${params.timeValue} ${params.timeUnit}` : "";
  return fetchApi<ApiResponse<GeneratedIdeaData>>("/v1/generate/idea", {
    method: HttpMethod.POST,
    body: { ...params, time },
    accessToken,
  });
};

export const generateProjectExplanations = ({
  params,
  accessToken,
}: {
  params: { title: string; materials: string[]; tools: string[]; time: string; budget: string; description: string };
  accessToken: string;
}): Promise<ApiResponse<IdeaExplanationData>> => {
  return fetchApi<ApiResponse<IdeaExplanationData>>("/v1/generate/explain", {
    method: HttpMethod.POST,
    body: params,
    accessToken,
  });
};

export const getTotalCountOfGeneratedIdea = (): Promise<ApiResponse<CounterData>> => {
  return fetchApi<ApiResponse<CounterData>>("/v1/counter");
};

export const incrementCounterOfGeneratedIdea = (accessToken: string): Promise<void> => {
  return fetchApi("/v1/counter", { method: HttpMethod.POST, accessToken });
};

export const getCommunityGeneratedIdea = (
  params: {
    limit?: number;
    orderBy?: string;
  } = {},
): Promise<ApiResponse<CommunityIdeaData[]>> => {
  return fetchApi<ApiResponse<CommunityIdeaData[]>>("/v1/community", {
    queryParams: params,
  });
};
