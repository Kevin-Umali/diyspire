import { Response } from "express";

interface BaseResponse {
  success: boolean;
}

interface SuccessData<T> {
  data?: T;
}

type ErrorData = { error: string | object };

type CombinedResponse<T> = T extends { success: true } ? SuccessData<T> : ErrorData;

interface ResponseOptions {
  headers?: Record<string, string>;
}

const sendResponse = <T extends BaseResponse>(res: Response, response: T, status: number = response.success ? 200 : 500, options?: ResponseOptions): void => {
  res.status(status).setHeader("Content-Type", "application/json");
  if (options?.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
  }

  res.json(response as unknown as CombinedResponse<T>);
};

export default sendResponse;
