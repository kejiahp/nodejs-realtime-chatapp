import * as z from "zod";

export const userSearchValidationSchema = z.object({
  query: z.object({
    search: z.string({ required_error: "search is required" }).optional(),
  }),
});
