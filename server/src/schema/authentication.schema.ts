import z from "zod";
import { createRequiredString } from "../utils";

export const UserSchema = z.object({
  username: createRequiredString("Username is required"),
  password: createRequiredString("Password is requred"),
});

export type UserRequest = z.infer<typeof UserSchema>;
