"use client";

import { ComponentType, useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/authContext";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithAuth: React.FC<P> = (props) => {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
      if (!isAuthenticated) {
        redirect("/login");
      }
    }, [isAuthenticated]);

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  WithAuth.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;
  return WithAuth;
};

function getDisplayName(WrappedComponent: React.ComponentType<any>): string {
  return (WrappedComponent.displayName ?? WrappedComponent.name) || "Component";
}

export default withAuth;
