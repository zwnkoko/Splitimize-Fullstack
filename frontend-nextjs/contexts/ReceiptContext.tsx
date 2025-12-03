"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Coupon {
  name: string;
  amount: number;
}

export interface GeneratedContent {
  date_time: string;
  items: ReceiptItem[];
  coupons: Coupon[];
  tax: number;
  tips: number;
  subtotal: number;
  total: number;
  payment_method: string;
}

export interface UsageMetaData {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
}

export interface ParsedReceipt {
  generatedContent: GeneratedContent;
  usageMetaData: UsageMetaData;
}

interface ReceiptContextType {
  parsedReceipt: ParsedReceipt | null;
  setParsedReceipt: (data: ParsedReceipt) => void;
  clearReceipt: () => void;
}

const ReceiptContext = createContext<ReceiptContextType | undefined>(undefined);

export function ReceiptProvider({ children }: { children: ReactNode }) {
  const [parsedReceipt, setParsedReceipt] = useState<ParsedReceipt | null>(
    null
  );

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
