import { Response, Request } from "express";
import { AppError } from "../errors/custom-error";
import logger from "../utils/logger";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: any
) => {
  if (error.name === "ZodValidationError") {
    logger.error(error.message);
    return res.status(400).send({
      details: error.message,
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
  }
  if (error.name === "ValidationError") {
    logger.error(error.message);
    return res.status(400).send({
      type: "moongoose error",
      details: error.message,
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
  }
  if (error instanceof AppError) {
    logger.error(error.message);
    return res.status(error.statusCode).send({
      errorCode: error.errorCode,
      details: error.message,
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
  }

  logger.error(error.message);
  return res.status(500).send({
    details: error.message,
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
};
