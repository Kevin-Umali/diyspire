import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ZodType, ZodError } from "zod";
import { sendSuccess } from "../utils/response-template";

interface ZodRequest<B = any, Q extends ParsedQs = ParsedQs, P extends ParamsDictionary = ParamsDictionary> extends Request {
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

const zodValidateMiddleware =
  <B = any, Q extends ParsedQs = ParsedQs, P extends ParamsDictionary = ParamsDictionary>(schemas: { body?: ZodType<B, any, any>; query?: ZodType<Q, any, any>; params?: ZodType<P, any, any> }) =>
  async (req: ZodRequest<B, Q, P>, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = await schemas.body.parseAsync(req.body);
      if (schemas.query) req.query = await schemas.query.parseAsync(req.query);
      if (schemas.params) req.params = await schemas.params.parseAsync(req.params);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return sendSuccess(
          res,
          {
            errors: error.issues.map((e) => ({ path: e.path[0], message: e.message })),
          },
          400,
        );
      }
      next(error);
    }
  };

export default zodValidateMiddleware;
