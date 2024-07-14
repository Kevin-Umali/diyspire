import type { Metadata } from "next";

import Maintenance from "./maintenance";

export const metadata: Metadata = {
  title: "Maintenance",
  description: "Under Maintenance",
  keywords: ["Maintenance", "Under Maintenance"],
  metadataBase: new URL("https://www.diyspire.com/maintenance"),
  applicationName: "DIYspire",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function Page() {
  return <Maintenance />;
}
