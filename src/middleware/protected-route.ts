import { Request, Response, NextFunction } from "express";

export const protectedRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  return next();
};
