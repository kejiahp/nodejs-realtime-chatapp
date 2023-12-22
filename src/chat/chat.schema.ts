import * as z from "zod";

export const createOrAccessChatValidator = z.object({
  body: z.object({
    userId: z.string({ required_error: "userId is required" }).nonempty(),
  }),
});

export const createGroupChatValidator = z.object({
  body: z.object({
    groupName: z.string({ required_error: "groupName is required" }).nonempty(),
    users: z
      .array(z.string().nonempty())
      .min(2, "minimum of 2 users")
      .max(30, "maximum of 30 users"),
  }),
});

export const renameGroupChatValidator = z.object({
  body: z.object({
    groupId: z
      .string({ required_error: "groupId is required" })
      .nonempty("groupId is required"),
    newGroupName: z
      .string({ required_error: "newGroupName is required" })
      .nonempty("newGroupName is required"),
  }),
});

export const addOrRemoveValidator = z.object({
  body: z.object({
    groupId: z
      .string({ required_error: "groupId is required" })
      .nonempty("groupId is required"),
    userId: z
      .string({ required_error: "userId is required" })
      .nonempty("userId is required"),
  }),
});
