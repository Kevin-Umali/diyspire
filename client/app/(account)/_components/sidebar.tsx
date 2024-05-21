"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { useRoutes } from "@/context/routesContext";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Sidebar: React.FC = () => {
  const { routes, activePath } = useRoutes();
  const router = useRouter(); // Get the router instance

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="sticky top-0 hidden h-screen overflow-y-auto border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Button variant="ghost" onClick={() => handleNavigation("/")} className="flex items-center gap-2 font-semibold">
            <Image src="/android-chrome-512x512.png" alt="Logo" width={32} height={32} priority={true} />
            <span className="text-md sm:text-xl lg:text-xl">DIYspire</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {routes?.map(({ label, path, icon: IconComponent, disabled }, index) => (
              <Button
                disabled={disabled}
                variant="ghost"
                key={index + path}
                onClick={() => handleNavigation(path)}
                className={cn(
                  "flex items-center justify-start gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary", // Added justify-start
                  activePath && path.includes(activePath) ? "text-primary" : "text-muted-foreground",
                )}
              >
                {IconComponent && <IconComponent size={16} />}
                <span className="text-lg">{label}</span>
              </Button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
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
      </div>
    </div>
  );
};

export default Sidebar;
