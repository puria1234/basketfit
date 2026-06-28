"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Logo } from "@/components/Logo";
import { BALL_SIZE_INFO } from "@/lib/types";
import type { BallSize } from "@/lib/types";

const Basketball3D = dynamic(() => import("@/components/Basketball3D"), { ssr: false });

// ─── Scroll-reveal ────────────────────────────────────────────────────────────

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

// ─── Landing page ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <LandingNav />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <GridBg />
        <OrbGlow style={{ width: 540, height: 540, top: "6%", left: "calc(50% - 270px)" }} cls="animate-orb-1" color="rgba(249,115,22,0.13)" />
        <OrbGlow style={{ width: 280, height: 280, top: "50%", left: "12%" }} cls="animate-orb-2" color="rgba(255,200,80,0.05)" />

        <div className="animate-float w-full max-w-[270px] relative z-10">
          <Suspense fallback={<div style={{ height: 320 }} />}>
            <Basketball3D size={7} />
          </Suspense>
        </div>

        <div className="relative z-10 text-center px-5 -mt-2">
          <p className="text-xs uppercase tracking-[0.35em] font-semibold mb-4 animate-fade-up" style={{ color: "#F97316" }}>
            AI-Powered · Free Forever
          </p>
          <h1
            className="font-display font-extrabold leading-[0.9] animate-fade-up-d1"
            style={{
              fontSize: "clamp(72px, 15vw, 190px)",
              background: "linear-gradient(180deg, #ffffff 0%, #d0d0d0 30%, #ffffff 62%, #999 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            BASKETFIT
          </h1>
          <p className="mt-5 text-base sm:text-lg max-w-sm mx-auto leading-relaxed animate-fade-up-d2" style={{ color: "rgba(255,255,255,0.45)" }}>
            Know your size before you buy. Smart fitting powered by AI vision.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-fade-up-d3">
            <a href="/app"
              className="px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide text-white transition-all hover:brightness-110 active:scale-95"
              style={{ background: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)" }}>
              Find My Size
            </a>
            <a href="#how-it-works"
              className="px-8 py-4 rounded-2xl font-semibold text-sm text-white hover:bg-white/5 transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
              How it works
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-y">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-3xl mx-auto px-5 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { v: "4", l: "Ball Sizes" },
            { v: "3", l: "Retailers" },
            { v: "AI", l: "Vision Measure" },
            { v: "Free", l: "Forever" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display font-bold text-4xl" style={{ color: "#F97316" }}>{s.v}</p>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.24)" }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <Eyebrow>What we do</Eyebrow>
            <h2 className="font-display font-extrabold mt-3 mb-14" style={{ fontSize: "clamp(40px, 7vw, 82px)", lineHeight: 1.0 }}>
              Smart sizing.<br />
              <span style={{ color: "#F97316" }}>Built for players.</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: <IconTarget />, title: "Smart Fit Score", desc: "We weigh age, height, hand span, experience and gender to produce a 0-100 fit score mapped to the right ball size." },
              { icon: <IconCamera />, title: "AI Vision Measure", desc: "Point your camera at your hand with a ruler beside it. MiniMax M3 reads your hand span in seconds." },
              { icon: <IconBag />, title: "Shop Ready", desc: "Every recommendation links directly to Amazon, Walmart and Target with curated picks and estimated prices." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 90} className="h-full">
                <div className="rounded-2xl p-6 h-full flex flex-col gap-4"
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.2)" }}>
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-2">{c.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>{c.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <Eyebrow>The process</Eyebrow>
            <h2 className="font-display font-extrabold mt-3 mb-14" style={{ fontSize: "clamp(40px, 7vw, 82px)", lineHeight: 1.0 }}>
              Three steps to your<br />
              <span style={{ background: "linear-gradient(135deg, #fff 0%, #888 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                perfect ball.
              </span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {[
              { n: "01", title: "Tell us about you", desc: "Enter your age, height, hand span and experience. Under 30 seconds." },
              { n: "02", title: "Get your AI result", desc: "We calculate your fit score and recommend the right size with personalised coaching tips." },
              { n: "03", title: "Buy the right ball", desc: "Click through to Amazon, Walmart or Target and start playing with the correct size." },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <div className="flex flex-col gap-3">
                  <span className="font-display font-bold select-none" style={{ fontSize: 88, lineHeight: 1, color: "#F97316", opacity: 0.18 }}>
                    {step.n}
                  </span>
                  <h3 className="text-white font-semibold text-base -mt-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.33)" }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Size reference ── */}
      <section className="py-24 px-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <Eyebrow>The sizes</Eyebrow>
            <h2 className="font-display font-extrabold mt-3 mb-12" style={{ fontSize: "clamp(40px, 7vw, 82px)", lineHeight: 1.0 }}>
              Know your options.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {([7, 6, 5, 3] as BallSize[]).map((s, i) => {
              const info = BALL_SIZE_INFO[s];
              return (
                <Reveal key={s} delay={i * 70}>
                  <div className="flex items-start gap-4 p-5 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg shrink-0 text-black"
                      style={{ background: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)" }}>
                      {s}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{info.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.33)" }}>
                        {info.circumference} · {info.weight}
                      </p>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.2)" }}>{info.audience}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="py-28 px-5 text-center relative overflow-hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <OrbGlow style={{ width: 400, height: 400, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} cls="" color="rgba(249,115,22,0.08)" />
        <Reveal>
          <h2 className="font-display font-extrabold mb-6 relative z-10" style={{ fontSize: "clamp(48px, 9vw, 110px)", lineHeight: 1.0 }}>
            Ready to find<br />your size?
          </h2>
          <a
            href="/app"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-semibold text-base text-white transition-all hover:brightness-110 active:scale-95 relative z-10"
            style={{ background: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)" }}
          >
            Open the App
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-5 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <Logo size={22} />
          <span className="font-display font-bold text-base tracking-wide text-white">BasketFit</span>
        </div>
        <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.18)" }}>
          AI Basketball Size Recommender · {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}

// ─── Landing nav ──────────────────────────────────────────────────────────────

function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ backdropFilter: "blur(20px)", background: "rgba(0,0,0,0.72)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
        <Logo size={28} />
        <span className="font-display font-bold text-base tracking-wide text-white">BasketFit</span>
      </a>
      <a href="/app"
        className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)" }}>
        Get Started
      </a>
    </nav>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: "rgba(249,115,22,0.65)" }}>
      {children}
    </p>
  );
}

function GridBg() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px)",
      backgroundSize: "64px 64px",
    }} />
  );
}

function OrbGlow({ style, cls, color }: { style: React.CSSProperties; cls: string; color: string }) {
  return (
    <div className={`absolute pointer-events-none ${cls}`}
      style={{ borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, transparent 65%)`, filter: "blur(55px)", ...style }} />
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconTarget() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function IconCamera() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
