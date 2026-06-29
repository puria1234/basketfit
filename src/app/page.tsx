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
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── Palette helpers ──────────────────────────────────────────────────────────

const C = {
  orange:   "#FF5722",
  orangeLt: "#FF7D53",
  cyan:     "#06B6D4",
  cyanDim:  "rgba(6,182,212,0.11)",
  cyanBdr:  "rgba(6,182,212,0.18)",
  lime:     "#84CC16",
  text:     "#F0F4F8",
  muted:    "rgba(240,244,248,0.37)",
  surface:  "rgba(255,255,255,0.03)",
  surfBdr:  "rgba(255,255,255,0.07)",
  bg:       "#0C1220",
};

// ─── Landing page ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <LandingNav />

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: C.bg }}>
        {/* Cyan grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(${C.cyanDim} 1px, transparent 1px), linear-gradient(to right, ${C.cyanDim} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />

        {/* Orange glow behind ball */}
        <div className="absolute pointer-events-none animate-orb-a" style={{
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,87,34,0.16) 0%, transparent 65%)",
          top: "5%", left: "calc(50% - 250px)", filter: "blur(60px)",
        }} />

        {/* Cyan glow bottom-left */}
        <div className="absolute pointer-events-none animate-orb-b" style={{
          width: 380, height: 380, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 65%)`,
          bottom: "8%", left: "5%", filter: "blur(70px)",
        }} />

        {/* 3D Ball */}
        <div className="animate-float w-full max-w-[260px] relative z-10">
          <Suspense fallback={<div style={{ height: 310 }} />}>
            <Basketball3D size={7} />
          </Suspense>
        </div>

        {/* Copy */}
        <div className="relative z-10 text-center px-5 -mt-2">
          {/* Eyebrow with two pills */}
          <div className="flex items-center justify-center gap-2 mb-5 animate-fade-up">
            <Pill color={C.orange}>AI-Powered</Pill>
            <Pill color={C.cyan}>Free Forever</Pill>
          </div>

          <h1 className="font-display font-extrabold leading-[0.88] animate-fade-up-d1"
            style={{
              fontSize: "clamp(68px, 15vw, 188px)",
              background: `linear-gradient(160deg, ${C.text} 0%, ${C.text} 45%, ${C.cyan} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
            BASKETFIT
          </h1>

          <p className="mt-5 text-base sm:text-lg max-w-sm mx-auto leading-relaxed animate-fade-up-d2" style={{ color: C.muted }}>
            Know your size before you buy.<br className="hidden sm:block" />
            Smart fitting powered by AI vision.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-fade-up-d3">
            <a href="/app"
              className="px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide text-white transition-all hover:brightness-110 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${C.orange} 0%, #C84315 100%)` }}>
              Find My Size
            </a>
            <a href="#how-it-works"
              className="px-8 py-4 rounded-2xl font-semibold text-sm text-white hover:bg-white/5 transition-colors"
              style={{ border: `1px solid ${C.cyanBdr}`, color: C.cyan }}>
              How it works
            </a>
          </div>
        </div>

        {/* Scroll caret */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-y">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(6,182,212,0.35)" strokeWidth="2" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section style={{ background: "#0E1627", borderTop: `1px solid ${C.cyanBdr}`, borderBottom: `1px solid ${C.cyanBdr}` }}>
        <div className="max-w-3xl mx-auto px-5 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { v: "4",    l: "Ball Sizes",      col: C.orange },
            { v: "3",    l: "Retailers",        col: C.cyan },
            { v: "AI",   l: "Vision Measure",   col: C.lime },
            { v: "Free", l: "Forever",          col: C.orangeLt },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display font-bold text-4xl" style={{ color: s.col }}>{s.v}</p>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "rgba(240,244,248,0.24)" }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="py-28 px-5" style={{ background: C.bg }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <Tag color={C.cyan}>What we do</Tag>
            <h2 className="font-display font-extrabold mt-4 mb-14" style={{ fontSize: "clamp(38px, 7vw, 80px)", lineHeight: 1.0, color: C.text }}>
              Smart sizing.<br />
              <span style={{ color: C.orange }}>Built for players.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: <IconTarget />, title: "Smart Fit Score",   desc: "We weigh age, height, hand span, experience and gender to produce a 0-100 fit score mapped to the right ball size." },
              { icon: <IconCamera />, title: "AI Vision Measure", desc: "Photograph your hand with a ruler beside it. MiniMax M3 reads your hand span in seconds." },
              { icon: <IconBag />,   title: "Shop Ready",         desc: "Every recommendation links directly to Amazon, Walmart and Target with curated picks and estimated prices." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 90} className="h-full">
                <div className="rounded-2xl p-6 h-full flex flex-col gap-4 transition-colors group"
                  style={{ background: C.cyanDim, border: `1px solid ${C.cyanBdr}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `rgba(6,182,212,0.15)`, border: `1px solid rgba(6,182,212,0.25)` }}>
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
      <section id="how-it-works" className="py-28 px-5" style={{ background: "#0E1627", borderTop: `1px solid ${C.cyanBdr}` }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <Tag color={C.orange}>The process</Tag>
            <h2 className="font-display font-extrabold mt-4 mb-16" style={{ fontSize: "clamp(38px, 7vw, 80px)", lineHeight: 1.0, color: C.text }}>
              Three steps to your<br />
              <span style={{ background: `linear-gradient(135deg, ${C.text} 0%, ${C.muted} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                perfect ball.
              </span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {[
              { n: "01", col: C.orange, title: "Tell us about you",    desc: "Enter age, height, hand span and experience. Under 30 seconds." },
              { n: "02", col: C.cyan,   title: "Get your AI result",   desc: "We calculate your fit score and recommend the right size with personalised coaching tips." },
              { n: "03", col: C.lime,   title: "Buy the right ball",   desc: "Click through to Amazon, Walmart or Target and start playing with the correct size." },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <div className="flex flex-col gap-3">
                  <span className="font-display font-bold select-none" style={{ fontSize: 86, lineHeight: 1, color: step.col, opacity: 0.22 }}>
                    {step.n}
                  </span>
                  <div className="w-8 h-0.5 -mt-1 rounded-full" style={{ background: step.col }} />
                  <h3 className="font-semibold text-base" style={{ color: C.text }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SIZES ══ */}
      <section className="py-28 px-5" style={{ background: C.bg, borderTop: `1px solid ${C.cyanBdr}` }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <Tag color={C.lime}>The sizes</Tag>
            <h2 className="font-display font-extrabold mt-4 mb-12" style={{ fontSize: "clamp(38px, 7vw, 80px)", lineHeight: 1.0, color: C.text }}>
              Know your options.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {([7, 6, 5, 3] as BallSize[]).map((s, i) => {
              const info = BALL_SIZE_INFO[s];
              const cols = [C.orange, C.cyan, C.lime, C.orangeLt];
              const col = cols[i % cols.length];
              return (
                <Reveal key={s} delay={i * 70}>
                  <div className="flex items-start gap-4 p-5 rounded-2xl"
                    style={{ background: C.surface, border: `1px solid rgba(255,255,255,0.07)` }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg shrink-0"
                      style={{ background: `${col}22`, border: `2px solid ${col}55`, color: col }}>
                      {s}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: C.text }}>{info.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: C.muted }}>{info.circumference} · {info.weight}</p>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(240,244,248,0.2)" }}>{info.audience}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="py-32 px-5 text-center relative overflow-hidden" style={{ background: "#0E1627", borderTop: `1px solid ${C.cyanBdr}` }}>
        {/* Dual glows */}
        <div className="absolute pointer-events-none" style={{ width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,87,34,0.1) 0%, transparent 65%)`, top: "50%", left: "30%", transform: "translate(-50%,-50%)", filter: "blur(80px)" }} />
        <div className="absolute pointer-events-none" style={{ width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%)`, top: "50%", right: "20%", transform: "translateY(-50%)", filter: "blur(80px)" }} />

        <Reveal>
          <h2 className="font-display font-extrabold mb-4 relative z-10" style={{ fontSize: "clamp(44px, 9vw, 108px)", lineHeight: 1.0 }}>
            Ready to find<br />
            <span style={{ color: C.orange }}>your size?</span>
          </h2>
          <p className="mb-8 text-sm relative z-10" style={{ color: C.muted }}>Takes under 30 seconds. No account needed.</p>
          <a href="/app"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-semibold text-base text-white transition-all hover:brightness-110 active:scale-95 relative z-10"
            style={{ background: `linear-gradient(135deg, ${C.orange} 0%, #C84315 100%)` }}>
            Open the App
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </Reveal>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="py-10 px-5 text-center" style={{ borderTop: `1px solid ${C.cyanBdr}`, background: C.bg }}>
        <a href="/" className="inline-flex items-center justify-center gap-2.5 mb-3 hover:opacity-70 transition-opacity">
          <Logo size={22} />
          <span className="font-display font-bold text-base tracking-wide" style={{ color: C.text }}>BasketFit</span>
        </a>
        <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(240,244,248,0.18)" }}>
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
      style={{ backdropFilter: "blur(20px)", background: "rgba(12,18,32,0.82)", borderBottom: `1px solid ${C.cyanBdr}` }}>
      <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
        <Logo size={28} />
        <span className="font-display font-bold text-base tracking-wide" style={{ color: C.text }}>BasketFit</span>
      </a>
      <a href="/app"
        className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-95"
        style={{ background: `linear-gradient(135deg, ${C.orange} 0%, #C84315 100%)` }}>
        Get Started
      </a>
    </nav>
  );
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function Tag({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.28em] font-semibold" style={{ color }}>
      <span className="w-1 h-1 rounded-full inline-block" style={{ background: color }} />
      {children}
    </span>
  );
}

function Pill({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
      {children}
    </span>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconTarget() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function IconCamera() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="1.8" strokeLinecap="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
