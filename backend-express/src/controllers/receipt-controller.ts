import { Request, Response } from "express";
import { IReceiptService } from "@/services/receipt-service";
import {
  isDemoUsageAllowed,
  incrementDemoUsage,
} from "@/services/demo-account-service";

export const makeExtractTextController = (receiptService: IReceiptService) => {
  return async (req: Request, res: Response) => {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        res.status(400).json({ error: "No files uploaded" });
        return;
      }

      // Check demo usage limits if in demo mode
      const user = (req as any).user;
      if (user?.isDemo) {
        const DEMO_ID = "DEMO";
        const allowed = await isDemoUsageAllowed(DEMO_ID);
        if (!allowed) {
          res
            .status(429)
            .json({ error: "Demo usage limit exceeded. Reset in an hour." });
          return;
        }
      }

      // Extract uploaded files
      const files = req.files as Express.Multer.File[];
      const fileBuffers = files.map((file) => file.buffer);

      const result = await receiptService.processReceiptImages(
        fileBuffers,
        "api"
      );

      // Increment demo usage after successful parse if in demo mode
      if (user?.isDemo) {
        await incrementDemoUsage("DEMO");
      }

      res.json(result);
    } catch (error) {
      console.error("Error processing receipt:", error);
      res.status(500).json({ error: "Failed to process receipt" });
    }
  };
};
