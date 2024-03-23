import { Metadata } from "next";

import Login from "./login";

export const metadata: Metadata = {
  title: "DIYspire Login or Signup",
  description: "Start your journey with DIYspire by signing up or signing in. Explore and create amazing DIY projects today!",
  keywords: [
    "DIYspire Sign In",
    "DIYspire Sign Up",
    "DIYspire Account",
    "DIY Project Sign In",
    "DIY Project Sign Up",
    "Login for DIY Projects",
    "Register for DIY Crafting",
    "DIY Project Platform Access",
    "AI DIY Account",
    "DIY Inspiration",
    "DIY Crafting Guide",
  ],
  metadataBase: new URL("https://www.diyspire/login"),
  applicationName: "DIYspire",
};

export default function Page() {
  return <Login />;
}
