"use client";

import { ComponentType, useEffect } from "react";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/authContext";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithAuth: React.FC<P> = (props) => {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
      if (!isAuthenticated) {
        const searchParamsString = new URLSearchParams(searchParams).toString();
        const redirectPath = `/login?redirect=${encodeURIComponent(pathname + (searchParamsString ? `?${searchParamsString}` : ""))}`;

        redirect(redirectPath);
      }
    }, [isAuthenticated, pathname, searchParams]);

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  WithAuth.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;
  return WithAuth;
};

function getDisplayName(WrappedComponent: React.ComponentType<any>): string {
  return (WrappedComponent.displayName ?? WrappedComponent.name) || "Component";
}

export default withAuth;
