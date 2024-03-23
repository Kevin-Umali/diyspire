import { Metadata } from "next";

import Status from "./status";

export const metadata: Metadata = {
  title: "DIYspire API Status and Health Check",
  description: "Check the status and health of the DIYspire AI-generated DIY project API. Ensure it's running smoothly and get inspired with innovative project ideas.",
  keywords: ["API Status", "Backend Health Check", "DIYspire AI API", "AI-Generated DIY Projects", "DIY Project Ideas"],
  metadataBase: new URL("https://www.diyspire.com/status"),
  applicationName: "DIYspire",
};

export default function Page() {
  return <Status />;
}
