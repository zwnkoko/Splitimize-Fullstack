export const compressImage = async (file: File): Promise<File> => {
  if (typeof window === "undefined") {
    throw new Error("compressImage must run in the browser");
  }

  let processedFile = file;

  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif");

  if (isHeic) {
    try {
      const mod = await import("heic2any");

      type Heic2Any = (options: {
        blob: Blob;
        toType: string;
        quality: number;
      }) => Promise<Blob | Blob[]>;

      const heic2any =
        (mod as unknown as { default: Heic2Any }).default ??
        (mod as unknown as Heic2Any);

      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });

      const blob = Array.isArray(convertedBlob)
        ? convertedBlob[0]
        : convertedBlob;

      processedFile = new File([blob], file.name.replace(/\.heic$/i, ".jpg"), {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    } catch {
      throw new Error(
        "Failed to convert HEIC image. Please use JPG or PNG format."
      );
    }
  }

  if (processedFile.size <= 1024 * 1024) return processedFile;

  if (!processedFile.type.startsWith("image/")) {
    throw new Error(`File "${processedFile.name}" is not an image`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () =>
        reject(
          new Error(
            `Failed to load image: ${processedFile.name} (type: ${processedFile.type}). This format may not be supported by your browser.`
          )
        );

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        const maxDimension = 1920;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const tryCompress = (quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Compression failed"));
                return;
              }

              const compressedFile = new File(
                [blob],
                processedFile.name.replace(/\.[^/.]+$/, ".jpg"),
                {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                }
              );

              if (compressedFile.size > 1024 * 1024 && quality > 0.3) {
                tryCompress(quality - 0.1);
              } else if (compressedFile.size > 1024 * 1024) {
                reject(new Error("Image too large to compress under 1MB"));
              } else {
                resolve(compressedFile);
              }
            },
            "image/jpeg",
            quality
          );
        };

        tryCompress(0.8);
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(processedFile);
  });
};
