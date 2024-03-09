import z from "zod";

export const UnsubscribeEmailQuerySchema = z.object({
  email: z.string().email().min(1),
  token: z.string().min(1),
});

export const SubscribeEmailSchema = z.object({
  email: z.string().email().min(1),
});

export type UnsubscribeEmailQueryRequest = z.infer<typeof UnsubscribeEmailQuerySchema>;
export type SubscribeEmailRequest = z.infer<typeof SubscribeEmailSchema>;
