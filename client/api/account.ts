import { AccountSettingsData, ApiResponse, HttpMethod } from "@/interfaces";

import { fetchApi } from "@/lib/api-helper";

export const getAccountSettings = (accessToken: string): Promise<ApiResponse<AccountSettingsData>> => {
  return fetchApi<ApiResponse<AccountSettingsData>>("/v1/account", {
    accessToken,
  });
};

export const saveAccountSettings = ({
  params,
  accessToken,
}: {
  params: {
    username: string;
    email?: string;
    fullName?: string;
    newsletter: boolean;
    updates: boolean;
    currentPassword?: string;
    newPassword?: string;
  };
  accessToken: string;
}): Promise<ApiResponse<unknown>> => {
  return fetchApi<ApiResponse<unknown>>("/v1/account", {
    method: HttpMethod.POST,
    body: params,
    accessToken,
  });
};
