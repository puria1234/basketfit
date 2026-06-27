import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY ?? "",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

const PROMPT = `You are an expert at measuring hands from photos.

Estimate the hand span in centimeters: the distance from the tip of the thumb to the tip of the little finger when the hand is fully spread open.

If a reference object is visible (credit card = 8.56 cm wide, standard ruler, coin etc.), use it to calibrate your measurement. Otherwise estimate from typical adult/youth proportions.

Reply with ONLY a single decimal number. Nothing else. Example: 21.5`;

export async function POST(req: NextRequest) {
  const { imageBase64, mimeType } = await req.json() as { imageBase64: string; mimeType: string };

  if (!process.env.NVIDIA_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 503 });
  }

  try {
    const response = await client.chat.completions.create({
      model: "minimaxai/minimax-m3",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${imageBase64}`,
              },
            },
            {
              type: "text",
              text: PROMPT,
            },
          ],
        },
      ],
      max_tokens: 16,
      temperature: 0,
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? "";
    const handSpanCm = parseFloat(raw);

    if (isNaN(handSpanCm) || handSpanCm < 10 || handSpanCm > 35) {
      return NextResponse.json(
        { error: "Could not read a hand span from the image. Try a clearer photo with your hand fully spread." },
        { status: 422 }
      );
    }

    return NextResponse.json({ handSpanCm: Math.round(handSpanCm * 2) / 2 });
  } catch (err) {
    console.error("Vision error:", err);
    return NextResponse.json({ error: "Vision analysis failed" }, { status: 500 });
  }
}
