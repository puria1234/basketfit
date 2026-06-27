export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type PlayingType = "street" | "indoor" | "competitive";
export type Position = "guard" | "forward" | "center" | "none";
export type Gender = "male" | "female" | "other";

export interface UserProfile {
  age: number;
  heightCm: number;
  handSpanCm: number;
  experience: ExperienceLevel;
  playingType: PlayingType;
  position: Position;
  gender: Gender;
}

export type BallSize = 3 | 5 | 6 | 7;

export interface Recommendation {
  primarySize: BallSize;
  trainingSize: BallSize | null;
  score: number;
  sizeLabel: string;
  explanation: string;
  aiCoachMessage: string;
}

export const BALL_SIZE_INFO: Record<BallSize, { label: string; circumference: string; weight: string; audience: string }> = {
  3: {
    label: "Size 3 (Mini)",
    circumference: "22\"",
    weight: "10 oz",
    audience: "Young children (under 8)",
  },
  5: {
    label: "Size 5 (Youth)",
    circumference: "27.5\"",
    weight: "17 oz",
    audience: "Youth players (ages 9–11)",
  },
  6: {
    label: "Size 6 (Intermediate)",
    circumference: "28.5\"",
    weight: "20 oz",
    audience: "Women / boys ages 12–14",
  },
  7: {
    label: "Size 7 (Official)",
    circumference: "29.5\"",
    weight: "22 oz",
    audience: "Men / high school and above",
  },
};
