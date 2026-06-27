"use client";

import { useState } from "react";
import type { UserProfile, Recommendation, BallSize } from "@/lib/types";
import { BALL_SIZE_INFO } from "@/lib/types";

const SIZE_COLORS: Record<BallSize, string> = {
  3: "from-sky-500 to-sky-700",
  5: "from-green-500 to-green-700",
  6: "from-violet-500 to-violet-700",
  7: "from-orange-500 to-orange-700",
};

function SizeBar({ score }: { score: number }) {
  return (
    <div className="w-full mt-2">
      <div className="flex justify-between text-xs opacity-60 mb-1">
        <span>Size 3</span>
        <span>Size 5</span>
        <span>Size 6</span>
        <span>Size 7</span>
      </div>
      <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-white/80 transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-right text-xs opacity-60 mt-1">Fit score: {score}/100</p>
    </div>
  );
}

const defaultProfile: UserProfile = {
  age: 16,
  heightCm: 175,
  handSpanCm: 21,
  experience: "intermediate",
  playingType: "indoor",
  position: "guard",
  gender: "male",
};

export default function Home() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
    setResult(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Server error");
      setResult(await res.json());
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12 gap-10">
      {/* Header */}
      <header className="text-center max-w-xl">
        <div className="text-5xl mb-3">🏀</div>
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">BasketFit</h1>
        <p className="text-slate-400 text-lg">
          Stop guessing your basketball size. Get an AI recommendation tailored to your body and game.
        </p>
      </header>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-slate-800 rounded-2xl p-8 shadow-2xl space-y-6"
      >
        <h2 className="text-xl font-semibold text-white">Tell us about yourself</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Age (years)">
            <input
              type="number"
              min={4}
              max={60}
              value={profile.age}
              onChange={(e) => set("age", Number(e.target.value))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
              required
            />
          </Field>
          <Field label="Height (cm)">
            <input
              type="number"
              min={80}
              max={230}
              value={profile.heightCm}
              onChange={(e) => set("heightCm", Number(e.target.value))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
              required
            />
          </Field>
        </div>

        <Field
          label="Hand Span (cm)"
          hint="Measure from tip of thumb to tip of pinky with hand fully spread"
        >
          <input
            type="number"
            min={10}
            max={35}
            step={0.5}
            value={profile.handSpanCm}
            onChange={(e) => set("handSpanCm", Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
            required
          />
        </Field>

        <Field label="Experience level">
          <RadioGroup
            options={[
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ]}
            value={profile.experience}
            onChange={(v) => set("experience", v as UserProfile["experience"])}
          />
        </Field>

        <Field label="Where do you mainly play?">
          <RadioGroup
            options={[
              { value: "street", label: "Street / Outdoor" },
              { value: "indoor", label: "Indoor / Gym" },
              { value: "competitive", label: "Competitive / League" },
            ]}
            value={profile.playingType}
            onChange={(v) => set("playingType", v as UserProfile["playingType"])}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Position (optional)">
            <select
              value={profile.position}
              onChange={(e) => set("position", e.target.value as UserProfile["position"])}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
            >
              <option value="none">Not specified</option>
              <option value="guard">Guard</option>
              <option value="forward">Forward</option>
              <option value="center">Center</option>
            </select>
          </Field>
          <Field label="Gender (optional)">
            <select
              value={profile.gender}
              onChange={(e) => set("gender", e.target.value as UserProfile["gender"])}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Prefer not to say</option>
            </select>
          </Field>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg transition-colors"
        >
          {loading ? "Analysing…" : "Get My Recommendation →"}
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </form>

      {/* Results */}
      {result && <ResultCard result={result} />}

      {/* Size reference table */}
      <SizeReference />
    </main>
  );
}

function ResultCard({ result }: { result: Recommendation }) {
  const info = BALL_SIZE_INFO[result.primarySize];
  const gradient = SIZE_COLORS[result.primarySize];

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-8 text-white shadow-2xl`}>
        <p className="text-sm uppercase tracking-widest font-medium opacity-80 mb-1">Your Recommendation</p>
        <h2 className="text-4xl font-bold mb-1">{info.label}</h2>
        <p className="opacity-80 mb-4">
          {info.circumference} circumference · {info.weight}
        </p>
        <SizeBar score={result.score} />
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 space-y-5">
        <Section title="Why this size?">
          <p className="text-slate-300 leading-relaxed">{result.explanation}</p>
        </Section>

        {result.trainingSize && (
          <Section title="Training tip">
            <p className="text-slate-300 leading-relaxed">
              Drop to a{" "}
              <span className="text-orange-400 font-semibold">
                {BALL_SIZE_INFO[result.trainingSize].label}
              </span>{" "}
              during skill drills. A tighter grip forces better finger-pad control and will make
              your primary ball feel effortless in games.
            </p>
          </Section>
        )}

        <Section title="AI Coach says">
          <blockquote className="border-l-4 border-orange-500 pl-4 text-slate-300 italic leading-relaxed">
            {result.aiCoachMessage}
          </blockquote>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {children}
    </div>
  );
}

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            value === o.value
              ? "bg-orange-500 border-orange-500 text-white"
              : "bg-slate-700 border-slate-600 text-slate-300 hover:border-orange-400"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SizeReference() {
  const sizes: BallSize[] = [3, 5, 6, 7];
  return (
    <section className="w-full max-w-2xl pb-8">
      <h2 className="text-lg font-semibold text-white mb-4">Basketball Size Reference</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sizes.map((s) => {
          const info = BALL_SIZE_INFO[s];
          const gradient = SIZE_COLORS[s];
          return (
            <div key={s} className="bg-slate-800 rounded-xl p-4 flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}
              >
                {s}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{info.label}</p>
                <p className="text-xs text-slate-400">
                  {info.circumference} · {info.weight}
                </p>
                <p className="text-xs text-slate-500 mt-1">{info.audience}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
