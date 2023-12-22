import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt-utils";

const deserializeAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth_header_token = get(req.headers, "authorization")?.replace(
    /^Bearer\s/,
    ""
  );

  if (!auth_header_token) {
    return res.status(401).send("Unauthorized");
  }

  const { valid, decoded, expired } = verifyJwt(auth_header_token);

  if (expired || !decoded || !valid) {
    return res.status(401).send("Unauthorized");
  }

  res.locals.user = decoded;

  return next();
};

export default deserializeAuthToken;
