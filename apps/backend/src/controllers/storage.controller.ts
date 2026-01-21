import { Request, Response, NextFunction, RequestHandler } from "express";
import { UploadSignSchema } from "@repo/types";
import { AppError } from "../utils/app-error";
import { catchAsync } from "../utils/catch-async";
import { storageService } from "../services/storage.service";

export const getSignedUrl: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsed = UploadSignSchema.safeParse(req.body);
    if (!parsed.success)
      return next(new AppError("Invalid request parameters", 400));

    const { fileName } = parsed.data;
    const data = await storageService.getUploadUrl(fileName);

    res.status(200).json({ success: true, data });
  },
);
