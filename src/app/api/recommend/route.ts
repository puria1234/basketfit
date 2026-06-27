import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { UserProfile } from "@/lib/types";
import { buildRecommendation, buildPrompt } from "@/lib/recommender";

const client = new OpenAI({
  apiKey: process.env.OPENMODEL_API_KEY ?? "",
  baseURL: "https://api.openmodel.ai/v1",
});

export async function POST(req: NextRequest) {
  const profile: UserProfile = await req.json();

  const partial = buildRecommendation(profile);
  const prompt = buildPrompt(profile, partial);

  let aiCoachMessage = "Train consistently and the right ball will feel like an extension of your hand!";

  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });
    // The Responses API returns output as an array of content blocks
    const chunks: string[] = [];
    for (const block of response.output ?? []) {
      if (block.type !== "message" || !("content" in block)) continue;
      for (const part of block.content) {
        if (part.type === "output_text") chunks.push(part.text);
      }
    }
    const text = chunks.join(" ").trim();
    if (text) aiCoachMessage = text;
  } catch (err) {
    console.error("AI coach error:", err);
  }

  return NextResponse.json({ ...partial, aiCoachMessage });
}
