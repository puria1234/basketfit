"use client";

import { useState, Suspense, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import type { UserProfile, Recommendation, BallSize } from "@/lib/types";
import { BALL_SIZE_INFO } from "@/lib/types";

const Basketball3D = dynamic(() => import("@/components/Basketball3D"), { ssr: false });

// ─── Product recommendations ──────────────────────────────────────────────────

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
      name: "Wilson NCAA Replica Youth",
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

// ─── Default profile ──────────────────────────────────────────────────────────

const defaultProfile: UserProfile = {
  age: 16,
  heightCm: 175,
  handSpanCm: 21,
  experience: "intermediate",
  playingType: "indoor",
  position: "none",
  gender: "male",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

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

  const ballSize = result?.primarySize ?? 7;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Hero */}
      <section className="w-full flex flex-col items-center pt-10 pb-2">
        <Suspense fallback={<div className="h-[340px] flex items-center justify-center text-gray-600">Loading…</div>}>
          <Basketball3D size={ballSize as BallSize} />
        </Suspense>

        <h1
          className="text-6xl sm:text-7xl font-black tracking-tighter mt-2"
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #b0b0b0 45%, #ffffff 70%, #888888 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          BASKETFIT
        </h1>
        <p
          className="mt-2 text-base sm:text-lg tracking-widest uppercase font-medium"
          style={{
            background: "linear-gradient(90deg, #555 0%, #ccc 50%, #555 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Find your perfect ball size
        </p>
      </section>

      {/* Form */}
      <section className="w-full max-w-md px-5 mt-8 mb-10">
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
      </section>

      {/* Result */}
      {result && (
        <section className="w-full max-w-md px-5 mb-16">
          <ResultCard result={result} />
        </section>
      )}

      {/* Reference */}
      <section className="w-full max-w-md px-5 mb-16">
        <p
          className="text-xs uppercase tracking-widest mb-4"
          style={{
            background: "linear-gradient(90deg, #555 0%, #aaa 50%, #555 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Size reference
        </p>
        <div className="grid grid-cols-2 gap-2">
          {([3, 5, 6, 7] as BallSize[]).map((s) => {
            const info = BALL_SIZE_INFO[s];
            return (
              <div key={s} className="border border-white/10 rounded-xl p-3 flex gap-3 items-center bg-white/[0.03]">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                  style={{ background: "linear-gradient(135deg, #ffffff 0%, #888 100%)", color: "#000" }}
                >
                  {s}
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">{info.label}</p>
                  <p className="text-gray-600 text-xs">{info.audience}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({ result }: { result: Recommendation }) {
  const info = BALL_SIZE_INFO[result.primarySize];
  const picks = BALL_PICKS[result.primarySize];

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10">
      {/* Banner */}
      <div className="p-6" style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2e2e2e 50%, #111 100%)" }}>
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Your Size</p>
        <h2
          className="text-5xl font-black tracking-tight"
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #aaaaaa 50%, #ffffff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {info.label}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{info.circumference} circumference · {info.weight}</p>
        <div className="mt-4">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${result.score}%`, background: "linear-gradient(90deg, #555 0%, #ffffff 100%)" }}
            />
          </div>
          <p className="text-right text-xs text-gray-600 mt-1">Fit score {result.score}/100</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5 bg-[#0a0a0a]">
        <Block title="Why this size">
          <p className="text-gray-400 text-sm leading-relaxed">{result.explanation}</p>
        </Block>

        {result.trainingSize && (
          <Block title="Training tip">
            <p className="text-gray-400 text-sm leading-relaxed">
              Use a{" "}
              <span className="text-white font-semibold">{BALL_SIZE_INFO[result.trainingSize].label}</span>{" "}
              for skill drills. The tighter grip builds better finger-pad control.
            </p>
          </Block>
        )}

        <Block title="AI Coach">
          <p className="text-gray-400 text-sm leading-relaxed italic border-l border-white/20 pl-3">
            {result.aiCoachMessage}
          </p>
        </Block>

        {/* Shop picks */}
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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
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

function NumInput({
  label, unit, min, max, step = 1, value, onChange,
}: {
  label: string; unit: string; min: number; max: number; step?: number;
  value: number; onChange: (v: number) => void;
}) {
  const [raw, setRaw] = useState(String(value));

  useEffect(() => {
    setRaw(String(value));
  }, [value]);

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

  useEffect(() => {
    setRaw(String(value));
  }, [value]);

  async function handleFile(file: File) {
    setVisionError(null);
    setAiResult(null);
    const dataUrl = await resizeImage(file, 900);
    setPreview(dataUrl);
    const base64 = dataUrl.split(",")[1];
    const mimeType = file.type || "image/jpeg";
    setScanning(true);
    try {
      const res = await fetch("/api/measure-hand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
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
    setPreview(null);
    setAiResult(null);
    setVisionError(null);
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
            type="text"
            inputMode="decimal"
            value={raw}
            onChange={(e) => {
              const s = e.target.value;
              setRaw(s);
              const n = parseFloat(s);
              if (!isNaN(n) && n >= 10 && n <= 35) {
                onChange(n);
                clearPhoto();
              }
            }}
            onBlur={() => {
              const n = parseFloat(raw);
              if (isNaN(n) || n < 10 || n > 35) setRaw(String(value));
            }}
            className="flex-1 bg-transparent text-white text-lg font-semibold outline-none w-0"
            required
          />
          <span className="text-gray-600 text-xs uppercase tracking-widest shrink-0">cm</span>
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={scanning}
          title="Measure with AI camera"
          className="w-14 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/10 disabled:opacity-40 transition-colors"
        >
          {scanning ? <Spinner /> : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          )}
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {preview && (
        <div className="mt-3 rounded-xl overflow-hidden border border-white/10 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Hand photo" className="w-full max-h-48 object-cover" />
          {scanning && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
              <Spinner large />
              <p className="text-white text-xs tracking-widest uppercase">AI measuring…</p>
            </div>
          )}
          {!scanning && (
            <button
              type="button"
              onClick={clearPhoto}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {aiResult !== null && !scanning && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-xs text-gray-500">AI measured:</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "linear-gradient(90deg, #222, #333)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}>
            {aiResult} cm
          </span>
          <span className="text-xs text-gray-600">· tap number to adjust</span>
        </div>
      )}

      {visionError && !scanning && <p className="mt-1.5 text-xs text-red-500">{visionError}</p>}
      {!preview && <p className="mt-1.5 text-xs text-gray-700">Tip: place a credit card next to your hand for accurate AI measurement</p>}
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
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function SegmentedControl({
  options, labels, value, onChange,
}: {
  options: string[]; labels: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1 bg-white/[0.04] border border-white/10 rounded-xl p-1">
      {options.map((opt, i) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className="flex-1 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all"
          style={
            value === opt
              ? { background: "linear-gradient(135deg, #ffffff 0%, #cccccc 100%)", color: "#000" }
              : { color: "#555" }
          }
        >
          {labels[i]}
        </button>
      ))}
    </div>
  );
}
