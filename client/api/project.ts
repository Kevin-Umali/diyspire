import { ApiResponse, HttpMethod, ProjectByAccountIdData, ProjectData, ProjectDetails, ProjectDetailsMetadata, ProjectImages, SaveProjectResponseData } from "@/interfaces";

import { fetchApi } from "@/lib/api-helper";

export const saveProjectData = ({
  params,
  accessToken,
}: {
  params: { projectDetails?: ProjectDetails | null; projectImage?: ProjectImages | null; explanation?: string | null };
  accessToken: string;
}): Promise<ApiResponse<SaveProjectResponseData>> => {
  return fetchApi<ApiResponse<SaveProjectResponseData>>("/v1/project", {
    method: HttpMethod.POST,
    body: params,
    accessToken,
  });
};

export const getProjectDataById = (id: string): Promise<ApiResponse<ProjectData>> => {
  return fetchApi<ApiResponse<ProjectData>>(`/v1/project/${id}`);
};

export const getProjectDataByIdMetadata = (id: string): Promise<ApiResponse<ProjectDetailsMetadata>> => {
  return fetchApi<ApiResponse<ProjectDetailsMetadata>>(`/v1/project/${id}`, {
    queryParams: { onlyMetadata: "true" },
  });
};

export const getProjectByAccountId = (
  accessToken: string,
  params: { page?: number; limit?: number; sortBy?: string; orderBy?: string; search?: string; filter?: string[] },
): Promise<ApiResponse<ProjectByAccountIdData>> => {
  return fetchApi<ApiResponse<ProjectByAccountIdData>>("/v1/project", {
    queryParams: params,
    accessToken,
  });
};
