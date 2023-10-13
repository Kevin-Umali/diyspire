import { Metadata } from "next";
import { getGuideByPathMetadata } from "@/lib";

import HowToGuideDetail from "./guide-name";

export async function generateMetadata({ params }: { params: { guide_name: string } }): Promise<Metadata> {
  const guide = await getGuideByPathMetadata(params.guide_name);

  return {
    title: `How to make ${guide.data.metadata.title}`,
    description: guide.data.metadata.description,
    keywords: ["DIY How-to Guides", "MakeMeDIYspire Tutorials", "DIY Project Instructions", "Step-by-Step DIY", "DIY Project Help", "DIY Creation Guide", "DIY Project Steps"],
    metadataBase: new URL("https://www.diyspire/guide/" + guide.data.path),
    applicationName: "MakeMeDIYspire",
  };
}

export default function Page({ params }: { params: { guide_name: string } }) {
  return <HowToGuideDetail params={params} />;
}
