import { Router } from "express";
import { imageMiddleware } from "@/middleware/image-middleware";
import { makeExtractTextController } from "@/controllers/receipt-controller";
import { ReceiptService } from "@/services/receipt-service";

const router = Router();

const receiptService = new ReceiptService();
const extractTextController = makeExtractTextController(receiptService);

router.post(
  "/extract-text",
  imageMiddleware.array("images"),
  extractTextController
);

export default router;
