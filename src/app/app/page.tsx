"use client";

import { useState, Suspense, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import type { UserProfile, Recommendation, BallSize } from "@/lib/types";
import { BALL_SIZE_INFO } from "@/lib/types";
import { Logo } from "@/components/Logo";

const Basketball3D = dynamic(() => import("@/components/Basketball3D"), { ssr: false });

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  orange:   "#FF5722",
  orangeLt: "#FF7D53",
  cyan:     "#06B6D4",
  cyanDim:  "rgba(6,182,212,0.10)",
  cyanBdr:  "rgba(6,182,212,0.18)",
  lime:     "#84CC16",
  text:     "#F0F4F8",
  muted:    "rgba(240,244,248,0.37)",
  surface:  "rgba(255,255,255,0.03)",
  surfBdr:  "rgba(255,255,255,0.07)",
  bg:       "#0C1220",
  navy:     "#111827",
};

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
      desc: "Microfiber composite cover with cushion core. The most played indoor game ball in America.",
      amazon: "https://www.amazon.com/dp/B0009KMXWY",
      walmart: "https://www.walmart.com/ip/Wilson-Evolution-Official-Game-Basketball-29-5/14147048",
      target: "https://www.target.com/p/wilson-29-5-34-evolution-basketball/-/A-77439661",
    },
    {
      name: "Spalding NBA Street",
      tag: "Best outdoor",
      price: "~$30",
      desc: "NBA-licensed rubber cover built for concrete and asphalt. Durable all-season grip.",
      amazon: "https://www.amazon.com/dp/B0CTT757WD",
      walmart: "https://www.walmart.com/ip/Spalding-NBA-Street-Basketball/10741220",
      target: "https://www.target.com/p/spalding-street-phantom-29-5-39-39-basketball/-/A-82153638",
    },
  ],
  6: [
    {
      name: "Wilson NCAA Women's",
      tag: "Editor's Pick",
      price: "~$45",
      desc: "Official women's composite ball. Used in college programs across the country.",
      amazon: "https://www.amazon.com/dp/B0000BZF0N",
      walmart: "https://www.walmart.com/ip/Wilson-NCAA-Final-Four-Edition-Basketball-Intermediate-Size-28-5/11962925",
      target: "https://www.target.com/p/wilson-ncaa-28-5-34-basketball-brown/-/A-90584633",
    },
    {
      name: "Spalding WNBA Replica",
      tag: "Official game ball",
      price: "~$40",
      desc: "WNBA official size and weight. Pebbled composite cover for a consistent outdoor feel.",
      amazon: "https://www.amazon.com/dp/B073RRQFXD",
      walmart: "https://www.walmart.com/ip/Spalding-WNBA-Replica-Outdoor-Basketball-Oatmeal-Orange-28-5/47760909",
      target: "https://www.target.com/p/spalding-elevation-28-5-39-39-basketball/-/A-82153633",
    },
  ],
  5: [
    {
      name: "Wilson NCAA Youth",
      tag: "Editor's Pick",
      price: "~$25",
      desc: "27.5\" soft composite cover ideal for ages 9 to 11. Easy to grip and control.",
      amazon: "https://www.amazon.com/dp/B0C6KRP3R7",
      walmart: "https://www.walmart.com/ip/Wilson-NCAA-Street-Shot-Basketball-Youth-27-5/922812303",
      target: "https://www.target.com/p/wilson-ncaa-icon-basketball-sz5-brown/-/A-89198535",
    },
    {
      name: "Spalding NBA Youth",
      tag: "Great value",
      price: "~$20",
      desc: "Official NBA youth rec ball. Rubber construction works indoors and outdoors.",
      amazon: "https://www.amazon.com/dp/B00C1P7V2M",
      walmart: "https://www.walmart.com/ip/Spalding-NBA-Varsity-Basketball-Youth-Size-27-5/11032308",
      target: "https://www.target.com/p/spalding-27-5-rookie-gear-youth-indoor-outdoor-basketball/-/A-87153793",
    },
  ],
  3: [
    {
      name: "Wilson NBA DRV Mini",
      tag: "Editor's Pick",
      price: "~$15",
      desc: "Soft rubber mini ball for ages 4 to 8. Lightweight design perfect for small hands.",
      amazon: "https://www.amazon.com/dp/B0CP27V21R",
      walmart: "https://www.walmart.com/ip/Wilson-NBA-DRV-Outdoor-Mini-Basketball-Brown/809955225",
      target: "https://www.target.com/p/wilson-nba-authentic-mini-basketball-orange-white/-/A-92431062",
    },
    {
      name: "Spalding NBA Mini Replica",
      tag: "Great value",
      price: "~$12",
      desc: "Durable rubber construction for young beginners. A perfect first basketball.",
      amazon: "https://www.amazon.com/dp/B00WL6KBDC",
      walmart: "https://www.walmart.com/ip/Spalding-NBA-Mini-22-Basketball-Red-Orange/34934989",
      target: "https://www.target.com/p/spalding-layup-mini-rubber-outdoor-basketball/-/A-88514694",
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

// ─── App page ─────────────────────────────────────────────────────────────────

export default function AppPage() {
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
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="animate-orb-a absolute rounded-full"
          style={{ width: 520, height: 520, top: -120, right: -100,
            background: `radial-gradient(circle, ${C.orange}22 0%, transparent 70%)` }} />
        <div className="animate-orb-b absolute rounded-full"
          style={{ width: 400, height: 400, bottom: 100, left: -80,
            background: `radial-gradient(circle, ${C.cyan}18 0%, transparent 70%)` }} />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ backdropFilter: "blur(20px)", background: "rgba(12,18,32,0.82)", borderBottom: `1px solid ${C.cyanBdr}` }}>
        <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <Logo size={26} />
          <span className="font-display font-bold text-base tracking-wide" style={{ color: C.text }}>BasketFit</span>
        </a>
        <a href="/" className="text-sm font-medium flex items-center gap-1.5 transition-opacity hover:opacity-70"
          style={{ color: C.muted }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Home
        </a>
      </nav>

      {/* Main content */}
      <main className="relative pt-20 pb-24 px-5" style={{ zIndex: 1 }}>
        <div className="max-w-md mx-auto">

          {/* Ball + heading */}
          <div className="text-center mb-10">
            <div className="animate-float w-full max-w-[240px] mx-auto">
              <Suspense fallback={<div style={{ height: 280 }} />}>
                <Basketball3D size={ballSize} />
              </Suspense>
            </div>
            <h1 className="font-display font-extrabold mt-2" style={{ fontSize: "clamp(42px, 10vw, 72px)", lineHeight: 1.0, color: C.text }}>
              Find Your<br />
              <span style={{ color: C.orange }}>Perfect Size.</span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: C.muted }}>
              Enter your details below. Takes under 30 seconds.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <NumInput label="Age" unit="yrs" min={4} max={60} value={profile.age} onChange={(v) => set("age", v)} />
              <NumInput label="Height" unit="cm" min={80} max={230} value={profile.heightCm} onChange={(v) => set("heightCm", v)} />
            </div>

            <HandSpanInput value={profile.handSpanCm} onChange={(v) => set("handSpanCm", v)} />

            <div>
              <FieldLabel>Experience</FieldLabel>
              <SegCtrl
                options={["beginner", "intermediate", "advanced"]}
                labels={["Beginner", "Intermediate", "Advanced"]}
                value={profile.experience}
                onChange={(v) => set("experience", v as UserProfile["experience"])}
              />
            </div>

            <div>
              <FieldLabel>Gender</FieldLabel>
              <SegCtrl
                options={["male", "female", "other"]}
                labels={["Male", "Female", "Other"]}
                value={profile.gender}
                onChange={(v) => set("gender", v as UserProfile["gender"])}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-semibold text-sm tracking-widest uppercase transition-all active:scale-95"
              style={{
                background: loading
                  ? "rgba(255,255,255,0.05)"
                  : `linear-gradient(135deg, ${C.orange} 0%, #C2320C 100%)`,
                color: loading ? C.muted : "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : `0 0 32px ${C.orange}44`,
              }}
            >
              {loading ? "Analysing..." : "Get My Size"}
            </button>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          </form>

          {/* Result */}
          {result && (
            <div id="result" className="mt-10">
              <ResultCard result={result} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({ result }: { result: Recommendation }) {
  const info = BALL_SIZE_INFO[result.primarySize];
  const picks = BALL_PICKS[result.primarySize];

  return (
    <div className="rounded-3xl overflow-hidden"
      style={{ border: `1px solid ${C.cyanBdr}`, background: "#0E1627" }}>
      {/* Header */}
      <div className="relative p-6 overflow-hidden"
        style={{ background: `linear-gradient(135deg, #0E1627 0%, #1A0E08 60%, #0E1627 100%)` }}>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 font-display font-bold leading-none pointer-events-none select-none"
          style={{ fontSize: 130, color: C.orange, opacity: 0.06 }}>
          {result.primarySize}
        </div>

        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: `${C.orange}88` }}>
          Your Recommended Size
        </p>
        <div className="flex items-center gap-3">
          <span className="font-display font-bold leading-none" style={{ fontSize: 76, color: C.orange }}>
            {result.primarySize}
          </span>
          <div>
            <p className="font-semibold text-lg leading-tight" style={{ color: C.text }}>{info.label}</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>
              {info.circumference} circumference · {info.weight}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full animate-score"
              style={{ width: `${result.score}%`, background: `linear-gradient(90deg, ${C.orange} 0%, ${C.cyan} 100%)` }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>Fit Score</p>
            <p className="text-xs font-semibold" style={{ color: C.cyan }}>{result.score}/100</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-6">
        <Block title="Why this size">
          <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
            <InlineText text={result.explanation} />
          </p>
        </Block>

        {result.trainingSize && (
          <Block title="Training tip">
            <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
              Use a{" "}
              <span className="font-semibold" style={{ color: C.text }}>{BALL_SIZE_INFO[result.trainingSize].label}</span>
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
              <div key={pick.name} className="rounded-2xl p-4"
                style={{
                  background: i === 0 ? `${C.orange}0A` : C.surface,
                  border: i === 0 ? `1px solid ${C.orange}38` : `1px solid ${C.surfBdr}`,
                }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold" style={{ color: C.text }}>{pick.name}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={i === 0
                        ? { background: `${C.orange}20`, color: C.orangeLt, border: `1px solid ${C.orange}40` }
                        : { background: C.surface, color: C.muted, border: `1px solid ${C.surfBdr}` }
                      }>
                      {i === 0 ? "★ " : ""}{pick.tag}
                    </span>
                    <span className="text-xs font-semibold whitespace-nowrap" style={{ color: C.text }}>{pick.price}</span>
                  </div>
                </div>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: "rgba(240,244,248,0.28)" }}>{pick.desc}</p>
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

// ─── Coach message ────────────────────────────────────────────────────────────

function CoachMessage({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.trim().split(/\*\*(.*?)\*\*/g);
  return (
    <div className="p-4 rounded-2xl" style={{
      background: `linear-gradient(135deg, ${C.cyanDim} 0%, rgba(0,0,0,0) 100%)`,
      border: `1px solid ${C.cyanBdr}`,
    }}>
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: `${C.cyan}20` }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(240,244,248,0.65)" }}>
          {parts.map((p, i) =>
            i % 2 === 1
              ? <strong key={i} className="font-semibold" style={{ color: C.text }}>{p}</strong>
              : <span key={i}>{p}</span>
          )}
        </p>
      </div>
    </div>
  );
}

// ─── Inline markdown ──────────────────────────────────────────────────────────

function InlineText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1
          ? <strong key={i} className="font-semibold" style={{ color: C.text }}>{p}</strong>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function ShopLink({ href, label, color }: { href: string; label: string; color: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex-1 py-2 rounded-xl text-xs font-semibold text-center transition-opacity hover:opacity-80"
      style={{ background: color + "18", color, border: `1px solid ${color}35` }}>
      {label}
    </a>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest mb-2.5 font-semibold" style={{ color: "rgba(240,244,248,0.22)" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: "rgba(240,244,248,0.35)" }}>
      {children}
    </label>
  );
}

// ─── Number input ─────────────────────────────────────────────────────────────

function NumInput({ label, unit, min, max, step = 1, value, onChange }: {
  label: string; unit: string; min: number; max: number; step?: number; value: number; onChange: (v: number) => void;
}) {
  const [raw, setRaw] = useState(String(value));
  useEffect(() => { setRaw(String(value)); }, [value]);

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-2 rounded-xl px-3 py-3 transition-colors"
        style={{ background: C.surface, border: `1px solid ${C.surfBdr}` }}>
        <input
          type="text" inputMode="decimal" value={raw}
          onChange={(e) => {
            const s = e.target.value; setRaw(s);
            const n = step < 1 ? parseFloat(s) : parseInt(s, 10);
            if (!isNaN(n) && n >= min && n <= max) onChange(n);
          }}
          onBlur={() => {
            const n = step < 1 ? parseFloat(raw) : parseInt(raw, 10);
            if (isNaN(n) || n < min || n > max) setRaw(String(value));
          }}
          className="flex-1 bg-transparent text-lg font-semibold outline-none w-0"
          style={{ color: C.text }}
          required
        />
        <span className="text-xs uppercase tracking-widest shrink-0" style={{ color: "rgba(240,244,248,0.24)" }}>{unit}</span>
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
    setVisionError(null); setAiResult(null);
    const dataUrl = await resizeImage(file, 900);
    setPreview(dataUrl); setScanning(true);
    try {
      const res = await fetch("/api/measure-hand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: dataUrl.split(",")[1], mimeType: file.type || "image/jpeg" }),
      });
      const data = await res.json();
      if (!res.ok || data.error) { setVisionError(data.error ?? "Could not measure hand from photo."); }
      else { setAiResult(data.handSpanCm); onChange(data.handSpanCm); }
    } catch { setVisionError("Network error. Please try again."); }
    finally { setScanning(false); }
  }

  function clearPhoto() {
    setPreview(null); setAiResult(null); setVisionError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <FieldLabel>Hand Span</FieldLabel>
        <span className="text-xs" style={{ color: "rgba(240,244,248,0.2)" }}>Thumb to pinky tip, spread wide</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-3"
          style={{ background: C.surface, border: `1px solid ${C.surfBdr}` }}>
          <input type="text" inputMode="decimal" value={raw}
            onChange={(e) => {
              const s = e.target.value; setRaw(s);
              const n = parseFloat(s);
              if (!isNaN(n) && n >= 10 && n <= 35) { onChange(n); clearPhoto(); }
            }}
            onBlur={() => { const n = parseFloat(raw); if (isNaN(n) || n < 10 || n > 35) setRaw(String(value)); }}
            className="flex-1 bg-transparent text-lg font-semibold outline-none w-0"
            style={{ color: C.text }}
            required />
          <span className="text-xs uppercase tracking-widest shrink-0" style={{ color: "rgba(240,244,248,0.24)" }}>cm</span>
        </div>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={scanning}
          title="Measure with AI camera"
          className="w-14 flex items-center justify-center rounded-xl transition-colors disabled:opacity-40 hover:brightness-110"
          style={{ background: `${C.orange}18`, border: `1px solid ${C.orange}40` }}>
          {scanning ? <Spinner /> : <CameraIcon />}
        </button>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>

      {preview && (
        <div className="mt-3 rounded-xl overflow-hidden relative" style={{ border: `1px solid ${C.surfBdr}` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Hand" className="w-full max-h-48 object-cover" />
          {scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={{ background: "rgba(12,18,32,0.75)" }}>
              <Spinner large />
              <p className="text-xs tracking-widest uppercase" style={{ color: C.text }}>AI measuring...</p>
            </div>
          )}
          {!scanning && (
            <button type="button" onClick={clearPhoto}
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs hover:text-white"
              style={{ background: "rgba(12,18,32,0.75)", color: C.muted }}>
              X
            </button>
          )}
        </div>
      )}

      {aiResult !== null && !scanning && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-xs" style={{ color: "rgba(240,244,248,0.35)" }}>AI measured:</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${C.cyan}18`, color: C.cyan, border: `1px solid ${C.cyan}35` }}>
            {aiResult} cm
          </span>
          <span className="text-xs" style={{ color: "rgba(240,244,248,0.2)" }}>tap to adjust</span>
        </div>
      )}
      {visionError && !scanning && <p className="mt-1.5 text-xs text-red-400">{visionError}</p>}
      {!preview && (
        <p className="mt-1.5 text-xs" style={{ color: "rgba(240,244,248,0.2)" }}>
          Tip: lay a ruler beside your hand for the most accurate AI measurement
        </p>
      )}
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth="1.8" strokeLinecap="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function Spinner({ large = false }: { large?: boolean }) {
  const s = large ? 24 : 16;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" className="animate-spin" style={{ color: C.orange }}>
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

function SegCtrl({ options, labels, value, onChange }: {
  options: string[]; labels: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1 p-1 rounded-xl"
      style={{ background: C.surface, border: `1px solid ${C.surfBdr}` }}>
      {options.map((opt, i) => (
        <button key={opt} type="button" onClick={() => onChange(opt)}
          className="flex-1 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all"
          style={value === opt
            ? { background: `linear-gradient(135deg, ${C.orange} 0%, #C2320C 100%)`, color: "#fff",
                boxShadow: `0 0 12px ${C.orange}44` }
            : { color: C.muted }
          }>
          {labels[i]}
        </button>
      ))}
    </div>
  );
}
