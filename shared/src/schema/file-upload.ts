import { z } from "zod";

export const FileUploadConfigSchema = z.object({
  allowedMimeTypes: z.array(z.string().min(1)),
  maxFileSizeInMB: z.number().positive(),
});

export type FileUploadConfig = z.infer<typeof FileUploadConfigSchema>;
