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

/**
 * Processes OCR text using Gemini to extract structured receipt data.
 * @param text - The OCR extracted text from a receipt.
 * @returns The parsed receipt data and usage metadata.
 */
export const geminiProcessOcrText = async (
  text: string
): Promise<{ generatedContent: object; usageMetaData: object }> => {
  let usageMetaData = {};
  const ai = new GoogleGenAI({});

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
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

    // Generated content from Gemini always come as a string, so parse it to JSON
    const generatedContent = JSON.parse(generatedContentString);

    return { generatedContent, usageMetaData };
  } catch (error) {
    throw new Error("Failed to process OCR text.");
  }
};
