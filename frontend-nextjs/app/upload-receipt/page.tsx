"use client";

import { Button } from "@/components/ui/button";
import { FileDropZone } from "@/components/shared/file-drop-zone";
import { useState } from "react";
import { FileImage, Sparkles, Upload, ArrowRight } from "lucide-react";
import { AuthDialog } from "@/components/shared/auth-dialog";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { FILE_UPLOAD_CONFIG as fileConfig } from "@splitimize/shared";
import { useParseReceipt } from "@/hooks/useParseReceipt";
import { useRouter } from "next/navigation";
import { useReceipt } from "@/contexts/ReceiptContext";
import { compressImage } from "@/lib/image-compression";
import { GlowWrapper } from "@/components/ui/glow-wrapper";
import { Card } from "@/components/ui/card";

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
        formData.append("images", file);
      });
      parseReceipt(formData, {
        onSuccess: (data) => {
          setParsedReceipt(data);
          toast.success("Receipt parsed successfully!");
          router.push("/itemized-list");
        },
        onError: (error: Error) => {
          toast.error(error.message);
        },
      });
    });
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="h-full flex items-center justify-center px-4">
        <div className="w-full max-w-3xl space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                AI-Powered Receipt Scanning
              </span>
            </div>
            <div className="space-y-3">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Upload Your Receipt
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Snap or upload your receipt to get started
              </p>
            </div>
          </div>

          {/* Upload Section */}
          <div className="space-y-6">
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

            <GlowWrapper isGlowing={parsePending} className="w-full">
              <Button
                className="w-full disabled:opacity-100"
                onClick={handleSubmit}
                disabled={parsePending}
                size="lg"
              >
                {parsePending ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-pulse" />
                    Scanning receipt...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </GlowWrapper>
          </div>

          {/* Tips Section */}
          <Card className="p-6 bg-muted/30">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Tips for Best Results
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">•</span>
                <span>Ensure the entire receipt is visible and well-lit</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">•</span>
                <span>Avoid shadows, glare, or blurry images</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">•</span>
                <span>Straighten the receipt for optimal text recognition</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {showAuthModal && (
        <AuthDialog open={showAuthModal} onOpenChange={setShowAuthModal} />
      )}
    </>
  );
}
