import { Metadata } from "next";
import FAQPage from "./faq";

export const metadata: Metadata = {
  title: "MakeMeDIYspire FAQs",
  description: "Discover answers to all your queries about the MakeMeDIYspire platform, its functionality, feedback process, and more.",
  keywords: ["DIY FAQs", "MakeMeDIYspire Questions", "DIY Project Help", "DIY Platform Queries", "Project Generator FAQs", "DIY Project Creation", "DIY Inspiration"],
  metadataBase: new URL("https://www.diyspire/faq"),
  applicationName: "MakeMeDIYspire",
};

export default function Page() {
  return <FAQPage />;
}
