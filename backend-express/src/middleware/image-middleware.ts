import multer from "multer";
import { FILE_UPLOAD_CONFIG as fileConfig } from "@splitimize/shared";

export const imageMiddleware = multer({
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
