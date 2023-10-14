"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { currencyList } from "@/constants";
import { useCurrency } from "@/context/currencyContext";
import { Github, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();

  const toggleColorMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const currencyItems = useMemo(
    () =>
      currencyList.map((value) => (
        <SelectItem key={value} value={value}>
          {value}
        </SelectItem>
      )),
    [],
  );

  return (
    <nav className="flex w-full items-center justify-between p-4 shadow-sm">
      <div className="flex items-center space-x-2">
        <Image src="/android-chrome-512x512.png" alt="Logo" width={32} height={32} priority={true} className="mr-2" />
        <div>
          <h1 className="text-lg lg:text-xl">
            <Link href="/">MakeMeDIYspire</Link>
          </h1>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Select onValueChange={setCurrency} defaultValue={currency} aria-label="Select currency">
          <SelectTrigger className="w-[80px]" aria-label="Select a currency to use">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent className="max-h-[150px]" aria-label="Select a currency to use">
            <SelectGroup>
              <SelectLabel>Currency</SelectLabel>
              {currencyItems}
            </SelectGroup>
          </SelectContent>
        </Select>
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
