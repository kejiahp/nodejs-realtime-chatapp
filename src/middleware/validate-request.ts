import { Request, Response, NextFunction } from "express";
import * as z from "zod";
import { fromZodError } from "zod-validation-error";

export const validateRequest =
  (schema: z.AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
        file: req.file,
        files: req.files,
      });

      next();
    } catch (error: any) {
      throw fromZodError(error);
    }
  };
