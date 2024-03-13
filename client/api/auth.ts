import { HttpMethod } from "@/interfaces";

import { fetchApi } from "@/lib/api-helper";

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
