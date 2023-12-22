import { Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import {
  createUserService,
  findUserService,
  forgotPasswordService,
  loginUserService,
  verifyPasswordResetCodeService,
} from "../user/user.service";
import { AppError } from "../errors/custom-error";
import { verifyPasswordResetSchemaType } from "./auth.schema";
import { signJwt, verifyJwt } from "../utils/jwt-utils";
import {
  createSessionService,
  findSessionById,
  invalidateAllUserSessionService,
  invalidateSessionById,
} from "../session/session.service";
import { get } from "lodash";
import config from "config";

export const signUpUserController = tryCatch(
  async (req: Request, res: Response) => {
    const body = req.body;
    const file = req.file;

    if (!file) {
      throw new AppError("profilePhoto image is required", 400);
    }

    const user = await createUserService({ file: file, ...body });

    return res.status(201).send(user);
  }
);

export const loginUserController = tryCatch(
  async (req: Request, res: Response) => {
    const body = req.body;

    const user = await loginUserService(body);

    await invalidateAllUserSessionService({ userId: user._id });

    const session = await createSessionService({
      userId: user._id,
      userAgent: req.get("user-agent") || "",
    });

    const accessTokenTTL = config.get<string>("accessTokenTTL");
    const refreshTokenTTL = config.get<string>("refreshTokenTTL");

    const access_token = signJwt(
      {
        uid: user._id,
        admin: user.isAdmin,
        username: user.username,
        profilePhoto: user.profilePhoto,
        email: user.email,
      },
      { expiresIn: accessTokenTTL }
    );

    const refresh_token = signJwt(
      { sid: session._id },
      { expiresIn: refreshTokenTTL }
    );

    return res.status(200).send({ access_token, refresh_token });
  }
);

export const refreshTokenController = tryCatch(
  async (req: Request<{}, {}, { refresh_token: string }>, res: Response) => {
    const { refresh_token } = req.body;

    const { valid, decoded, expired } = verifyJwt(refresh_token);

    if (!valid || expired || !decoded) {
      return res.status(401).send("Unauthorized");
    }

    const sessionId = get(decoded, "sid") as unknown as string;

    const userSession = await findSessionById(sessionId);

    if (!userSession?.isValid) {
      return res.status(401).send("Unauthorized");
    }

    const user = await findUserService(userSession.userId);

    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    const accessTokenTTL = config.get<string>("accessTokenTTL");

    const access_token = signJwt(
      {
        uid: user._id,
        admin: user.isAdmin,
        username: user.username,
        profilePhoto: user.profilePhoto,
        email: user.email,
      },
      { expiresIn: accessTokenTTL }
    );

    return res.status(200).send({ access_token });
  }
);

export const forgotPasswordController = tryCatch(
  async (req: Request, res: Response) => {
    const body = req.body;

    const forgotPassword = await forgotPasswordService({
      email: body.email,
      context: req,
    });

    return res.status(200).send(forgotPassword);
  }
);

export const verifyPasswordResetCodeController = tryCatch(
  async (
    req: Request<
      {},
      {},
      verifyPasswordResetSchemaType["body"],
      verifyPasswordResetSchemaType["query"]
    >,
    res: Response
  ) => {
    const query = req.query;
    const body = req.body;

    const passwordResetAttempt = await verifyPasswordResetCodeService(
      query.code,
      body.newPassword
    );

    return res.status(200).send(passwordResetAttempt);
  }
);

export const logoutController = tryCatch(
  async (req: Request, res: Response) => {
    const sessionId = res.locals.user.sid;

    await invalidateSessionById(sessionId);

    return res.status(200).send({
      access_token: null,
      refresh_token: null,
    });
  }
);
