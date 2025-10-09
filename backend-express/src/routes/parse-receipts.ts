import { Router } from "express";
import multer from "multer";
import { FILE_UPLOAD_CONFIG as fileConfig } from "@splitimize/shared";
import { extractTextFromImage, geminiProcessOcrText } from "@/utils/ocr";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: fileConfig.maxFileSizeInMB * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const matchesPattern = (pattern: string, mimetype: string) => {
      if (pattern === mimetype) return true;
      if (pattern.endsWith("/*")) {
        const prefix = pattern.slice(0, pattern.indexOf("/"));
        return mimetype.startsWith(prefix + "/");
      }
      return false;
    };

    const isAllowed = Object.keys(fileConfig.allowedMimeTypes).some((type) =>
      matchesPattern(type, file.mimetype)
    );

    if (isAllowed) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Only files of type ${Object.keys(fileConfig.allowedMimeTypes).join(
            ", "
          )} are allowed`
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
