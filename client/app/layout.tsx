import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/authContext";
import { CurrencyProvider } from "@/context/currencyContext";

import { Toaster } from "@/components/ui/sonner";
import Footer from "@/landing/components/footer";
import Navbar from "@/landing/components/navbar";

import TanstackQueryProvider from "../context/tanstackContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DIYspire - AI-Powered DIY Project Idea Generator",
  description: "Unleash a world of unique DIY project ideas with DIYspire, an AI-powered generator backed by OpenAI. Ignite your creativity and embark on your next inventive journey.",
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
  applicationName: "DIYspire",
  openGraph: {
    type: "website",
    url: "https://www.diyspire.online/",
    title: "DIYspire - AI-Powered DIY Project Idea Generator",
    description: "Unleash a world of unique DIY project ideas with DIYspire, an AI-powered generator backed by OpenAI. Ignite your creativity and embark on your next inventive journey.",
  },
  twitter: {
    site: "https://www.diyspire.online/",
    title: "DIYspire - AI-Powered DIY Project Idea Generator",
    description: "Unleash a world of unique DIY project ideas with DIYspire, an AI-powered generator backed by OpenAI. Ignite your creativity and embark on your next inventive journey.",
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
    <TanstackQueryProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <CurrencyProvider>
                <Toaster position="top-center" richColors />
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <main className="flex-grow">{children}</main>
                </div>
                <Footer />
              </CurrencyProvider>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </TanstackQueryProvider>
  );
}
