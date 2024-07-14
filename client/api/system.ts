import { ApiResponse, HealthCheckData, HttpMethod } from "@/interfaces";

import { fetchApi } from "@/lib/api-helper";

export const checkBackEndHealthStatus = (): Promise<ApiResponse<HealthCheckData>> => {
  return fetchApi<ApiResponse<HealthCheckData>>(
    "/v1/healthcheck",
    {
      method: HttpMethod.GET,
      timeout: 60000,
    },
    {
      data: {
        uptime: 0,
        responseTime: [],
        message: "Service unavailable",
        timeStamp: Date.now(),
        openaiStatus: {
          name: "OpenAI",
          status: "Outage",
          message: "Service unavailable",
        },
        prismaStatus: {
          name: "Prisma",
          status: "Outage",
          message: "Service unavailable",
        },
        apiStatus: {
          name: "API",
          status: "Outage",
          message: "Service unavailable",
        },
      },
      success: false,
    },
  );
};

export const subscribeToNewsletter = (email: string): Promise<any> => {
  return fetchApi("/v1/email/subscribe", {
    method: HttpMethod.POST,
    body: { email },
  });
};
