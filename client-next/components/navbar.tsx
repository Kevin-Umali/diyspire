"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Github } from "lucide-react";

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleColorMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className={`flex justify-between items-center p-4 shadow-sm w-full`}>
      <div className="flex items-center space-x-2">
        <div>
          <h1 className="text-lg lg:text-xl">
            <Link href="/">MakeMeDIYspire</Link>
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <a href="https://github.com/Kevin-Umali/make-me" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className="text-lg lg:text-xl p-2">
          <Github size={20} />
        </a>
        <button aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} className="p-2 rounded-md" onClick={toggleColorMode}>
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
