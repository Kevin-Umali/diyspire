import { z } from "zod";
import { createRequiredString } from "../utils";

export const UpdateAccountSettingsSchema = z
  .object({
    username: createRequiredString("Username is required"),
    email: createRequiredString("Email is required"),
    fullName: createRequiredString("Full name is required"),
    newsletter: z.boolean().optional(),
    updates: z.boolean().optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.currentPassword && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required if current password is provided",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required if new password is provided",
      path: ["currentPassword"],
    },
  );

export type UpdateAccountSettingsRequest = z.infer<typeof UpdateAccountSettingsSchema>;
