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
  maxFiles?: number; // Optional: when undefined, no limit
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
  maxFiles,
  placeholder,
  description,
  fileIcon: FileIcon = File,
  disabled = false,
  uploadedFiles = [],
  toastPosition = "top-center",
  toastDuration = 4000,
}: FileUploadProps) {
  const [duplicateFileCount, setDuplicateFileCount] = useState(0);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept,
      maxSize,
      multiple,
      maxFiles,
      disabled,
      onDrop: (acceptedFiles) => {
        // Filter duplicates
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

        const combined = [...uploadedFiles, ...newFiles];

        // Only enforce maxFiles if it's defined
        if (maxFiles !== undefined && combined.length > maxFiles) {
          const limited = combined.slice(0, maxFiles);
          onFilesChange?.(limited);
          toast.error(`You can only upload up to ${maxFiles} files`, {
            // description: `You selected ${combined.length}. ${
            //   combined.length - maxFiles
            // } were skipped.`,
            duration: toastDuration,
          });
        } else {
          onFilesChange?.(combined);
        }
      },
    });

  useEffect(() => {
    if (fileRejections.length > 0) {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          let message = "";
          switch (error.code) {
            case "file-too-large":
              message = `The file exceeds the maximum allowed size (${(
                file.size /
                (1024 * 1024)
              ).toFixed(2)} MB). Maximum: ${(maxSize / (1024 * 1024)).toFixed(
                2
              )} MB.`;
              break;
            case "too-many-files":
              message = maxFiles
                ? `You can upload up to ${maxFiles} ${
                    maxFiles === 1 ? "file" : "files"
                  }.`
                : "Too many files selected.";
              break;
            default:
              message =
                "Unsupported file type. Please upload a valid image format.";
          }

          toast.error(
            `${fileRejections.length} ${
              fileRejections.length === 1 ? "upload" : "uploads"
            } failed`,
            {
              description: message,
              duration: toastDuration,
            }
          );
        });
      });
    }

    if (duplicateFileCount > 0) {
      toast.warning(
        `${duplicateFileCount} duplicate ${
          duplicateFileCount === 1 ? "file" : "files"
        } skipped`,
        {
          description:
            duplicateFileCount === 1
              ? "This file was already uploaded."
              : "These files were already uploaded.",
          duration: toastDuration,
        }
      );
      setDuplicateFileCount(0);
    }
  }, [fileRejections, duplicateFileCount, maxSize, maxFiles, toastDuration]);

  return (
    <div className="container">
      <Toaster position={toastPosition} />
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

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-sm leading-7 [&:not(:first-child)]:mt-6">
            Uploaded files{" "}
            {maxFiles !== undefined
              ? `(${uploadedFiles.length}/${maxFiles})`
              : `(${uploadedFiles.length})`}
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
