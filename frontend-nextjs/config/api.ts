const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  health: `${BASE_URL}/api/health`,
  demoAccount: `${BASE_URL}/demo-account`,
  receipt: {
    extractText: `${BASE_URL}/api/parse-receipts/extract-text`,
  },
};
