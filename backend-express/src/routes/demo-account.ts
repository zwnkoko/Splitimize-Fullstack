import { Router } from "express";

const demoRouter = Router();

// Demo account access endpoint
// Allows entry to demo mode; actual usage limits are tracked on /parse-receipts
demoRouter.get("/", async (_req, res) => {
  try {
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default demoRouter;
