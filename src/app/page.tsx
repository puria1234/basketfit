"use client";

import { useState, Suspense, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import type { UserProfile, Recommendation, BallSize } from "@/lib/types";
import { BALL_SIZE_INFO } from "@/lib/types";

const Basketball3D = dynamic(() => import("@/components/Basketball3D"), { ssr: false });

// ─── Shop data ────────────────────────────────────────────────────────────────

const BALL_PICKS: Record<
  BallSize,
  { name: string; tag: string; amazon: string; walmart: string; target: string }[]
> = {
  7: [
    {
      name: "Wilson Evolution Indoor",
      tag: "Best indoor",
      amazon: "https://www.amazon.com/s?k=Wilson+Evolution+Indoor+Basketball+Size+7",
      walmart: "https://www.walmart.com/search?q=Wilson+Evolution+Indoor+Basketball",
      target: "https://www.target.com/s?searchTerm=Wilson+Evolution+Basketball+Size+7",
    },
    {
      name: "Spalding NBA Street",
      tag: "Best outdoor",
      amazon: "https://www.amazon.com/s?k=Spalding+NBA+Street+Basketball+Size+7",
      walmart: "https://www.walmart.com/search?q=Spalding+NBA+Street+Basketball+Size+7",
      target: "https://www.target.com/s?searchTerm=Spalding+NBA+Street+Basketball+Size+7",
    },
  ],
  6: [
    {
      name: "Wilson NCAA Women's",
      tag: "Best overall",
      amazon: "https://www.amazon.com/s?k=Wilson+NCAA+Womens+Basketball+Size+6",
      walmart: "https://www.walmart.com/search?q=Wilson+NCAA+Womens+Basketball+Size+6",
      target: "https://www.target.com/s?searchTerm=Wilson+NCAA+Womens+Basketball+Size+6",
    },
    {
      name: "Spalding NBA Women's",
      tag: "Official game ball",
      amazon: "https://www.amazon.com/s?k=Spalding+NBA+Official+Womens+Basketball+Size+6",
      walmart: "https://www.walmart.com/search?q=Spalding+NBA+Womens+Basketball+Size+6",
      target: "https://www.target.com/s?searchTerm=Spalding+NBA+Womens+Basketball",
    },
  ],
  5: [
    {
      name: "Spalding NBA Youth",
      tag: "Best youth",
      amazon: "https://www.amazon.com/s?k=Spalding+NBA+Youth+Basketball+Size+5",
      walmart: "https://www.walmart.com/search?q=Spalding+NBA+Youth+Basketball+Size+5",
      target: "https://www.target.com/s?searchTerm=Spalding+Youth+Basketball+Size+5",
    },
    {
      name: "Wilson NCAA Youth",
      tag: "Great value",
      amazon: "https://www.amazon.com/s?k=Wilson+NCAA+Replica+Youth+Basketball+Size+5",
      walmart: "https://www.walmart.com/search?q=Wilson+Youth+Basketball+Size+5",
      target: "https://www.target.com/s?searchTerm=Wilson+Youth+Basketball+Size+5",
    },
  ],
  3: [
    {
      name: "Spalding Mini Basketball",
      tag: "Best mini",
      amazon: "https://www.amazon.com/s?k=Spalding+Mini+Basketball+Size+3",
      walmart: "https://www.walmart.com/search?q=Mini+Basketball+Size+3",
      target: "https://www.target.com/s?searchTerm=Mini+Basketball+Size+3",
    },
    {
      name: "Wilson Mini Basketball",
      tag: "Soft grip",
      amazon: "https://www.amazon.com/s?k=Wilson+Mini+Basketball+Size+3",
      walmart: "https://www.walmart.com/search?q=Wilson+Mini+Basketball",
      target: "https://www.target.com/s?searchTerm=Wilson+Mini+Basketball",
    },
  ],
};

const defaultProfile: UserProfile = {
  age: 16,
  heightCm: 175,
  handSpanCm: 21,
  experience: "intermediate",
  playingType: "indoor",
  position: "none",
  gender: "male",
};

// ─── Root page ────────────────────────────────────────────────────────────────

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
      const data = await res.json();
      setResult(data);
      setTimeout(() => {
        document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const ballSize = (result?.primarySize ?? 7) as BallSize;

  return (
    <>
      <Nav />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        {/* Radial glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -55%)",
            filter: "blur(40px)",
          }}
        />

        {/* 3D Ball */}
        <div className="animate-float w-full max-w-sm">
          <Suspense fallback={<div className="h-[340px]" />}>
            <Basketball3D size={ballSize} />
          </Suspense>
        </div>

        {/* Headline */}
        <div className="relative z-10 text-center px-5 -mt-4">
          <h1
            className="text-7xl sm:text-8xl font-black tracking-tighter leading-none animate-fade-up"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #999 45%, #ffffff 70%, #666 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            BASKETFIT
          </h1>
          <p className="mt-4 text-gray-400 text-lg sm:text-xl max-w-md mx-auto leading-relaxed animate-fade-up-delay-1">
            AI-powered basketball size intelligence.<br className="hidden sm:block" />
            Stop guessing. Start playing right.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-fade-up-delay-2">
            <a
              href="#get-started"
              className="px-8 py-4 rounded-2xl font-bold text-base tracking-wide text-black transition-opacity hover:opacity-80"
              style={{ background: "linear-gradient(135deg, #fff 0%, #ccc 100%)" }}
            >
              Find My Size →
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-2xl font-semibold text-base tracking-wide border border-white/20 text-white hover:bg-white/5 transition-colors"
            >
              How it works
            </a>
          </div>
        </div>

        {/* Scroll arrow */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-y">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-white/8 py-6">
        <div className="max-w-3xl mx-auto px-5 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "4", label: "Ball Sizes" },
            { value: "3", label: "Retailers" },
            { value: "AI", label: "Vision Measure" },
            { value: "Free", label: "Forever" },
          ].map((s) => (
            <div key={s.label}>
              <p
                className="text-3xl font-black"
                style={{
                  background: "linear-gradient(135deg, #fff 0%, #888 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {s.value}
              </p>
              <p className="text-gray-600 text-xs uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>What we do</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-14">
            Built different.<br />
            <span style={{ background: "linear-gradient(135deg, #fff 0%, #666 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Built for players.
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FeatureCard
              icon={<TargetIcon />}
              title="Smart Fit Score"
              desc="Our algorithm weighs age, height, hand span, experience and gender to generate a personalised 0–100 fit score mapped to the right size."
            />
            <FeatureCard
              icon={<CameraIcon />}
              title="AI Vision Measure"
              desc="Point your camera at your hand and MiniMax M3 estimates your hand span instantly — no ruler needed."
            />
            <FeatureCard
              icon={<BagIcon />}
              title="Shop Ready"
              desc="Every recommendation comes with direct links to Amazon, Walmart and Target so you can buy the right ball in seconds."
            />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-5 border-t border-white/8">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>The process</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-14">
            Three steps to your<br />
            <span style={{ background: "linear-gradient(135deg, #fff 0%, #666 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              perfect ball.
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { n: "01", title: "Tell us about yourself", desc: "Enter your age, height, hand span and experience. Takes under 30 seconds." },
              { n: "02", title: "Get your AI recommendation", desc: "Our model calculates your fit score and recommends the exact ball size and specific training tips." },
              { n: "03", title: "Buy the right ball", desc: "Click through to Amazon, Walmart or Target and get playing with the correct size today." },
            ].map((step) => (
              <div key={step.n} className="flex flex-col gap-4">
                <span
                  className="text-6xl font-black leading-none"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.04) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                >
                  {step.n}
                </span>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Size reference ── */}
      <section className="py-24 px-5 border-t border-white/8">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>The sizes</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-14">
            Know your<br />
            <span style={{ background: "linear-gradient(135deg, #fff 0%, #666 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              options.
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([3, 5, 6, 7] as BallSize[]).map((s) => {
              const info = BALL_SIZE_INFO[s];
              return (
                <div
                  key={s}
                  className="flex items-start gap-5 p-5 rounded-2xl border border-white/8"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg shrink-0 text-black"
                    style={{ background: "linear-gradient(135deg, #fff 0%, #aaa 100%)" }}
                  >
                    {s}
                  </div>
                  <div>
                    <p className="text-white font-bold">{info.label}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{info.circumference} · {info.weight}</p>
                    <p className="text-gray-600 text-xs mt-1">{info.audience}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── App form ── */}
      <section id="get-started" className="py-24 px-5 border-t border-white/8">
        <div className="max-w-md mx-auto">
          <SectionLabel>Get started</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-10">
            Find your<br />
            <span style={{ background: "linear-gradient(135deg, #fff 0%, #666 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              perfect size.
            </span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <NumInput label="Age" unit="yrs" min={4} max={60} value={profile.age} onChange={(v) => set("age", v)} />
              <NumInput label="Height" unit="cm" min={80} max={230} value={profile.heightCm} onChange={(v) => set("heightCm", v)} />
            </div>

            <HandSpanInput value={profile.handSpanCm} onChange={(v) => set("handSpanCm", v)} />

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Experience</label>
              <SegmentedControl
                options={["beginner", "intermediate", "advanced"]}
                labels={["Beginner", "Intermediate", "Advanced"]}
                value={profile.experience}
                onChange={(v) => set("experience", v as UserProfile["experience"])}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Gender</label>
              <SegmentedControl
                options={["male", "female", "other"]}
                labels={["Male", "Female", "Other"]}
                value={profile.gender}
                onChange={(v) => set("gender", v as UserProfile["gender"])}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-base tracking-widest uppercase disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{
                background: loading ? "#222" : "linear-gradient(135deg, #ffffff 0%, #cccccc 50%, #ffffff 100%)",
                color: loading ? "#555" : "#000",
              }}
            >
              {loading ? "Analysing…" : "Get My Size →"}
            </button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>
        </div>
      </section>

      {/* ── Result ── */}
      {result && (
        <section id="result" className="px-5 pb-24">
          <div className="max-w-md mx-auto">
            <ResultCard result={result} />
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 py-10 px-5 text-center">
        <p
          className="text-2xl font-black tracking-tighter"
          style={{
            background: "linear-gradient(135deg, #fff 0%, #555 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          BASKETFIT
        </p>
        <p className="text-gray-700 text-xs mt-2">AI Basketball Size Recommender · {new Date().getFullYear()}</p>
      </footer>
    </>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4" style={{ backdropFilter: "blur(16px)", background: "rgba(0,0,0,0.7)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <span className="font-black text-lg tracking-tighter" style={{ background: "linear-gradient(135deg, #fff 0%, #888 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        🏀 BASKETFIT
      </span>
      <a
        href="#get-started"
        className="px-4 py-2 rounded-xl text-sm font-bold text-black transition-opacity hover:opacity-80"
        style={{ background: "linear-gradient(135deg, #fff 0%, #ccc 100%)" }}
      >
        Get Started →
      </a>
    </nav>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
      {children}
    </p>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4 border border-white/8 hover:border-white/16 transition-colors"
      style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(8px)" }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
        {icon}
      </div>
      <div>
        <h3 className="text-white font-bold text-base mb-1.5">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function TargetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({ result }: { result: Recommendation }) {
  const info = BALL_SIZE_INFO[result.primarySize];
  const picks = BALL_PICKS[result.primarySize];

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10">
      <div className="p-6" style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2e2e2e 50%, #111 100%)" }}>
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Your Size</p>
        <h2
          className="text-5xl font-black tracking-tight"
          style={{ background: "linear-gradient(180deg, #ffffff 0%, #aaaaaa 50%, #ffffff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
        >
          {info.label}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{info.circumference} circumference · {info.weight}</p>
        <div className="mt-4">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${result.score}%`, background: "linear-gradient(90deg, #555 0%, #ffffff 100%)" }} />
          </div>
          <p className="text-right text-xs text-gray-600 mt-1">Fit score {result.score}/100</p>
        </div>
      </div>

      <div className="p-5 space-y-5 bg-[#0a0a0a]">
        <Block title="Why this size"><p className="text-gray-400 text-sm leading-relaxed">{result.explanation}</p></Block>
        {result.trainingSize && (
          <Block title="Training tip">
            <p className="text-gray-400 text-sm leading-relaxed">
              Use a <span className="text-white font-semibold">{BALL_SIZE_INFO[result.trainingSize].label}</span> for skill drills. The tighter grip builds better finger-pad control.
            </p>
          </Block>
        )}
        <Block title="AI Coach">
          <p className="text-gray-400 text-sm leading-relaxed italic border-l border-white/20 pl-3">{result.aiCoachMessage}</p>
        </Block>
        <Block title="Shop this size">
          <div className="space-y-3">
            {picks.map((pick) => (
              <div key={pick.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-baseline justify-between mb-2">
                  <p className="text-white text-sm font-semibold">{pick.name}</p>
                  <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">{pick.tag}</span>
                </div>
                <div className="flex gap-2">
                  <ShopLink href={pick.amazon} label="Amazon" color="#F90" />
                  <ShopLink href={pick.walmart} label="Walmart" color="#0071CE" />
                  <ShopLink href={pick.target} label="Target" color="#CC0000" />
                </div>
              </div>
            ))}
          </div>
        </Block>
      </div>
    </div>
  );
}

function ShopLink({ href, label, color }: { href: string; label: string; color: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex-1 py-1.5 rounded-lg text-xs font-bold text-center transition-opacity hover:opacity-80"
      style={{ background: color + "22", color, border: `1px solid ${color}44` }}
    >
      {label}
    </a>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">{title}</p>
      {children}
    </div>
  );
}

// ─── Clearable number input ───────────────────────────────────────────────────

function NumInput({ label, unit, min, max, step = 1, value, onChange }: {
  label: string; unit: string; min: number; max: number; step?: number; value: number; onChange: (v: number) => void;
}) {
  const [raw, setRaw] = useState(String(value));
  useEffect(() => { setRaw(String(value)); }, [value]);

  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>
      <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-3 focus-within:border-white/30 transition-colors">
        <input
          type="text"
          inputMode="decimal"
          value={raw}
          onChange={(e) => {
            const s = e.target.value;
            setRaw(s);
            const n = step < 1 ? parseFloat(s) : parseInt(s, 10);
            if (!isNaN(n) && n >= min && n <= max) onChange(n);
          }}
          onBlur={() => {
            const n = step < 1 ? parseFloat(raw) : parseInt(raw, 10);
            if (isNaN(n) || n < min || n > max) setRaw(String(value));
          }}
          className="flex-1 bg-transparent text-white text-lg font-semibold outline-none w-0"
          required
        />
        <span className="text-gray-600 text-xs uppercase tracking-widest shrink-0">{unit}</span>
      </div>
    </div>
  );
}

// ─── Hand span with AI vision ─────────────────────────────────────────────────

function HandSpanInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [raw, setRaw] = useState(String(value));
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [aiResult, setAiResult] = useState<number | null>(null);
  const [visionError, setVisionError] = useState<string | null>(null);

  useEffect(() => { setRaw(String(value)); }, [value]);

  async function handleFile(file: File) {
    setVisionError(null);
    setAiResult(null);
    const dataUrl = await resizeImage(file, 900);
    setPreview(dataUrl);
    setScanning(true);
    try {
      const res = await fetch("/api/measure-hand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: dataUrl.split(",")[1], mimeType: file.type || "image/jpeg" }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setVisionError(data.error ?? "Could not measure hand from photo.");
      } else {
        setAiResult(data.handSpanCm);
        onChange(data.handSpanCm);
      }
    } catch {
      setVisionError("Network error. Please try again.");
    } finally {
      setScanning(false);
    }
  }

  function clearPhoto() {
    setPreview(null); setAiResult(null); setVisionError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs uppercase tracking-widest text-gray-500">Hand Span</label>
        <span className="text-xs text-gray-600">Thumb tip → pinky tip, fully spread</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-3 focus-within:border-white/30 transition-colors">
          <input
            type="text" inputMode="decimal" value={raw}
            onChange={(e) => {
              const s = e.target.value; setRaw(s);
              const n = parseFloat(s);
              if (!isNaN(n) && n >= 10 && n <= 35) { onChange(n); clearPhoto(); }
            }}
            onBlur={() => { const n = parseFloat(raw); if (isNaN(n) || n < 10 || n > 35) setRaw(String(value)); }}
            className="flex-1 bg-transparent text-white text-lg font-semibold outline-none w-0" required
          />
          <span className="text-gray-600 text-xs uppercase tracking-widest shrink-0">cm</span>
        </div>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={scanning} title="Measure with AI camera"
          className="w-14 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/10 disabled:opacity-40 transition-colors">
          {scanning ? <Spinner /> : <CameraIcon />}
        </button>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>

      {preview && (
        <div className="mt-3 rounded-xl overflow-hidden border border-white/10 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Hand" className="w-full max-h-48 object-cover" />
          {scanning && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
              <Spinner large /><p className="text-white text-xs tracking-widest uppercase">AI measuring…</p>
            </div>
          )}
          {!scanning && (
            <button type="button" onClick={clearPhoto}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-gray-400 hover:text-white">✕</button>
          )}
        </div>
      )}

      {aiResult !== null && !scanning && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-xs text-gray-500">AI measured:</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "linear-gradient(90deg,#222,#333)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}>
            {aiResult} cm
          </span>
          <span className="text-xs text-gray-600">· tap to adjust</span>
        </div>
      )}
      {visionError && !scanning && <p className="mt-1.5 text-xs text-red-500">{visionError}</p>}
      {!preview && <p className="mt-1.5 text-xs text-gray-700">Tip: lay a ruler beside your hand for the most accurate AI measurement</p>}
    </div>
  );
}

function Spinner({ large = false }: { large?: boolean }) {
  const s = large ? 24 : 16;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" className="animate-spin text-gray-300">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeDashoffset="10" />
    </svg>
  );
}

function resizeImage(file: File, maxPx: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function SegmentedControl({ options, labels, value, onChange }: {
  options: string[]; labels: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1 bg-white/[0.04] border border-white/10 rounded-xl p-1">
      {options.map((opt, i) => (
        <button key={opt} type="button" onClick={() => onChange(opt)}
          className="flex-1 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all"
          style={value === opt ? { background: "linear-gradient(135deg,#fff 0%,#ccc 100%)", color: "#000" } : { color: "#555" }}>
          {labels[i]}
        </button>
      ))}
    </div>
  );
}
