"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

interface CurrencyContextProps {
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<string>("PHP");

  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency") ?? "PHP";
    setCurrency(savedCurrency);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedCurrency", currency);
  }, [currency]);

  const contextValue = useMemo(() => {
    return { currency, setCurrency };
  }, [currency, setCurrency]);

  return <CurrencyContext.Provider value={contextValue}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = (): CurrencyContextProps => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
