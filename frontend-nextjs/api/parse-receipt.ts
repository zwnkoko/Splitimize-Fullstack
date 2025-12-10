import { API_ENDPOINTS } from "@/config/api";

export async function parseReceipt(formData: FormData) {
  const response = await fetch(API_ENDPOINTS.receipt.extractText, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to parse receipt image");
  }
  return response.json();
}
