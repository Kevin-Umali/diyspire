import { FetchApiOptions, HttpMethod } from "@/constants";
import {
  CommunityIdeaResponse,
  CounterResponse,
  GeneratedIdeaResponse,
  GuidePathMetadataResponse,
  GuidePathResponse,
  GuideResponse,
  HealthCheckResponse,
  IdeaExplanationResponse,
  ImageSearchResponse,
  ProjectDetails,
  ProjectImages,
  ShareLinkDataMetadataResponse,
  ShareLinkDataResponse,
  ShareLinkResponse,
} from "@/interfaces";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

interface ErrorResponse {
  message?: string;
  error?: string;
  errors?: {
    [key: string]: any;
  };
}

api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(error);
    }

    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config;
    const errorMessage = (error.response?.data as ErrorResponse)?.error;

    if (error.response?.status === 403 && errorMessage === "Access Token Expired" && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshTokenResponse = await api.post(
        "/v1/auth/refresh",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (refreshTokenResponse.status === 200 && refreshTokenResponse.data?.data?.accessToken) {
        originalRequest.headers = originalRequest.headers ?? { "Content-Type": "application/json" };

        const newAccessToken = refreshTokenResponse.data.data.accessToken;

        api.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api.request(originalRequest);
      }

      return Promise.reject(new Error("Session expired. Please login again."));
    }

    return Promise.reject(error);
  },
);

const fetchApi = async <T>(endpoint: string, options: FetchApiOptions = {}): Promise<T> => {
  const { method = HttpMethod.GET, body, queryParams, accessToken } = options;

  if (method === HttpMethod.GET && body) {
    throw new Error("GET request should not contain a body.");
  }

  const headers: { [key: string]: string } = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const response = await api({
      url: endpoint,
      method: method,
      params: queryParams,
      data: body,
      headers: headers,
    });

    return response.data;
  } catch (error: any) {
    console.error("API Error: ", error.message);
    throw error;
  }
};

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

export const searchImages = (query: string, accessToken: string): Promise<ImageSearchResponse> => {
  return fetchApi<ImageSearchResponse>("/v1/image/search", {
    queryParams: { query },
    accessToken,
  });
};

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

export const registerUser = (userData: { signupUsername: string; signupPassword: string }): Promise<any> => {
  return fetchApi("/v1/auth/register", {
    method: HttpMethod.POST,
    body: { username: userData.signupUsername, password: userData.signupPassword },
  });
};

export const loginUser = (credentials: { username: string; password: string }): Promise<any> => {
  return fetchApi("/v1/auth/login", {
    method: HttpMethod.POST,
    body: credentials,
  });
};

export const logoutUser = (accessToken: string): Promise<void> => {
  return fetchApi("/v1/auth/logout", {
    method: HttpMethod.POST,
    accessToken,
  });
};

export const refreshToken = (): Promise<any> => {
  return fetchApi("/v1/auth/refresh", {
    method: HttpMethod.POST,
  });
};

export const checkBackEndHealthStatus = (): Promise<HealthCheckResponse> => {
  return fetchApi("/v1/healthcheck", {
    method: HttpMethod.GET,
  });
};
