"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ReceiptContextType {
  parsedReceipt: any | null;
  setParsedReceipt: (data: any) => void;
  clearReceipt: () => void;
}

const ReceiptContext = createContext<ReceiptContextType | undefined>(undefined);

export function ReceiptProvider({ children }: { children: ReactNode }) {
  const [parsedReceipt, setParsedReceipt] = useState<any | null>(null);

  const clearReceipt = () => setParsedReceipt(null);

  return (
    <ReceiptContext.Provider
      value={{ parsedReceipt, setParsedReceipt, clearReceipt }}
    >
      {children}
    </ReceiptContext.Provider>
  );
}

export function useReceipt() {
  const context = useContext(ReceiptContext);
  if (!context) {
    throw new Error("useReceipt must be used within ReceiptProvider");
  }
  return context;
}
