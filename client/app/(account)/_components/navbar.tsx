"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { useCurrency } from "@/context/currencyContext";
import { useRoutes } from "@/context/routesContext";
import { Github, Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import AvatarControl from "./avatar-control";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const { theme, setTheme } = useTheme();
  const { currency, setCurrency, currencyList } = useCurrency();
  const { routes, activePath } = useRoutes();

  const { logout } = useAuth();

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
    <header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link href="#" as={"/"} className="flex items-center gap-2 text-lg font-semibold">
              <Image src="/android-chrome-512x512.png" alt="Logo" width={32} height={32} priority={true} />
              <span className="text-md sm:text-xl lg:text-xl">DIYspire</span>
            </Link>
            {routes?.map(({ label, path, icon: IconComponent }, index) => (
              <Link
                key={index + path}
                href={path}
                as={path}
                className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground", activePath && path.includes(activePath) ? "text-primary" : "text-muted-foreground")}
                onClick={() => setOpen(!open)}
              >
                {IconComponent && <IconComponent size={20} />}
                <span className="text-md sm:text-xl lg:text-xl">{label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>More feature to come</CardTitle>
                <CardDescription>User Profile, Settings, More Category Selection, Personalize DIYs and more</CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-4" />
            <Input type="search" placeholder="Search products..." className="w-full appearance-none pl-8 shadow-none md:w-2/3 lg:w-1/3" disabled />
          </div>
        </form>
      </div>
      <Select key={currency} onValueChange={setCurrency} defaultValue={currency} aria-label="Select currency">
        <SelectTrigger className="max-w-[80px]" aria-label="Select a currency to use">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent className="max-h-[250px]" aria-label="Select a currency to use">
          <SelectGroup>
            <SelectLabel>Currency</SelectLabel>
            {currencyItems}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Link
        href="https://github.com/Kevin-Umali/diyspire"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub repository"
        as={"https://github.com/Kevin-Umali/diyspire"}
        className="p-2 text-lg lg:text-xl"
      >
        <Github className="size-5" />
      </Link>
      <Button variant="ghost" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} className="rounded-md p-2" onClick={toggleColorMode}>
        {theme === "light" ? <Moon className="size-5" aria-hidden="true" /> : <Sun className="size-5" aria-hidden="true" />}
      </Button>
      <AvatarControl logout={logout} />
    </header>
  );
};

export default Navbar;
