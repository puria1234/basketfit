import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENMODEL_API_KEY ?? "",
  baseURL: "https://api.openmodel.ai/v1",
});

const PROMPT = `You are an expert at measuring hands from photos.

Estimate the hand span in centimeters: the distance from the tip of the thumb to the tip of the little finger when the hand is fully spread open.

If a reference object is visible (credit card = 8.56 cm wide, standard ruler, coin etc.), use it to calibrate your measurement. Otherwise estimate from typical adult/youth proportions.

Reply with ONLY a single decimal number. Nothing else. Example: 21.5`;

export async function POST(req: NextRequest) {
  const { imageBase64, mimeType } = await req.json() as { imageBase64: string; mimeType: string };

  if (!process.env.OPENMODEL_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 503 });
  }

  try {
    const response = await client.responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_image",
              image_url: `data:${mimeType};base64,${imageBase64}`,
              detail: "high",
            },
            {
              type: "input_text",
              text: PROMPT,
            },
          ],
        },
      ],
    });

    const chunks: string[] = [];
    for (const block of response.output ?? []) {
      if (block.type !== "message" || !("content" in block)) continue;
      for (const part of block.content) {
        if (part.type === "output_text") chunks.push(part.text);
      }
    }
    const raw = chunks.join(" ").trim();
    const handSpanCm = parseFloat(raw);

    if (isNaN(handSpanCm) || handSpanCm < 10 || handSpanCm > 35) {
      return NextResponse.json({ error: "Could not read a hand span from the image. Try a clearer photo with your hand fully spread." }, { status: 422 });
    }

    // Round to nearest 0.5 cm
    return NextResponse.json({ handSpanCm: Math.round(handSpanCm * 2) / 2 });
  } catch (err) {
    console.error("Vision error:", err);
    return NextResponse.json({ error: "Vision analysis failed" }, { status: 500 });
  }
}
