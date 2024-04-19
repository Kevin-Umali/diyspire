import { Metadata } from "next";

import HowToGuidesList from "./guide";

export const metadata: Metadata = {
  title: "DIYspire How-to Guides",
  description: "Navigate through our comprehensive guides and maximize the potential of the DIYspire DIY project generator.",
  keywords: ["DIY Project Guides", "DIYspire Instructions", "DIY Project Tips", "DIY Crafting Guide", "DIY Project Creation", "DIY Generator Guide", "DIY Inspiration", "AI DIY"],
  metadataBase: new URL("https://www.diyspire/guide"),
  applicationName: "DIYspire",
};

export default function Page() {
  return <HowToGuidesList />;
}
