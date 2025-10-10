"use client";

import { useDropzone } from "react-dropzone";
import { Upload, X, File, LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

/**
 * A reusable file upload component with drag & drop functionality
 *
 * Features:
 * - Drag & drop file upload with visual feedback
 * - File type and size validation
 * - Duplicate file detection and prevention
 * - Real-time toast notifications for errors/warnings
 * - File preview with removal capability
 *
 * @example
 * ```tsx
 * <FileDropZone
 *   accept={{ "image/*": [] }}
 *   maxSize={5 * 1024 * 1024}
 *   onFilesChange={(files) => setFiles(files)}
 *   placeholder="Upload screenshots"
 *   description="Max 5MB per file"
 *   fileIcon={FileImage}
 *   multiple={true}
 * />
 * ```
 */

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  accept: Record<string, string[]>;
  maxSize: number;
  multiple?: boolean;
  placeholder: string;
  description: string;
  fileIcon?: LucideIcon;
  disabled?: boolean;
  uploadedFiles: File[];
  toastPosition?: "top-center" | "top-left" | "top-right" | "bottom-center";
  toastDuration?: number;
}

export function FileDropZone({
  onFilesChange,
  accept,
  maxSize,
  multiple = true,
  placeholder,
  description,
  fileIcon: FileIcon = File,
  disabled = false,
  uploadedFiles = [],
  toastPosition = "top-center",
  toastDuration = 4000,
}: FileUploadProps) {
  const [duplicateFileCount, setDuplicateFileCount] = useState(0); // Move to state

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept: accept,
      maxSize: maxSize,
      multiple: multiple,
      disabled: disabled,
      onDrop: (acceptedFiles) => {
        // Check for duplicates against files from props
        const newFiles = acceptedFiles.filter(
          (newFile) =>
            !uploadedFiles.some(
              (existingFile) =>
                existingFile.name === newFile.name &&
                existingFile.size === newFile.size &&
                existingFile.lastModified === newFile.lastModified
            )
        );

        const duplicateCount = acceptedFiles.length - newFiles.length;
        setDuplicateFileCount(duplicateCount);

        onFilesChange?.([...uploadedFiles, ...newFiles]);
      },
    });

  // Show toast notifications for file rejections
  useEffect(() => {
    if (fileRejections.length > 0) {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          const message =
            error.code === "file-too-large"
              ? `The file exceeds the maximum allowed size (${(
                  file.size /
                  (1024 * 1024)
                ).toFixed(2)} MB). Maximum: ${(maxSize / (1024 * 1024)).toFixed(
                  2
                )} MB.`
              : `Unsupported file type. Please upload a valid image format.`;

          toast.error(`${fileRejections.length} upload(s) failed`, {
            description: message,
            duration: toastDuration,
          });
        });
      });
    }

    if (duplicateFileCount > 0) {
      toast.warning(`${duplicateFileCount} duplicate file(s) skipped`, {
        description: "This file was already uploaded and was skipped.",
        duration: toastDuration,
      });

      // Reset the count after showing toast
      setDuplicateFileCount(0);
    }
  }, [fileRejections, duplicateFileCount, maxSize, toastDuration]);

  return (
    <div className="container">
      {/* Toast Notifications for file rejection errors*/}
      <Toaster position={toastPosition} />

      {/* File Drop Zone */}
      <div
        {...getRootProps({
          className: `border-2 border-dashed p-8 text-center hover:border-neutral-500 transition-colors rounded-lg ${
            isDragActive && "border-blue-500 bg-blue-50 dark:bg-blue-950"
          } ${disabled ? "opacity-50 cursor-not-allowed" : " cursor-pointer"}`,
        })}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto  text-neutral-500" />
        <p className="text-lg leading-7 [&:not(:first-child)]:mt-6 font-medium">
          {placeholder}
        </p>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      </div>

      {/* File Preview */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-sm leading-7 [&:not(:first-child)]:mt-6">
            Uploaded files ({uploadedFiles.length})
          </p>
          <ul className="mt-4 space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg"
              >
                <FileIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm leading-7 [&:not(:first-child)]:mt-6">
                    {file.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newFiles = uploadedFiles.filter(
                      (_, i) => i !== index
                    );
                    onFilesChange?.(newFiles);
                  }}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
