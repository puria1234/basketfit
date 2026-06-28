import type { UserProfile, BallSize, Recommendation } from "./types";
import { BALL_SIZE_INFO } from "./types";

// Returns a raw score 0–100 favouring larger balls, then we map to size
export function computeScore(profile: UserProfile): number {
  let score = 0;

  // Age factor (0-30 pts)
  if (profile.age < 8) score += 0;
  else if (profile.age < 10) score += 8;
  else if (profile.age < 12) score += 15;
  else if (profile.age < 14) score += 20;
  else if (profile.age < 16) score += 25;
  else score += 30;

  // Height factor (0-25 pts)
  if (profile.heightCm < 120) score += 0;
  else if (profile.heightCm < 140) score += 8;
  else if (profile.heightCm < 155) score += 14;
  else if (profile.heightCm < 170) score += 19;
  else if (profile.heightCm < 185) score += 22;
  else score += 25;

  // Hand span factor (0-25 pts)
  if (profile.handSpanCm < 15) score += 0;
  else if (profile.handSpanCm < 18) score += 8;
  else if (profile.handSpanCm < 20) score += 15;
  else if (profile.handSpanCm < 22) score += 20;
  else score += 25;

  // Experience factor (0-10 pts)
  if (profile.experience === "beginner") score += 2;
  else if (profile.experience === "intermediate") score += 6;
  else score += 10;

  // Gender adjustment (affects league standard) (-5 / 0 / +3)
  if (profile.gender === "female") score -= 5;
  else if (profile.gender === "male") score += 3;

  return Math.max(0, Math.min(100, score));
}

export function scoreToSize(score: number): BallSize {
  if (score < 20) return 3;
  if (score < 45) return 5;
  if (score < 68) return 6;
  return 7;
}

export function buildRecommendation(profile: UserProfile): Omit<Recommendation, "aiCoachMessage"> {
  const score = computeScore(profile);
  const primarySize = scoreToSize(score);

  // Training size: one size down from primary for skill development (except if already min)
  const SIZES: BallSize[] = [3, 5, 6, 7];
  const idx = SIZES.indexOf(primarySize);
  const trainingSize: BallSize | null = idx > 0 ? SIZES[idx - 1] : null;

  const info = BALL_SIZE_INFO[primarySize];

  const explanation = [
    `Based on your profile, a **${info.label}** (${info.circumference} circumference, ${info.weight}) is your ideal ball.`,
    `This size is standard for: ${info.audience}.`,
    trainingSize
      ? `For skill-focused training, consider dropping to a **${BALL_SIZE_INFO[trainingSize].label}**. The slightly smaller grip builds better finger-pad control.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return { primarySize, trainingSize, score, sizeLabel: info.label, explanation };
}

export function buildPrompt(profile: UserProfile, rec: Omit<Recommendation, "aiCoachMessage">): string {
  return `You are an expert basketball skills coach. A player has used the BasketFit AI tool and received the following recommendation:

Player profile:
- Age: ${profile.age}
- Height: ${profile.heightCm} cm
- Hand span: ${profile.handSpanCm} cm
- Experience: ${profile.experience}
- Playing context: ${profile.playingType}
- Position: ${profile.position === "none" ? "not specified" : profile.position}
- Gender: ${profile.gender}

Recommendation: ${rec.sizeLabel} (score: ${rec.score}/100)
${rec.trainingSize ? `Training size suggestion: ${BALL_SIZE_INFO[rec.trainingSize].label}` : ""}

Write a short, encouraging 2-3 sentence message (NO markdown, plain text) explaining WHY this size fits their specific profile and one concrete tip for getting the most out of training with it.`;
}
