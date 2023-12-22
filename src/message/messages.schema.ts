import * as z from "zod";

export const send_message_validator = z.object({
  body: z.object({
    chatId: z
      .string({ required_error: "chatId is required" })
      .nonempty("chatId is required"),
    content: z
      .string({ required_error: "content is required" })
      .nonempty("content is required"),
  }),
});

export const get_all_messages_validator = z.object({
  params: z.object({
    chatId: z
      .string({ required_error: "chatId is required" })
      .nonempty("chatId is required"),
  }),
});
