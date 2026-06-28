"use client";

import { useState, Suspense, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import type { UserProfile, Recommendation, BallSize } from "@/lib/types";
import { BALL_SIZE_INFO } from "@/lib/types";

const Basketball3D = dynamic(() => import("@/components/Basketball3D"), { ssr: false });

// ─── Product data ────────────────────────────────────────────────────────────

const BALL_PICKS: Record<
  BallSize,
  { name: string; tag: string; price: string; desc: string; amazon: string; walmart: string; target: string }[]
> = {
  7: [
    {
      name: "Wilson Evolution Indoor",
      tag: "Editor's Pick",
      price: "~$60",
      desc: "Microfiber composite cover with cushion core — the most played indoor game ball in America.",
      amazon: "https://www.amazon.com/s?k=Wilson+Evolution+Indoor+Basketball+Official+29.5+Size+7",
      walmart: "https://www.walmart.com/search?q=Wilson+Evolution+Indoor+Basketball+29.5",
      target: "https://www.target.com/s?searchTerm=Wilson+Evolution+Basketball+29.5+Size+7",
    },
    {
      name: "Spalding NBA Street Outdoor",
      tag: "Best for outdoor",
      price: "~$30",
      desc: "NBA-licensed rubber cover built for concrete and asphalt. Durable all-season grip.",
      amazon: "https://www.amazon.com/s?k=Spalding+NBA+Street+Basketball+29.5+Size+7+Outdoor",
      walmart: "https://www.walmart.com/search?q=Spalding+NBA+Street+Basketball+29.5+Outdoor",
      target: "https://www.target.com/s?searchTerm=Spalding+NBA+Street+Basketball+Size+7",
    },
  ],
  6: [
    {
      name: "Wilson NCAA Women's",
      tag: "Editor's Pick",
      price: "~$45",
      desc: "Official women's composite ball. Used in college programs across the country.",
      amazon: "https://www.amazon.com/s?k=Wilson+NCAA+Womens+Basketball+Size+6+28.5+Composite",
      walmart: "https://www.walmart.com/search?q=Wilson+NCAA+Womens+Basketball+28.5+Size+6",
      target: "https://www.target.com/s?searchTerm=Wilson+NCAA+Womens+Basketball+Size+6",
    },
    {
      name: "Spalding NBA Women's",
      tag: "Official game ball",
      price: "~$40",
      desc: "WNBA official size and weight. Premium pebbled composite for a consistent feel.",
      amazon: "https://www.amazon.com/s?k=Spalding+NBA+Womens+Basketball+28.5+Official",
      walmart: "https://www.walmart.com/search?q=Spalding+NBA+Womens+Basketball+28.5",
      target: "https://www.target.com/s?searchTerm=Spalding+NBA+Womens+Basketball",
    },
  ],
  5: [
    {
      name: "Wilson NCAA Youth",
      tag: "Editor's Pick",
      price: "~$25",
      desc: "27.5\" soft composite cover ideal for ages 9–11. Easy to grip and control.",
      amazon: "https://www.amazon.com/s?k=Wilson+NCAA+Youth+Basketball+27.5+Size+5",
      walmart: "https://www.walmart.com/search?q=Wilson+Youth+Basketball+27.5+Size+5",
      target: "https://www.target.com/s?searchTerm=Wilson+Youth+Basketball+27.5+Size+5",
    },
    {
      name: "Spalding NBA Youth",
      tag: "Great value",
      price: "~$20",
      desc: "Official NBA youth rec ball. Rubber construction works indoors and outdoors.",
      amazon: "https://www.amazon.com/s?k=Spalding+NBA+Youth+Basketball+Size+5+27.5",
      walmart: "https://www.walmart.com/search?q=Spalding+NBA+Youth+Basketball+Size+5",
      target: "https://www.target.com/s?searchTerm=Spalding+Youth+Basketball+Size+5",
    },
  ],
  3: [
    {
      name: "Wilson Mini Basketball",
      tag: "Editor's Pick",
      price: "~$15",
      desc: "Soft rubber mini ball for ages 4–8. Lightweight design perfect for small hands.",
      amazon: "https://www.amazon.com/s?k=Wilson+Mini+Basketball+Size+3+Youth+Beginner",
      walmart: "https://www.walmart.com/search?q=Wilson+Mini+Basketball+Size+3",
      target: "https://www.target.com/s?searchTerm=Wilson+Mini+Basketball+Size+3",
    },
    {
      name: "Spalding Mini Basketball",
      tag: "Great value",
      price: "~$12",
      desc: "Durable rubber construction for young beginners. A perfect first basketball.",
      amazon: "https://www.amazon.com/s?k=Spalding+Mini+Basketball+Size+3+Youth",
      walmart: "https://www.walmart.com/search?q=Mini+Basketball+Size+3+Spalding",
      target: "https://www.target.com/s?searchTerm=Mini+Basketball+Size+3",
    },
  ],
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultProfile: UserProfile = {
  age: 16,
  heightCm: 175,
  handSpanCm: 21,
  experience: "intermediate",
  playingType: "indoor",
  position: "none",
  gender: "male",
};

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── Inline markdown renderer ─────────────────────────────────────────────────

function InlineText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} className="text-white font-semibold">{part}</strong>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

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
        {/* Grid bg */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }} />

        {/* Orange glow orb */}
        <div className="absolute pointer-events-none animate-orb-1" style={{
          width: 520, height: 520, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 65%)",
          top: "8%", left: "calc(50% - 260px)",
          filter: "blur(55px)",
        }} />

        {/* Secondary glow */}
        <div className="absolute pointer-events-none animate-orb-2" style={{
          width: 280, height: 280, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,200,80,0.06) 0%, transparent 70%)",
          top: "45%", left: "15%",
          filter: "blur(70px)",
        }} />

        {/* 3D Ball */}
        <div className="animate-float w-full max-w-[280px] relative z-10">
          <Suspense fallback={<div className="h-[320px]" />}>
            <Basketball3D size={ballSize} />
          </Suspense>
        </div>

        {/* Headline */}
        <div className="relative z-10 text-center px-5 -mt-2">
          <p className="text-xs uppercase tracking-[0.35em] font-semibold mb-3 animate-fade-up" style={{ color: "#F97316" }}>
            AI-Powered · Free Forever
          </p>
          <h1
            className="font-display leading-[0.88] animate-fade-up-delay-1"
            style={{
              fontSize: "clamp(84px, 16vw, 200px)",
              background: "linear-gradient(180deg, #ffffff 0%, #d8d8d8 30%, #ffffff 60%, #999 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            BASKETFIT
          </h1>
          <p className="mt-5 text-gray-500 text-base sm:text-lg max-w-sm mx-auto leading-relaxed animate-fade-up-delay-2">
            Know your size before you buy.<br className="hidden sm:block" />
            Powered by AI vision and smart fitting.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-fade-up-delay-3">
            <a
              href="#get-started"
              className="px-8 py-4 rounded-2xl font-bold text-sm tracking-wide text-white transition-all hover:brightness-110 active:scale-95"
              style={{ background: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)" }}
            >
              Find My Size →
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-2xl font-semibold text-sm text-white hover:bg-white/5 transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.12)" }}
            >
              How it works
            </a>
          </div>
        </div>

        {/* Scroll arrow */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-y">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="py-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-3xl mx-auto px-5 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "4", label: "Ball Sizes" },
            { value: "3", label: "Retailers" },
            { value: "AI", label: "Vision Measure" },
            { value: "Free", label: "Forever" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl" style={{ color: "#F97316" }}>{s.value}</p>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <SectionLabel>What we do</SectionLabel>
            <h2 className="font-display mt-3 mb-14" style={{ fontSize: "clamp(44px, 8vw, 88px)", lineHeight: 0.92 }}>
              BUILT DIFFERENT.<br />
              <span style={{ color: "#F97316" }}>BUILT FOR PLAYERS.</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <TargetIcon />,
                title: "Smart Fit Score",
                desc: "Our algorithm weighs age, height, hand span, experience and gender to generate a personalised 0–100 fit score mapped to the right size.",
              },
              {
                icon: <CameraIcon />,
                title: "AI Vision Measure",
                desc: "Point your camera at your hand with a ruler and MiniMax M3 estimates your hand span in seconds — no measuring tape needed.",
              },
              {
                icon: <BagIcon />,
                title: "Shop Ready",
                desc: "Every recommendation links directly to Amazon, Walmart and Target with curated picks and estimated prices.",
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 90} className="h-full">
                <FeatureCard icon={card.icon} title={card.title} desc={card.desc} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <SectionLabel>The process</SectionLabel>
            <h2 className="font-display mt-3 mb-14" style={{ fontSize: "clamp(44px, 8vw, 88px)", lineHeight: 0.92 }}>
              THREE STEPS TO<br />
              <span style={{ background: "linear-gradient(135deg, #fff 0%, #888 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                YOUR PERFECT BALL.
              </span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { n: "01", title: "Tell us about you", desc: "Enter your age, height, hand span and experience. Takes under 30 seconds." },
              { n: "02", title: "Get your recommendation", desc: "Our AI calculates your fit score and recommends the exact size plus personalised coaching tips." },
              { n: "03", title: "Buy the right ball", desc: "Click through to Amazon, Walmart or Target and get playing with the correct size today." },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <div className="flex flex-col gap-3">
                  <span className="font-display leading-none select-none" style={{ fontSize: 96, color: "#F97316", opacity: 0.22 }}>
                    {step.n}
                  </span>
                  <h3 className="text-white font-semibold text-base -mt-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Size reference ── */}
      <section className="py-24 px-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <SectionLabel>The sizes</SectionLabel>
            <h2 className="font-display mt-3 mb-12" style={{ fontSize: "clamp(44px, 8vw, 88px)", lineHeight: 0.92 }}>
              KNOW YOUR<br />
              <span style={{ background: "linear-gradient(135deg, #fff 0%, #888 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                OPTIONS.
              </span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {([7, 6, 5, 3] as BallSize[]).map((s, i) => {
              const info = BALL_SIZE_INFO[s];
              return (
                <Reveal key={s} delay={i * 70}>
                  <div className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-display text-xl shrink-0 text-black"
                      style={{ background: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)" }}>
                      {s}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{info.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{info.circumference} · {info.weight}</p>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.22)" }}>{info.audience}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section id="get-started" className="py-24 px-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-md mx-auto">
          <Reveal>
            <SectionLabel>Get started</SectionLabel>
            <h2 className="font-display mt-3 mb-10" style={{ fontSize: "clamp(52px, 10vw, 108px)", lineHeight: 0.9 }}>
              FIND YOUR<br />
              <span style={{ color: "#F97316" }}>PERFECT SIZE.</span>
            </h2>
          </Reveal>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <NumInput label="Age" unit="yrs" min={4} max={60} value={profile.age} onChange={(v) => set("age", v)} />
              <NumInput label="Height" unit="cm" min={80} max={230} value={profile.heightCm} onChange={(v) => set("heightCm", v)} />
            </div>

            <HandSpanInput value={profile.handSpanCm} onChange={(v) => set("handSpanCm", v)} />

            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Experience</label>
              <SegmentedControl
                options={["beginner", "intermediate", "advanced"]}
                labels={["Beginner", "Intermediate", "Advanced"]}
                value={profile.experience}
                onChange={(v) => set("experience", v as UserProfile["experience"])}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Gender</label>
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
              className="w-full py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all active:scale-95"
              style={{
                background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #F97316 0%, #C2410C 100%)",
                color: loading ? "rgba(255,255,255,0.3)" : "#fff",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Analysing…" : "Get My Size →"}
            </button>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
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
      <footer className="py-10 px-5 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="font-display text-3xl" style={{ color: "#F97316" }}>BASKETFIT</p>
        <p className="text-xs uppercase tracking-widest mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
          AI Basketball Size Recommender · {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4"
      style={{ backdropFilter: "blur(16px)", background: "rgba(0,0,0,0.75)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <span className="font-display text-xl" style={{ color: "#F97316", letterSpacing: "0.05em" }}>
        🏀 BASKETFIT
      </span>
      <a
        href="#get-started"
        className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)" }}
      >
        Get Started →
      </a>
    </nav>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: "rgba(249,115,22,0.6)" }}>
      {children}
    </p>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4 h-full transition-colors"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.2)" }}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function TargetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function CoachIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({ result }: { result: Recommendation }) {
  const info = BALL_SIZE_INFO[result.primarySize];
  const picks = BALL_PICKS[result.primarySize];

  return (
    <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(249,115,22,0.25)", background: "#0a0a0a" }}>
      {/* Header */}
      <div className="relative p-6 overflow-hidden" style={{ background: "linear-gradient(135deg, #111 0%, #1c0900 60%, #111 100%)" }}>
        {/* Ghost size number */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 font-display leading-none pointer-events-none select-none"
          style={{ fontSize: 140, color: "#F97316", opacity: 0.07 }}>
          {result.primarySize}
        </div>

        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(249,115,22,0.55)" }}>
          Your Recommended Size
        </p>
        <div className="flex items-center gap-3">
          <span className="font-display leading-none" style={{ fontSize: 80, color: "#F97316" }}>
            {result.primarySize}
          </span>
          <div>
            <p className="text-white font-bold text-lg leading-tight">{info.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {info.circumference} circumference · {info.weight}
            </p>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-5">
          <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full animate-score"
              style={{ width: `${result.score}%`, background: "linear-gradient(90deg, #EA580C 0%, #FBBF24 100%)" }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Fit Score</p>
            <p className="text-xs font-bold" style={{ color: "#F97316" }}>{result.score}/100</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-6">
        <Block title="Why this size">
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            <InlineText text={result.explanation} />
          </p>
        </Block>

        {result.trainingSize && (
          <Block title="Training tip">
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Use a{" "}
              <span className="text-white font-semibold">{BALL_SIZE_INFO[result.trainingSize].label}</span>
              {" "}for skill drills. The tighter grip builds better finger-pad control.
            </p>
          </Block>
        )}

        <Block title="AI Coach">
          <CoachMessage text={result.aiCoachMessage} />
        </Block>

        <Block title="Shop this size">
          <div className="space-y-3">
            {picks.map((pick, i) => (
              <div
                key={pick.name}
                className="rounded-2xl p-4"
                style={{
                  background: i === 0 ? "rgba(249,115,22,0.05)" : "rgba(255,255,255,0.02)",
                  border: i === 0 ? "1px solid rgba(249,115,22,0.22)" : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-white text-sm font-semibold">{pick.name}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={i === 0
                        ? { background: "rgba(249,115,22,0.15)", color: "#F97316", border: "1px solid rgba(249,115,22,0.3)" }
                        : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.1)" }
                      }
                    >
                      {i === 0 ? "★ " : ""}{pick.tag}
                    </span>
                    <span className="text-xs font-bold text-white whitespace-nowrap">{pick.price}</span>
                  </div>
                </div>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>{pick.desc}</p>
                <div className="flex gap-2">
                  <ShopLink href={pick.amazon} label="Amazon" color="#FF9900" />
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

// ─── Coach message renderer ───────────────────────────────────────────────────

function CoachMessage({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.trim().split(/\*\*(.*?)\*\*/g);

  return (
    <div className="p-4 rounded-2xl" style={{
      background: "linear-gradient(135deg, rgba(249,115,22,0.07) 0%, rgba(0,0,0,0) 100%)",
      border: "1px solid rgba(249,115,22,0.18)",
    }}>
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(249,115,22,0.15)" }}>
          <CoachIcon />
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
          {parts.map((p, i) =>
            i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{p}</strong> : <span key={i}>{p}</span>
          )}
        </p>
      </div>
    </div>
  );
}

function ShopLink({ href, label, color }: { href: string; label: string; color: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 py-2 rounded-xl text-xs font-bold text-center transition-opacity hover:opacity-80"
      style={{ background: color + "18", color, border: `1px solid ${color}35` }}
    >
      {label}
    </a>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest mb-2.5 font-semibold" style={{ color: "rgba(255,255,255,0.22)" }}>{title}</p>
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
      <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</label>
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-3 transition-colors focus-within:border-orange-500/40"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
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
        <span className="text-xs uppercase tracking-widest shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>{unit}</span>
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
        <label className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Hand Span</label>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Thumb tip → pinky tip, fully spread</span>
      </div>
      <div className="flex gap-2">
        <div
          className="flex-1 flex items-center gap-2 rounded-xl px-3 py-3 transition-colors"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <input
            type="text" inputMode="decimal" value={raw}
            onChange={(e) => {
              const s = e.target.value; setRaw(s);
              const n = parseFloat(s);
              if (!isNaN(n) && n >= 10 && n <= 35) { onChange(n); clearPhoto(); }
            }}
            onBlur={() => { const n = parseFloat(raw); if (isNaN(n) || n < 10 || n > 35) setRaw(String(value)); }}
            className="flex-1 bg-transparent text-white text-lg font-semibold outline-none w-0"
            required
          />
          <span className="text-xs uppercase tracking-widest shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>cm</span>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={scanning}
          title="Measure with AI camera"
          className="w-14 flex items-center justify-center rounded-xl transition-colors disabled:opacity-40 hover:brightness-110"
          style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)" }}
        >
          {scanning ? <Spinner /> : <CameraIconOrange />}
        </button>
        <input
          ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {preview && (
        <div className="mt-3 rounded-xl overflow-hidden relative" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Hand" className="w-full max-h-48 object-cover" />
          {scanning && (
            <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center gap-2">
              <Spinner large />
              <p className="text-white text-xs tracking-widest uppercase">AI measuring…</p>
            </div>
          )}
          {!scanning && (
            <button
              type="button"
              onClick={clearPhoto}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-gray-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {aiResult !== null && !scanning && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>AI measured:</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(249,115,22,0.12)", color: "#F97316", border: "1px solid rgba(249,115,22,0.25)" }}
          >
            {aiResult} cm
          </span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>· tap to adjust</span>
        </div>
      )}
      {visionError && !scanning && <p className="mt-1.5 text-xs text-red-400">{visionError}</p>}
      {!preview && (
        <p className="mt-1.5 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          Tip: lay a ruler beside your hand for the most accurate AI measurement
        </p>
      )}
    </div>
  );
}

function CameraIconOrange() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function Spinner({ large = false }: { large?: boolean }) {
  const s = large ? 24 : 16;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" className="animate-spin" style={{ color: "#F97316" }}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="40" strokeDashoffset="10" />
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
    <div
      className="flex gap-1 p-1 rounded-xl"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {options.map((opt, i) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className="flex-1 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all"
          style={
            value === opt
              ? { background: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)", color: "#fff" }
              : { color: "rgba(255,255,255,0.3)" }
          }
        >
          {labels[i]}
        </button>
      ))}
    </div>
  );
}
