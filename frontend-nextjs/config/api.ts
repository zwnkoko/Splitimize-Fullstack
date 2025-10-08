const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  health: `${BASE_URL}/api/health`,
  allowedFiles: `${BASE_URL}/api/allowed-files`,
  receipt: {
    extractText: `${BASE_URL}/api/parse-receipts/extract-text`,
  },
};
