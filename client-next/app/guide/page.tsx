import HowToGuidesList from "./guide";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MakeMeDIYspire How-to Guides",
  description: "Navigate through our comprehensive guides and maximize the potential of the MakeMeDIYspire DIY project generator.",
  keywords: ["DIY Project Guides", "MakeMeDIYspire Instructions", "DIY Project Tips", "DIY Crafting Guide", "DIY Project Creation", "DIY Generator Guide", "DIY Inspiration", "AI DIY"],
  metadataBase: new URL("https://www.diyspire/guide"),
  applicationName: "MakeMeDIYspire",
};

export default function Page() {
  return <HowToGuidesList />;
}
