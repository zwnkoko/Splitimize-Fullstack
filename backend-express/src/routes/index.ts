import { Router } from "express";
import parseReceipts from "./parse-receipts";
import { FileUploadConfig } from "@splitimize/shared";

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
  const config: FileUploadConfig = {
    allowedMimeTypes: ["image/*"],
    maxFileSizeInMB: 5,
  };

  res.json(config);
});

router.use("/parse-receipts", parseReceipts);

export default router;
