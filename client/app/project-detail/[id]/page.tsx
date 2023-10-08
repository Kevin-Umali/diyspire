import { Metadata } from "next";
import { getShareLinkData } from "@/lib";

import ProjectDetailById from "./project-detail-by-id";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const sharedLinkData = await getShareLinkData(params.id);

  return {
    title: sharedLinkData.data.projectDetails.title + ` | MakeMeDIYspire`,
    description: sharedLinkData.data.projectDetails.description,
    keywords: ["DIY Project Details", "MakeMeDIYspire Tutorials", "DIY Project Instructions", "Step-by-Step DIY", "DIY Project Help", "DIY Creation Guide", "DIY Project Steps"],
    metadataBase: new URL("https://www.diyspire/project-detail/" + params.id),
    applicationName: "MakeMeDIYspire",
  };
}

export default function Page({ params }: { params: { id: string } }) {
  return <ProjectDetailById params={params} />;
}
