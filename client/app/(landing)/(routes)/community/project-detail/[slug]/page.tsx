import { Metadata } from "next";
import { getProjectDataBySlugMetadata } from "@/api";

import ProjectDetailById from "./project-detail-by-slug";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const sharedLinkData = await getProjectDataBySlugMetadata(params.slug);

  return {
    title: `How to make ${sharedLinkData.data.title}`,
    description: sharedLinkData.data.description,
    keywords: ["DIY Project Details", "DIYspire Tutorials", "DIY Project Instructions", "Step-by-Step DIY", "DIY Project Help", "DIY Creation Guide", "DIY Project Steps"],
    metadataBase: new URL("https://www.diyspire/community/project-detail/" + params.slug),
    applicationName: "DIYspire",
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  return <ProjectDetailById params={params} />;
}
