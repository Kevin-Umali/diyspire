import { GuidePathMetadataResponse, GuidePathResponse, GuideResponse } from "@/interfaces";

import { fetchApi } from "@/lib/api-helper";

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
