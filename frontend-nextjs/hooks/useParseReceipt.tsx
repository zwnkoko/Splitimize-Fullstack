import { useMutation } from "@tanstack/react-query";
import { parseReceipt } from "@/api/parse-receipt";

export function useParseReceipt() {
  return useMutation({
    mutationFn: parseReceipt,
  });
}
