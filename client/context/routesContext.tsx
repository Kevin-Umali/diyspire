"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Palette, Sparkle, SquareGanttChart } from "lucide-react";

interface SideBarRoutes {
  label: string;
  path: string;
  hash?: string;
  href?: string;
  icon?: React.ElementType;
  disabled?: boolean;
}

interface RoutesContextProps {
  routes: SideBarRoutes[];
  activePath: string;
}

interface RoutesProviderProps {
  children: ReactNode;
}

const RoutesContext = createContext<Partial<RoutesContextProps>>({});

export const RoutesProvider: React.FC<RoutesProviderProps> = ({ children }) => {
  const pathName = usePathname() ?? "/generate";

  const contextValue = useMemo(
    () => ({
      routes: [
        {
          label: "Dashboard",
          path: "/dashboard",
          hash: "#",
          icon: LayoutDashboard,
          disabled: true,
        },
        {
          label: "Generate",
          path: "/generate",
          hash: "#",
          icon: Sparkle,
          disabled: false,
        },
        {
          label: "Projects Details",
          path: "/project-detail",
          hash: "#",
          icon: SquareGanttChart,
          disabled: false,
        },
        {
          label: "Generated DIYs",
          path: "/diys",
          hash: "#",
          icon: Palette,
          disabled: false,
        },
      ],
      activePath: pathName,
    }),
    [pathName],
  );

  return <RoutesContext.Provider value={contextValue}>{children}</RoutesContext.Provider>;
};
export const useRoutes = () => useContext(RoutesContext);
