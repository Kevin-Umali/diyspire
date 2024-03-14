import { ApiResponse, HttpMethod, ProjectDetails, ProjectDetailsMetadata, ProjectImages, ShareLinkData, ShareLinkResponseData } from "@/interfaces";

import { fetchApi } from "@/lib/api-helper";

export const saveShareLinkData = ({
  params,
  accessToken,
}: {
  params: { projectDetails?: ProjectDetails | null; projectImage?: ProjectImages | null; explanation?: string | null };
  accessToken: string;
}): Promise<ApiResponse<ShareLinkResponseData>> => {
  return fetchApi<ApiResponse<ShareLinkResponseData>>("/v1/share", {
    method: HttpMethod.POST,
    body: params,
    accessToken,
  });
};

export const getShareLinkData = (id: string): Promise<ApiResponse<ShareLinkData>> => {
  return fetchApi<ApiResponse<ShareLinkData>>(`/v1/share/${id}`);
};

export const getShareLinkDataMetadata = (id: string): Promise<ApiResponse<ProjectDetailsMetadata>> => {
  return fetchApi<ApiResponse<ProjectDetailsMetadata>>(`/v1/share/${id}`, {
    queryParams: { onlyMetadata: "true" },
  });
};
