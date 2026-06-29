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
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.07, rootMargin: "0px 0px -24px 0px" }
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
      transform: visible ? "translateY(0)" : "translateY(22px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  orange: "#FF5722",
  text:   "#FFFFFF",
  muted:  "rgba(255,255,255,0.42)",
  dim:    "rgba(255,255,255,0.22)",
  card:   "#141414",
  border: "rgba(255,255,255,0.09)",
  bg:     "#000000",
};

// ─── Landing page ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <LandingNav />

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden" style={{ background: C.bg }}>
        {/* Subtle orange glow behind ball */}
        <div className="absolute pointer-events-none animate-orb-a" style={{
          width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,87,34,0.12) 0%, transparent 65%)",
          top: "4%", left: "calc(50% - 240px)", filter: "blur(80px)",
        }} />

        {/* 3D Ball */}
        <div className="animate-float w-full max-w-[280px] relative z-10">
          <Suspense fallback={<div style={{ height: 320 }} />}>
            <Basketball3D size={7} />
          </Suspense>
        </div>

        {/* Copy */}
        <div className="relative z-10 text-center px-5 -mt-2">
          <div className="flex items-center justify-center gap-2 mb-6 animate-fade-up">
            <Pill>AI-Powered</Pill>
            <Pill>Free Forever</Pill>
          </div>

          <h1
            className="font-display font-black leading-[0.88] animate-fade-up-d1"
            style={{
              fontSize: "clamp(72px, 16vw, 200px)",
              letterSpacing: "-0.03em",
              color: C.text,
            }}
          >
            BASKET
            <br />
            FIT
          </h1>

          <p className="mt-6 text-base sm:text-lg max-w-xs mx-auto leading-relaxed animate-fade-up-d2" style={{ color: C.muted }}>
            Know your size before you buy.
            Smart fitting powered by AI vision.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center animate-fade-up-d3">
            <a href="/app" className="btn-primary">
              Find My Size
              <svg className="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#how-it-works" className="btn-outline">How it works</a>
          </div>
        </div>

        {/* Scroll caret */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-y">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="py-24 px-5" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <Label>What we do</Label>
            <h2
              className="font-display font-black mt-4 mb-14"
              style={{ fontSize: "clamp(40px, 7vw, 88px)", lineHeight: 1.0, letterSpacing: "-0.03em", color: C.text }}
            >
              Smart sizing.<br />
              <span style={{ color: C.orange }}>Built for players.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <IconTarget />, title: "Smart Fit Score",    desc: "We weigh age, height, hand span, experience and gender to produce a 0-100 fit score mapped to the right ball size." },
              { icon: <IconCamera />, title: "AI Vision Measure",  desc: "Photograph your hand with a ruler beside it. MiniMax M3 reads your hand span in seconds." },
              { icon: <IconBag />,    title: "Shop Ready",          desc: "Every recommendation links directly to Amazon, Walmart and Target with curated picks and estimated prices." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 90} className="h-full">
                <div className="feature-card">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-2" style={{ color: C.text }}>{c.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{c.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="how-it-works" className="py-24 px-5" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <Label>The process</Label>
            <h2
              className="font-display font-black mt-4 mb-16"
              style={{ fontSize: "clamp(40px, 7vw, 88px)", lineHeight: 1.0, letterSpacing: "-0.03em", color: C.text }}
            >
              Three steps.<br />
              <span style={{ color: C.muted }}>Perfect ball.</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {[
              { n: "01", title: "Tell us about you",  desc: "Enter age, height, hand span and experience. Under 30 seconds." },
              { n: "02", title: "Get your AI result", desc: "We calculate your fit score and recommend the right size with personalised coaching tips." },
              { n: "03", title: "Buy the right ball", desc: "Click through to Amazon, Walmart or Target and start playing with the correct size." },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <div className="flex flex-col gap-3">
                  <span className="font-display font-black select-none"
                    style={{ fontSize: 88, lineHeight: 1, color: C.text, opacity: 0.07, letterSpacing: "-0.04em" }}>
                    {step.n}
                  </span>
                  <div className="w-8 h-px -mt-1" style={{ background: C.orange }} />
                  <h3 className="font-semibold text-base" style={{ color: C.text }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SIZES ══ */}
      <section className="py-24 px-5" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <Label>The sizes</Label>
            <h2
              className="font-display font-black mt-4 mb-12"
              style={{ fontSize: "clamp(40px, 7vw, 88px)", lineHeight: 1.0, letterSpacing: "-0.03em", color: C.text }}
            >
              Know your options.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {([7, 6, 5, 3] as BallSize[]).map((s, i) => {
              const info = BALL_SIZE_INFO[s];
              return (
                <Reveal key={s} delay={i * 70}>
                  <div className="size-card">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-black text-lg shrink-0"
                      style={{ background: "rgba(255,87,34,0.12)", border: `1.5px solid rgba(255,87,34,0.35)`, color: C.orange }}>
                      {s}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: C.text }}>{info.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: C.muted }}>{info.circumference} · {info.weight}</p>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: C.dim }}>{info.audience}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="py-32 px-5 text-center relative overflow-hidden" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div className="absolute pointer-events-none" style={{ width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,87,34,0.08) 0%, transparent 65%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", filter: "blur(80px)" }} />

        <Reveal>
          <h2
            className="font-display font-black mb-4 relative z-10"
            style={{ fontSize: "clamp(48px, 10vw, 120px)", lineHeight: 1.0, letterSpacing: "-0.03em" }}
          >
            <span style={{ color: C.text }}>Ready to find</span><br />
            <span style={{ color: C.orange }}>your size?</span>
          </h2>
          <p className="mb-10 text-sm relative z-10" style={{ color: C.muted }}>Takes under 30 seconds. No account needed.</p>
          <a href="/app" className="btn-primary relative z-10">
            Open the App
            <svg className="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </Reveal>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="py-10 px-5 text-center" style={{ borderTop: `1px solid ${C.border}`, background: C.bg }}>
        <a href="/" className="inline-flex items-center justify-center gap-2.5 mb-3 hover:opacity-70 transition-opacity">
          <Logo size={22} />
          <span className="font-display font-black text-base tracking-tight" style={{ color: C.text }}>BasketFit</span>
        </a>
        <p className="text-xs uppercase tracking-widest" style={{ color: C.dim }}>
          AI Basketball Size Recommender · {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ backdropFilter: "blur(20px)", background: "rgba(0,0,0,0.85)", borderBottom: `1px solid ${C.border}` }}>
      <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
        <Logo size={28} />
        <span className="font-display font-black text-base tracking-tight" style={{ color: C.text }}>BasketFit</span>
      </a>
      <a href="/app" className="btn-primary" style={{ padding: "10px 20px", fontSize: "13px", borderRadius: "10px" }}>
        Get Started
      </a>
    </nav>
  );
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.28em] font-semibold" style={{ color: C.muted }}>
      <span className="w-1 h-1 rounded-full inline-block" style={{ background: C.muted }} />
      {children}
    </span>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.7)" }}>
      {children}
    </span>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconTarget() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function IconCamera() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
