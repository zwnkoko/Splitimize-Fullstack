"use client";

import { Button } from "@/components/ui/button";
import { FileDropZone } from "@/components/shared/file-drop-zone";
import { useState } from "react";
import { FileImage } from "lucide-react";
import { AuthDialog } from "@/components/shared/auth-dialog";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { apiRoutes } from "@/lib/api-routes";

export default function UploadReceiptPage() {
  const maxMB = 10;
  // hold uploaded receipts
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Auth guard
  const { isPending, requireAuth, showAuthModal, setShowAuthModal } =
    useAuthGuard();

  const handleSubmit = () => {
    // if authentication pending, do not allow submission
    if (isPending) {
      toast.info("Please try again in a few seconds.");
      return;
    }
    requireAuth(() => {
      if (uploadedFiles.length > 0) {
        // Handle file submission logic here
        console.log("Files submitted:", uploadedFiles);
        //setUploadedFiles([]); // Clear the uploaded files after submission
      } else {
        toast("Please upload at least one file");
      }
    });
  };
  return (
    <>
      <div className="size-full flex flex-col justify-center gap-y-4 items-center">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
          Upload Receipts
        </h1>
        <FileDropZone
          accept={{ "image/*": [] }}
          maxSize={maxMB * 1024 * 1024} // 10MB
          uploadedFiles={uploadedFiles}
          onFilesChange={(files: File[]) => {
            setUploadedFiles(files);
          }}
          placeholder="Drop receipts or click to upload"
          description={`Max ${maxMB}MB per file`}
          fileIcon={FileImage}
          toastDuration={5000}
        />
        <Button className="container" onClick={handleSubmit}>
          Submit
        </Button>
      </div>

      {showAuthModal && (
        <AuthDialog open={showAuthModal} onOpenChange={setShowAuthModal} />
      )}
    </>
  );
}
