import { Request, Response } from "express";
import { IReceiptService } from "@/services/receipt-service";

export const makeExtractTextController = (receiptService: IReceiptService) => {
  return async (req: Request, res: Response) => {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        res.status(400).json({ error: "No files uploaded" });
        return;
      }

      // Extract uploaded files
      const files = req.files as Express.Multer.File[];
      const fileBuffers = files.map((file) => file.buffer);

      const result = await receiptService.processReceiptImages(
        fileBuffers,
        "api"
      );

      res.json(result);
    } catch (error) {
      console.error("Error processing receipt:", error);
      res.status(500).json({ error: "Failed to process receipt" });
    }
  };
};
