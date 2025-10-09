import { useMutation } from "@tanstack/react-query";
import { parseReceipt } from "@/api/prase-receipt";

export function useParseReceipt() {
  return useMutation({
    mutationFn: parseReceipt,
  });
}
