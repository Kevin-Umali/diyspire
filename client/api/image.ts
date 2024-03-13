import { ImageSearchResponse } from "@/interfaces";

import { fetchApi } from "@/lib/api-helper";

export const searchImages = (query: string, accessToken: string): Promise<ImageSearchResponse> => {
  return fetchApi<ImageSearchResponse>("/v1/image/search", {
    queryParams: { query },
    accessToken,
  });
};
