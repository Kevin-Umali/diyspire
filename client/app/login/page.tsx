import { Metadata } from "next";

import Login from "./login";

export const metadata: Metadata = {
  title: "MakeMeDIYspire Login or Signup",
  description: "Start your journey with MakeMeDIYspire by signing up or signing in. Explore and create amazing DIY projects today!",
  keywords: [
    "MakeMeDIYSpire Sign In",
    "MakeMeDIYSpire Sign Up",
    "MakeMeDIYspire Account",
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
  applicationName: "MakeMeDIYspire",
};

export default function Page() {
  return <Login />;
}
