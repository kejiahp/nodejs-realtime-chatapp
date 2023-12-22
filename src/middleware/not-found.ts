import { NextFunction, Response, Request } from "express";
import { AppError } from "../errors/custom-error";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new AppError(
    `Not Found ${req.originalUrl} | Method: ${req.method}`,
    404
  );
  next(error);
};
