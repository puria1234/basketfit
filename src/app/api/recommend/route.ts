import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { UserProfile } from "@/lib/types";
import { buildRecommendation, buildPrompt } from "@/lib/recommender";

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY ?? "",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function POST(req: NextRequest) {
  const profile: UserProfile = await req.json();

  const partial = buildRecommendation(profile);
  const prompt = buildPrompt(profile, partial);

  let aiCoachMessage = "Train consistently and the right ball will feel like an extension of your hand!";

  try {
    const response = await client.chat.completions.create({
      model: "meta/llama-4-maverick",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 120,
      temperature: 0.7,
    });
    const text = response.choices[0]?.message?.content?.trim();
    if (text) aiCoachMessage = text;
  } catch (err) {
    console.error("AI coach error:", err);
  }

  return NextResponse.json({ ...partial, aiCoachMessage });
}
