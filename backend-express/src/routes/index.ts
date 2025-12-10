import { Router } from "express";
import parseReceipts from "./parse-receipts";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

router.use("/parse-receipts", parseReceipts);

export default router;
