import { ApiResponse, GuideData, GuidePathData, GuidePathMetadataData } from "@/interfaces";

import { fetchApi } from "@/lib/api-helper";

export const getGuideByPath = (path: string): Promise<ApiResponse<GuidePathData>> => {
  return fetchApi<ApiResponse<GuidePathData>>(`/v1/guide/${path}`);
};

export const getGuideByPathMetadata = (path: string): Promise<ApiResponse<GuidePathMetadataData>> => {
  return fetchApi<ApiResponse<GuidePathMetadataData>>(`/v1/guide/${path}`, {
    queryParams: { onlyMetadata: "true" },
  });
};

export const getAllGuides = (): Promise<ApiResponse<GuideData[]>> => {
  return fetchApi<ApiResponse<GuideData[]>>("/v1/guide");
};
