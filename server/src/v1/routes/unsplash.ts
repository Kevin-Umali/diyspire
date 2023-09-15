import express, { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/response-template";
import { searchValidationSchema } from "../schemas/image-search";
import { validationResult } from "express-validator/src/validation-result";

const router = express.Router();

router.get(
  "/search",
  searchValidationSchema,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return sendSuccess(res, { errors: errors.array() }, 400);
      }

      const query: string = decodeURIComponent(
        req.query.query ? req.query.query.toString() : "",
      );

      const unsplash = req.app.get("unsplash");

      const result = await unsplash.search.getPhotos({
        query,
        page: 1,
        perPage: 1,
      });

      if (result.errors) {
        sendSuccess(res, { errors: result.errors }, 400);
      } else {
        const photo = result.response.results[0];

        if (photo) {
          sendSuccess(res, {
            id: photo.id,
            width: photo.width,
            height: photo.height,
            color: photo.color,
            urls: photo.urls,
            links: photo.links,
            user: {
              username: photo.user.username,
              name: photo.user.name,
              link: photo.user.links.html,
            },
          });
        } else {
          sendSuccess(
            res,
            { errors: "No photos found for the given query." },
            400,
          );
        }
      }
    } catch (error) {
      next(error);
    }
  },
);

export default router;
