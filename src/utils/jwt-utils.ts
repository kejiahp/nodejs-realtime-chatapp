import jwt, { SignOptions } from "jsonwebtoken";
import config from "config";

const publicKey = config.get<string>("JWT_PUBLIC_KEY");
const privateKey = config.get<string>("JWT_SECRET_KEY");

/**
 * sign jwt tokens
 */
export const signJwt = (object: object, options?: SignOptions) => {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
  // return jwt.sign(object, privateKey, {...(options && options)})
};

/**
 * verifies jwt tokens
 */
export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey);

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
};
