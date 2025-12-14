import { Router } from "express";
import { checkDemoAccountUsage } from "@/services/demo-account-service";

const demoRouter = Router();

// Demo account access endpoint
// No auth required; uses a shared demo identifier to enforce global limits
demoRouter.get("/", async (_req, res) => {
  // Use a fixed identifier for demo usage tracking
  const DEMO_ID = "DEMO";
  try {
    const result = await checkDemoAccountUsage(DEMO_ID);
    if (result.allowed) {
      res.json({ success: true });
    } else {
      res.status(429).json({ success: false, message: "Usage limit exceeded" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default demoRouter;
