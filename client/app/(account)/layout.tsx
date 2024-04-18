"use client";

import "../globals.css";

import { useAuth } from "@/context/authContext";
import { RoutesProvider } from "@/context/routesContext";

import PageLoader from "@/components/page-loader";
import Navbar from "@/account/components/navbar";
import Sidebar from "@/account/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isPending, isAuthenticated } = useAuth();

  if (isPending) {
    return <PageLoader loaderMessage="Checking authentication..." />;
  }

  if (isAuthenticated) {
    return (
      <RoutesProvider>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <Sidebar />
          <div className="flex w-full flex-col">
            <Navbar />
            <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 lg:gap-6 lg:p-6">{children}</main>
          </div>
        </div>
      </RoutesProvider>
    );
  }

  return children;
}
