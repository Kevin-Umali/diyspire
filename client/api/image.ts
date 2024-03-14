import { ApiResponse, ImageSearchData } from "@/interfaces";

import { fetchApi } from "@/lib/api-helper";

export const searchImages = (query: string, accessToken: string): Promise<ApiResponse<ImageSearchData>> => {
  return fetchApi<ApiResponse<ImageSearchData>>("/v1/image/search", {
    queryParams: { query },
    accessToken,
  });
};
