import { Metadata } from "next";
import ProjectDetail from "./project-detail";

export const metadata: Metadata = {
  title: "AI-Generated DIY Project Details - MakeMeDIYspire",
  description: "Discover AI-generated DIY project details and get inspired with MakeMeDIYspire's innovative project generator.",
  keywords: ["AI-Generated Projects", "DIY Project Details", "MakeMeDIYspire AI", "AI-Generated DIY Ideas", "AI-Generated DIY Projects"],
  metadataBase: new URL("https://www.diyspire/project-detail"),
  applicationName: "MakeMeDIYspire",
};

export default function Page() {
  return <ProjectDetail />;
}
