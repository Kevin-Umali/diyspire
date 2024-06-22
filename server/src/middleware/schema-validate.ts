import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ZodError, ZodType } from "zod";
import { parseOrDefault } from "../utils";
import sendResponse from "../utils/response-template";

interface ZodRequest<B = any, Q extends ParsedQs = ParsedQs, P extends ParamsDictionary = ParamsDictionary> extends Request {
  [x: string]: any;
  user?: {
    id: string;
    username: string;
  };
  email?: {
    id: string | number;
    email: string;
  };
  body: B;
  query: Q;
  params: P;
}

export type BodyRequest<B> = ZodRequest<B, any, any>;
export type QueryRequest<Q extends ParsedQs> = ZodRequest<any, Q, any>;
export type ParamsRequest<P extends ParamsDictionary> = ZodRequest<any, any, P>;

export type BodyQueryRequest<B, Q extends ParsedQs> = ZodRequest<B, Q, any>;
export type BodyParamsRequest<B, P extends ParamsDictionary> = ZodRequest<B, any, P>;
export type QueryParamsRequest<Q extends ParsedQs, P extends ParamsDictionary> = ZodRequest<any, Q, P>;

export type FullRequest<B, Q extends ParsedQs, P extends ParamsDictionary> = ZodRequest<B, Q, P>;

export type AnyRequest = ZodRequest<any, ParsedQs, ParamsDictionary>;

const zodValidateMiddleware =
  <B = any, Q extends ParsedQs = ParsedQs, P extends ParamsDictionary = ParamsDictionary>(schemas: { body?: ZodType<B, any, any>; query?: ZodType<Q, any, any>; params?: ZodType<P, any, any> }) =>
  async (req: ZodRequest<B, Q, P>, res: Response, next: NextFunction) => {
    try {
      req.body = await parseOrDefault(req.body, schemas.body);
      req.query = await parseOrDefault(req.query, schemas.query);
      req.params = await parseOrDefault(req.params, schemas.params);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return sendResponse(
          res,
          {
            success: false,
            errors: error.issues.map((e) => ({ path: e.path[0], message: e.message })),
          },
          400,
        );
      }
      next(error);
    }
  };

export default zodValidateMiddleware;
