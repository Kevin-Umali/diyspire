import { Metadata } from "next";

import ProjectDetail from "./project-detail";

export const metadata: Metadata = {
  title: "AI-Generated DIY Project Details - DIYspire",
  description: "Discover AI-generated DIY project details and get inspired with DIYspire's innovative project generator.",
  keywords: ["AI-Generated Projects", "DIY Project Details", "DIYspire AI", "AI-Generated DIY Ideas", "AI-Generated DIY Projects"],
  metadataBase: new URL("https://www.diyspire/project-detail"),
  applicationName: "DIYspire",
};

export default function Page() {
  return <ProjectDetail />;
}
