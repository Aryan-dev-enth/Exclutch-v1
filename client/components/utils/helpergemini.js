import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY});

export async function generateTitleAndDescriptionFromPDF(url) {
  const pdfResp = await fetch(url)
        .then((response) => response.arrayBuffer());

    const contents = [
        { text: "Summarize this document in 30 words with tags that would help it in future searching." },
        {
            inlineData: {
                mimeType: 'application/pdf',
                data: Buffer.from(pdfResp).toString("base64")
            }
        }
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: contents
    });
    
    return response.text
}
