import { z } from "zod";

export const FileUploadConfigSchema = z.object({
  allowedMimeTypes: z.record(z.string(), z.array(z.string())),
  maxFileSizeInMB: z.literal(5),
});

export type FileUploadConfig = z.infer<typeof FileUploadConfigSchema>;

export const FILE_UPLOAD_CONFIG = FileUploadConfigSchema.parse({
  allowedMimeTypes: { "image/*": [] },
  maxFileSizeInMB: 5,
} as const);
