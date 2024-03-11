"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { currencyList } from "@/constants";
import { useAuth } from "@/context/authContext";
import { useCurrency } from "@/context/currencyContext";
import { Github, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import AvatarControl from "./avatar-control";

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const { isAuthenticated, logout } = useAuth();

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
    <nav className="relative z-10 flex w-full items-center justify-between p-4 shadow-sm">
      <div className="flex items-center space-x-2">
        <Image src="/android-chrome-512x512.png" alt="Logo" width={32} height={32} priority={true} />
        <div className="">
          <h1 className="text-md sm:text-xl lg:text-xl">
            <Link href="/">MakeMeDIYspire</Link>
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="hidden space-x-2 lg:flex">
          <Select onValueChange={setCurrency} defaultValue={currency} aria-label="Select currency">
            <SelectTrigger className="w-[130px]" aria-label="Select a currency to use">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="max-h-[250px]" aria-label="Select a currency to use">
              <SelectGroup>
                <SelectLabel>Currency</SelectLabel>
                {currencyItems}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Link href="https://github.com/Kevin-Umali/make-me" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className="p-2 text-lg lg:text-xl">
            <Github size={20} />
          </Link>
          <Button variant="ghost" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} className="rounded-md p-2" onClick={toggleColorMode}>
            {theme === "light" ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
          </Button>
        </div>
        <div className="space-x-2 lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-[120px]" asChild>
              <Button variant="outline">Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Select onValueChange={setCurrency} defaultValue={currency} aria-label="Select currency">
                  <SelectTrigger className="w-full" aria-label="Select a currency to use">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[250px]" aria-label="Select a currency to use">
                    <SelectGroup>
                      <SelectLabel>Currency</SelectLabel>
                      {currencyItems}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="https://github.com/Kevin-Umali/make-me" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
                  <span className="flex items-center space-x-2">
                    <Github size={20} />
                    <span>GitHub</span>
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleColorMode}>
                <span className="flex items-center space-x-2">
                  {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                  <span>Switch Theme</span>
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <AvatarControl isAuthenticated={isAuthenticated} logout={logout} />
      </div>
    </nav>
  );
};

export default Navbar;
