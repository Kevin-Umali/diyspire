import { HttpMethod, ProjectDetails, ProjectImages, ShareLinkDataMetadataResponse, ShareLinkDataResponse, ShareLinkResponse } from "@/interfaces";

import { fetchApi } from "@/lib/api-helper";

export const saveShareLinkData = (
  params: { projectDetails: ProjectDetails | null; projectImage: ProjectImages | null; explanation: string | null },
  accessToken: string,
): Promise<ShareLinkResponse> => {
  return fetchApi<ShareLinkResponse>("/v1/share", {
    method: HttpMethod.POST,
    body: params,
    accessToken,
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
