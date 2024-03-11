import { Metadata } from "next";

import Generate from "./generate";

export const metadata: Metadata = {
  title: "MakeMeDIYspire DIY Project Generator",
  description: "Start your journey with MakeMeDIYspire by signing up or signing in. Explore and create amazing DIY projects today!",
  keywords: [
    "MakeMeDIYSpire DIY Generator",
    "DIY Project DIY Generator",
    "Generator for DIY Projects",
    "Generate DIY Crafting",
    "DIY Project Platform Access",
    "AI DIY Generator",
    "Generate AI DIY Project",
  ],
  metadataBase: new URL("https://www.diyspire/generate"),
  applicationName: "MakeMeDIYspire",
};

export default function Page() {
  return <Generate />;
}
