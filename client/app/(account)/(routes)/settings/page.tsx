import { Metadata } from "next";

import Settings from "./settings";

export const metadata: Metadata = {
  title: "Account Settings - DIYspire",
  description: "Customize your DIYspire account settings and preferences to personalize your experience.",
  keywords: ["Account Settings", "User Preferences", "DIYspire Account", "Personalization", "Customization"],
  metadataBase: new URL("https://www.diyspire.com/account-settings"),
  applicationName: "DIYspire",
};

export default function Page() {
  return <Settings />;
}
