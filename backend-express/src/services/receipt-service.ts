import { createWorker } from "tesseract.js";
import { GoogleGenAI } from "@google/genai";

const RECEIPT_PARSING_INSTRUCTION = `You will receive OCR output of a receipt. 
Your only task is to return an itemized list in JSON format, following the structure exactly as shown in the example. 
Do not include any extra text, explanation, or commentary.
Do not write "Here is the JSON" or anything else. 
The Response JSON must exactly match the format below: 
{
  "date_time": "2017-07-28T02:39:48",
  "items": [
      {"name": "PET TOY", "price": 1.97, "quantity": 1},
      {"name": "FLOPPY PUPPY", "price": 1.97, "quantity": 1},
      {"name": "PED PCH", "price": 0.50, "quantity": 2}
  ],
  "coupons": [
      {"applied_to": "PED PCH 1", "amount": 1.00, "description": "COUPON 23100"},
      {"applied_to": "STKO SUNFLWR", "amount": 0.50, "description": "COUPON 23101"},
      {"applied_to": "STKO SUNFLWR", "amount": 0.25, "description": "COUPON 23102"}
  ]
  "tax": 4.59,
  "tips": 0.00,
  "subtotal": 93.62,
  "total": 98.21,
  "payment_method": "VISA Debit"
}`;

export interface IReceiptService {
  processReceiptImages: (
    fileBuffers: Buffer[],
    ocrMode: "offline" | "api"
  ) => Promise<any>;
}

export class ReceiptService implements IReceiptService {
  public async processReceiptImages(
    fileBuffers: Buffer[],
    ocrMode: "offline" | "api"
  ) {
    let textResults: string[] = [];

    if (ocrMode === "api") {
      textResults = await Promise.all(
        fileBuffers.map((buffer) => this.extractTextFromImageApi(buffer))
      );
    } else if (ocrMode === "offline") {
      textResults = await Promise.all(
        fileBuffers.map((buffer) => this.extractTextFromImage(buffer))
      );
    } else {
      throw new Error("Invalid OCR mode specified.");
    }

    const mergedText = textResults.join("\n\n");

    const { generatedContent, usageMetaData } = await this.geminiProcessOcrText(
      mergedText
    );

    return { generatedContent, usageMetaData };
  }

  /**
   * Extracts text using OCR.space API
   */
  private async extractTextFromImageApi(imageBuffer: Buffer): Promise<string> {
    const formData = new FormData();

    const blob = new Blob([imageBuffer as unknown as BlobPart]);
    formData.append("file", blob, "receipt.jpg");
    //formData.append("language", "eng");

    const apiKey = process.env.OCR_SPACE_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OCR_SPACE_API_KEY is not defined in environment variables."
      );
    }

    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        apikey: apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`OCR API request failed: ${response.statusText}`);
    }

    const data = (await response.json()) as any;

    if (data.IsErroredOnProcessing) {
      throw new Error(data.ErrorMessage?.[0] || "OCR API processing error");
    }

    // OCR.space returns an array of parsed results
    return data.ParsedResults?.[0]?.ParsedText || "";
  }

  /**
   * Extracts text from an image buffer using Tesseract.js OCR.
   */
  private async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
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
  }

  /**
   * Processes OCR text using Gemini to extract structured receipt data.
   */
  private async geminiProcessOcrText(
    text: string
  ): Promise<{ generatedContent: object; usageMetaData: object }> {
    let usageMetaData = {};

    const ai = new GoogleGenAI({});

    try {
      const response = await ai.models.generateContent({
        //model: "gemini-flash-lite-latest",
        model: "gemini-2.5-flash",
        contents: text,
        config: {
          systemInstruction: RECEIPT_PARSING_INSTRUCTION,
        },
      });

      if (response.usageMetadata) {
        const { promptTokensDetails, ...metaData } = response.usageMetadata;
        usageMetaData = metaData;
      }

      const generatedContentString =
        response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      // If the model wrapped the JSON in Markdown code fences, extract inner JSON.
      const fencedMatch = generatedContentString.match(
        /```(?:json)?\s*([\s\S]*?)\s*```/i
      );
      const cleanJsonString = fencedMatch
        ? fencedMatch[1].trim()
        : generatedContentString.replace(/(^`+|`+$)/g, "").trim();

      const generatedContent = JSON.parse(cleanJsonString);

      return { generatedContent, usageMetaData };
    } catch (error) {
      console.error("Error processing OCR text with Gemini:", error);
      throw new Error("Failed to process OCR text.");
    }
  }
}
