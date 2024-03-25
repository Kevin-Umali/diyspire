"use client";

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface CurrencyContextProps {
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<string | undefined>(undefined);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency") ?? "PHP";
    setCurrency(savedCurrency);
  }, []);

  useEffect(() => {
    if (currency !== undefined) {
      localStorage.setItem("selectedCurrency", currency);
    }
  }, [currency]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "selectedCurrency") {
        setCurrency(event.newValue ?? "PHP");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const contextValue = {
    currency: currency ?? "PHP",
    setCurrency,
  };

  return <CurrencyContext.Provider value={contextValue}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = (): CurrencyContextProps => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
