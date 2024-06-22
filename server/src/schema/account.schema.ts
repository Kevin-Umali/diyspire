import { z } from "zod";
import { createRequiredString } from "../utils";

const ProfileSchema = z.object({
  fullName: createRequiredString("Full name is required"),
  email: createRequiredString("Email is required"),
});

const PrivacySettingSchema = z.object({
  isProfileVisible: z.boolean(),
  isSearchEngineIndexingAllowed: z.boolean(),
});

const DIYCategorySchema = z.object({
  name: createRequiredString("Category name is required"),
});

const DIYProjectSchema = z.object({
  title: createRequiredString("Project title is required"),
  categoryId: z.number(),
});

const DIYRecommendationSchema = z.object({
  isEnabled: z.boolean(),
});

const EmailSubscriptionSchema = z.object({
  address: createRequiredString("Email address is required"),
  unsubscribe: z.boolean(),
});

const UpdateAccountSettingsSchema = z.object({
  profile: ProfileSchema,
  privacySettings: PrivacySettingSchema,
  DIYCategory: DIYCategorySchema,
  DIYProject: DIYProjectSchema,
  DIYRecommendation: DIYRecommendationSchema,
  emailSubscriptions: z.array(EmailSubscriptionSchema),
});

export { UpdateAccountSettingsSchema, ProfileSchema, PrivacySettingSchema, DIYCategorySchema, DIYProjectSchema, DIYRecommendationSchema, EmailSubscriptionSchema };

export type UpdateAccountSettingsRequest = z.infer<typeof UpdateAccountSettingsSchema>;
