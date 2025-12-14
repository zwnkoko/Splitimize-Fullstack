import { API_ENDPOINTS } from "@/config/api";

export async function parseReceipt(formData: FormData) {
  const isDemoMode =
    typeof window !== "undefined" &&
    localStorage.getItem("splitimize_demo") === "true";

  const headers: HeadersInit = {};
  if (isDemoMode) {
    headers["x-demo-mode"] = "true";
  }

  const response = await fetch(API_ENDPOINTS.receipt.extractText, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to parse receipt image");
  }
  return response.json();
}
