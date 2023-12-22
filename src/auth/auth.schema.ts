import * as z from "zod";

export const signUpValidationSchema = z.object({
  body: z.object({
    username: z.string({ required_error: "username is required" }).nonempty(),
    email: z.string({ required_error: "email is required" }).email().nonempty(),
    password: z.string({ required_error: "password is required" }),
  }),
  file: z.object({}).required(),
});

export const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "email is required" }).email().nonempty(),
    password: z.string({ required_error: "password is required" }).nonempty(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "email is required" }).email().nonempty(),
  }),
});

export const verifyPasswordResetSchema = z.object({
  body: z.object({
    newPassword: z
      .string({ required_error: "newPassword is required" })
      .nonempty(),
  }),
  query: z.object({
    code: z
      .string({ required_error: "passoword reset code is required" })
      .nonempty(),
  }),
});

export type verifyPasswordResetSchemaType = z.infer<
  typeof verifyPasswordResetSchema
>;

export const refreshTokenSchema = z.object({
  body: z.object({
    refresh_token: z
      .string({ required_error: "refresh token is required" })
      .nonempty(),
  }),
});
