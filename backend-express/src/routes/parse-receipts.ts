import { Router } from "express";
import multer from "multer";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "@/constant";
import { extractTextFromImage, geminiProcessOcrText } from "@/utils/ocr";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, cb) => {
    const isAllowed = ALLOWED_FILE_TYPES.some((type) =>
      file.mimetype.startsWith(type)
    );

    if (isAllowed) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Only files of type ${ALLOWED_FILE_TYPES.join(", ")} are allowed`
        )
      );
    }
  },
});

router.post("/extract-text", upload.single("image"), async (req, res) => {
  console.log("Received file:", req.file ? req.file.originalname : "None");
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const imageBuffer = req.file.buffer;
    const text = await extractTextFromImage(imageBuffer);
    const { generatedContent, usageMetaData } = await geminiProcessOcrText(
      text
    );
    res.json({ generatedContent, usageMetaData });
  } catch (error) {
    console.error("Error extracting text:", error);
    res.status(500).json({ error: "Failed to extract text" });
  }
});

export default router;
