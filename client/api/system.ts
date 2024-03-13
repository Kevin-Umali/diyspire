import { HealthCheckResponse, HttpMethod } from "@/interfaces";

import { fetchApi } from "@/lib/api-helper";

export const checkBackEndHealthStatus = (): Promise<HealthCheckResponse> => {
  return fetchApi("/v1/healthcheck", {
    method: HttpMethod.GET,
  });
};

export const subscribeToNewsletter = (email: string): Promise<any> => {
  return fetchApi("/v1/email/subscribe", {
    method: HttpMethod.POST,
    body: { email },
  });
};
