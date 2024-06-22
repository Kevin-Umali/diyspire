import { ApiResponse, CommunityProjectData, CommunityProjectSlugData, CounterData, GeneratedIdeaData, HttpMethod, IdeaExplanationData, ProjectData, ProjectDetailsMetadata } from "@/interfaces";

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

export const getCommunityGeneratedProjectData = async <T extends { page?: number; limit?: number; sortBy?: string; onlySlug?: boolean }>(
  params: T,
): Promise<ApiResponse<T["onlySlug"] extends true ? CommunityProjectSlugData : CommunityProjectData>> => {
  try {
    return await fetchApi<ApiResponse<T["onlySlug"] extends true ? CommunityProjectSlugData : CommunityProjectData>>("/v1/community", {
      queryParams: params,
      timeout: 60000,
    });
  } catch (error) {
    if (params.onlySlug) {
      const defaultResponse: ApiResponse<CommunityProjectSlugData> = {
        data: {
          projects: [{ slug: "default-slug" }],
          totalCount: 1,
        },
        success: false,
      };
      return defaultResponse as ApiResponse<T["onlySlug"] extends true ? CommunityProjectSlugData : CommunityProjectData>;
    } else {
      throw error;
    }
  }
};

export const getProjectDataBySlug = (slug: string): Promise<ApiResponse<ProjectData>> => {
  return fetchApi<ApiResponse<ProjectData>>(`/v1/community/${slug}`);
};

export const getProjectDataBySlugMetadata = (slug: string): Promise<ApiResponse<ProjectDetailsMetadata>> => {
  return fetchApi<ApiResponse<ProjectDetailsMetadata>>(`/v1/community/${slug}`, {
    queryParams: { onlyMetadata: "true" },
  });
};
