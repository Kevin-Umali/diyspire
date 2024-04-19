"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { accountRoutes } from "@/constants";
import { Github, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const router = useRouter();

  const path = usePathname();

  const toggleColorMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isCommunityRoute = path.startsWith("/community");

  const isPrivateRoute =
    !isCommunityRoute &&
    accountRoutes.some((route) => {
      const pathSegments = path.split("/");
      return pathSegments.includes(route);
    });
  const shouldShowNavbar = !isPrivateRoute || isCommunityRoute;

  return (
    shouldShowNavbar && (
      <nav className="relative z-10 flex w-full items-center justify-between p-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <Image src="/android-chrome-512x512.png" alt="Logo" width={32} height={32} priority={true} />
          <h1 className="text-md sm:text-xl lg:text-xl">
            <Link href="/">DIYspire</Link>
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-2">
            <Link href="https://github.com/Kevin-Umali/diyspire" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className="p-2 text-lg lg:text-xl">
              <Github className="size-5" />
            </Link>
            <Button variant="ghost" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} className="rounded-md p-2" onClick={toggleColorMode}>
              {theme === "light" ? <Moon className="size-5" aria-hidden="true" /> : <Sun className="size-5" aria-hidden="true" />}
            </Button>
          </div>
          <Button onClick={() => router.push("/login")} variant="outline">
            Login
          </Button>
        </div>
      </nav>
    )
  );
};

export default Navbar;
