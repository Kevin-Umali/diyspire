import { Response, NextFunction } from "express";

import { sendError, sendSuccess } from "../utils/response-template";
import { randomInt } from "crypto";
import { QueryRequest } from "../middleware/schema-validate";
import { UnsplashImageSearchQueryRequest } from "../schema/unsplash.schema";
import { createApi } from "unsplash-js";

export const searchImages = async (req: QueryRequest<UnsplashImageSearchQueryRequest>, res: Response, next: NextFunction) => {
  try {
    const query: string = decodeURIComponent(req.query.query ? req.query.query.toString() : "");

    const unsplash: ReturnType<typeof createApi> = req.app.get("unsplash");

    const result = await unsplash.search.getPhotos({
      query,
      page: 1,
      perPage: 1,
    });

    if (result.errors) {
      sendSuccess(res, { errors: result.errors }, 400);
    } else {
      const maxLength = result.response.results.length < 5 ? result.response.results.length : 6;
      const randomIndex = randomInt(maxLength);
      const photo = result.response.results[randomIndex];

      if (photo) {
        await unsplash.photos.trackDownload({
          downloadLocation: photo.links.download_location,
        });

        sendSuccess(res, {
          id: photo.id,
          width: photo.width,
          height: photo.height,
          color: photo.color,
          alt_description: photo.alt_description,
          urls: photo.urls,
          links: photo.links,
          user: {
            username: photo.user.username,
            name: photo.user.name,
            link: photo.user.links.html,
          },
        });
      } else {
        sendError(res, "No photos found for the given query.", 400);
      }
    }
  } catch (error) {
    next(error);
  }
};
