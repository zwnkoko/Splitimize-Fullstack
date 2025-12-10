import { createWorker } from "tesseract.js";

/**
 * Extracts text from an image buffer using Tesseract.js OCR.
 * @param imageBuffer - The buffer of the image to process.
 * @returns The extracted text from the image.
 */
export const extractTextFromImage = async (
  imageBuffer: Buffer
): Promise<string> => {
  const worker = await createWorker("eng");
  try {
    const ret = await worker.recognize(imageBuffer);
    return ret.data.text;
  } catch (error) {
    console.error("Error recognizing image:", error);
    throw error;
  } finally {
    await worker.terminate();
  }
};
