import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MakeMeDIYspire - AI-Powered DIY Project Idea Generator",
  description: "Unleash a world of unique DIY project ideas with MakeMeDIYspire, an AI-powered generator backed by OpenAI. Ignite your creativity and embark on your next inventive journey.",
  keywords: [
    "AI DIY Projects",
    "OpenAI Project Ideas",
    "AI-Powered DIY Generator",
    "Creative Project Ideas",
    "DIY Inspiration",
    "Automated DIY Ideas",
    "Innovative Project Generator",
    "DIY Creativity",
  ],
  metadataBase: new URL("https://www.diyspire.online/"),
  applicationName: "MakeMeDIYspire",
  openGraph: {
    type: "website",
    url: "https://www.diyspire.online/",
    title: "MakeMeDIYspire - AI-Powered DIY Project Idea Generator",
    description: "Unleash a world of unique DIY project ideas with MakeMeDIYspire, an AI-powered generator backed by OpenAI. Ignite your creativity and embark on your next inventive journey.",
  },
  twitter: {
    site: "https://www.diyspire.online/",
    title: "MakeMeDIYspire - AI-Powered DIY Project Idea Generator",
    description: "Unleash a world of unique DIY project ideas with MakeMeDIYspire, an AI-powered generator backed by OpenAI. Ignite your creativity and embark on your next inventive journey.",
  },
  themeColor: [{ color: "#ffffff" }],
  colorScheme: "light",
  referrer: "no-referrer-when-downgrade",
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="grow">{children}</main>
            <Footer />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
