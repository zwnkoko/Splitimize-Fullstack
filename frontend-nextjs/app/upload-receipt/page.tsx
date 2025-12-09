"use client";

import { Button } from "@/components/ui/button";
import { FileDropZone } from "@/components/shared/file-drop-zone";
import { useState } from "react";
import { FileImage } from "lucide-react";
import { AuthDialog } from "@/components/shared/auth-dialog";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { FILE_UPLOAD_CONFIG as fileConfig } from "@splitimize/shared";
import { useParseReceipt } from "@/hooks/useParseReceipt";
import { useRouter } from "next/navigation";
import { useReceipt } from "@/contexts/ReceiptContext";
import { compressImage } from "@/lib/image-compression";

export default function UploadReceiptPage() {
  const router = useRouter();
  const { setParsedReceipt } = useReceipt();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const {
    isPending: authPending,
    requireAuth,
    showAuthModal,
    setShowAuthModal,
  } = useAuthGuard();

  const { mutate: parseReceipt, isPending: parsePending } = useParseReceipt();

  const handleFilesChange = async (files: File[]) => {
    // Handle empty array case immediately
    if (files.length === 0) {
      setUploadedFiles([]);
      return;
    }

    try {
      const results = await Promise.allSettled(
        files.map((file) => compressImage(file))
      );

      const successes: File[] = [];
      const failures: { file: File; reason: unknown }[] = [];

      results.forEach((res, i) => {
        if (res.status === "fulfilled") successes.push(res.value);
        else failures.push({ file: files[i], reason: res.reason });
      });

      if (successes.length) setUploadedFiles(successes);

      if (failures.length) {
        const tooLarge = failures.some(
          (f) =>
            f.reason instanceof Error && f.reason.message.includes("under 1MB")
        );
        toast.error(
          successes.length
            ? `${failures.length} file(s) failed to compress${
                tooLarge ? " (too large)" : ""
              }.`
            : "Failed to compress selected images. Please try different files."
        );
      }
    } catch {
      toast.error("Unexpected error while compressing images.");
    }
  };

  const handleSubmit = () => {
    if (authPending) {
      toast.info("Please try again in a few seconds.");
      return;
    }
    requireAuth(async () => {
      if (uploadedFiles.length === 0) {
        toast.error("Please upload at least one file");
        return;
      }

      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append("image", file);
      });
      parseReceipt(formData, {
        onSuccess: (data) => {
          setParsedReceipt(data);
          toast.success("Receipt parsed successfully!");
          router.push("/itemized-list");
        },
        onError: () => {
          toast.error("Failed to scan receipt. Please try again.");
        },
      });
    });
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="size-full flex flex-col justify-center gap-y-4 items-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Splitimize
        </h1>
        <FileDropZone
          accept={fileConfig.allowedMimeTypes}
          maxSize={fileConfig.maxFileSizeInMB * 1024 * 1024}
          maxFiles={fileConfig.maxFiles}
          uploadedFiles={uploadedFiles}
          onFilesChange={handleFilesChange}
          placeholder="Upload Receipt Image"
          description={`Click or Drag & Drop. Max ${fileConfig.maxFileSizeInMB}MB per file`}
          fileIcon={FileImage}
          toastDuration={5000}
        />
        <Button
          className="container"
          onClick={handleSubmit}
          disabled={parsePending}
        >
          {parsePending ? "Scanning receipt..." : "Submit"}
        </Button>
      </div>

      {showAuthModal && (
        <AuthDialog open={showAuthModal} onOpenChange={setShowAuthModal} />
      )}
    </>
  );
}
