import { Metadata } from "next";

import Generate from "./generate";

export const metadata: Metadata = {
  title: "DIYspire DIY Project Generator",
  description: "Start your journey with DIYspire by signing up or signing in. Explore and create amazing DIY projects today!",
  keywords: [
    "DIYspire DIY Generator",
    "DIY Project DIY Generator",
    "Generator for DIY Projects",
    "Generate DIY Crafting",
    "DIY Project Platform Access",
    "AI DIY Generator",
    "Generate AI DIY Project",
  ],
  metadataBase: new URL("https://www.diyspire/generate"),
  applicationName: "DIYspire",
};

export default function Page() {
  return <Generate />;
}
