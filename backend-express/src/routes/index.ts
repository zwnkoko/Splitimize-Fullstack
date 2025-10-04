import { Router } from "express";
import parseReceipts from "./parse-receipts";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "@/constant";
const router = Router();

router.get("/", (_req, res) => {
  res.json({
    message:
      "Welcome to Splitimize API. Visit 'https://splitimize.netlify.app' to try out the features.",
  });
});

router.get("/health", (_req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

router.get("/allowed-files", (_req, res) => {
  res.json({
    maxFileSize: `${MAX_FILE_SIZE} BYTES`,
    allowedFileTypes: ALLOWED_FILE_TYPES,
  });
});

router.use("/parse-receipts", parseReceipts);

export default router;
