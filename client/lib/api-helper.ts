import { FetchApiOptions, HttpMethod } from "@/interfaces";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

import { serializeParams } from ".";

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

export const fetchApi = async <T>(endpoint: string, options: FetchApiOptions = {}, defaultResponse?: T): Promise<T> => {
  const { method = HttpMethod.GET, body, queryParams, accessToken, signal } = options;

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
      paramsSerializer: (params) => serializeParams(params),
      data: body,
      headers: headers,
      signal: signal,
      ...options,
    });

    return response.data;
  } catch (error: any) {
    console.error("API Error: ", error.message);

    if (defaultResponse !== undefined) {
      return defaultResponse;
    } else {
      throw error;
    }
  }
};
