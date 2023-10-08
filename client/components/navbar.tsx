"use client";

import Link from "next/link";
import { Github, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleColorMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="flex w-full items-center justify-between p-4 shadow-sm">
      <div className="flex items-center space-x-2">
        <div>
          <h1 className="text-lg lg:text-xl">
            <Link href="/">MakeMeDIYspire</Link>
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <a href="https://github.com/Kevin-Umali/make-me" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className="p-2 text-lg lg:text-xl">
          <Github size={20} />
        </a>
        <button aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} className="rounded-md p-2" onClick={toggleColorMode}>
          {theme === "light" ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
