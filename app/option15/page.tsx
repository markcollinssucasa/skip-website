"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  MotionConfig,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  Home,
  Landmark,
  Lock,
  ShieldCheck,
  Star,
  Users,
  X,
} from "lucide-react";

import { SkipLogo } from "@/components/brand/skip-logo";
import { SkipRooRunnerGame, type SkipRooRunnerGameHandle } from "@/components/ui/skip-roo-runner-game";
import { SkipRooRunnerScrollPreview } from "@/components/ui/skip-roo-runner-scroll-preview";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─── Constants ────────────────────────────────────────────────────── */

const MOTION_EASE = [0.22, 1, 0.36, 1] as const;
const APPLY_URL = "https://apply.skiploans.com.au/";

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "Skip Financial",
  url: "https://www.skip.com.au",
  description: "2% deposit home loans with bank-style process and Australian regulatory oversight.",
  areaServed: "AU",
  telephone: "+61-1300-000-000",
  sameAs: ["https://www.skip.com.au"],
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Skip",
  url: "https://www.skip.com.au",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.skip.com.au/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

type PricingMode = "purchase" | "refinance";

interface PricingData {
  effectiveRate: string;
  comparisonRate: string;
}

interface PricingSet {
  purchase: PricingData;
  refinance: PricingData;
}

const HOME_RATES: PricingSet = {
  purchase: { effectiveRate: "6.30", comparisonRate: "6.63" },
  refinance: { effectiveRate: "6.12", comparisonRate: "6.44" },
};

const INVESTMENT_RATES: PricingSet = {
  purchase: { effectiveRate: "6.65", comparisonRate: "6.95" },
  refinance: { effectiveRate: "6.49", comparisonRate: "6.82" },
};


const FIRST_HOME_BUYER_ROWS = [
  { label: "Deposit", firstHomeBuyer: "5%", skip: "2%" },
  { label: "Property price", firstHomeBuyer: "Caps limit your choice", skip: "No caps" },
  { label: "Flexibility", firstHomeBuyer: "You may owe money if you sell", skip: "You can do what you want" },
  { label: "Available to", firstHomeBuyer: "Only first home buyers", skip: "Everyone" },
  { label: "Deposit rules", firstHomeBuyer: "Must use all your money", skip: "No restrictions" },
];

/* ─── Animated counter hook ───────────────────────────────────────── */

function useCountUp(end: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!startOnView || !isInView || hasStarted.current) return;
    hasStarted.current = true;

    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, end, duration, startOnView]);

  return { count, ref };
}

/* ─── Reveal wrapper ──────────────────────────────────────────────── */

function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: MOTION_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Header — Floating pill nav ──────────────────────────────────── */

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto mt-4 flex w-[94%] max-w-5xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500",
          scrolled
            ? "mt-3 border border-white/15 bg-ink/80 shadow-2xl backdrop-blur-2xl"
            : "border border-transparent bg-transparent",
        )}
      >
        <SkipLogo variant={1} className="h-7 rounded-full" priority />
        <nav aria-label="Primary" className="hidden items-center gap-8 text-[13px] font-medium md:flex">
          <a href="#features" className={cn("rounded-sm transition-colors", scrolled ? "text-white/70 hover:text-white" : "text-white/80 hover:text-white")}>Features</a>
          <a href="#calculator" className={cn("rounded-sm transition-colors", scrolled ? "text-white/70 hover:text-white" : "text-white/80 hover:text-white")}>Calculator</a>
          <a href="#rates" className={cn("rounded-sm transition-colors", scrolled ? "text-white/70 hover:text-white" : "text-white/80 hover:text-white")}>Rates</a>
          <a href="#how-it-works" className={cn("rounded-sm transition-colors", scrolled ? "text-white/70 hover:text-white" : "text-white/80 hover:text-white")}>How it works</a>
        </nav>
        <a
          href={APPLY_URL}
          className={cn(
            buttonVariants({ size: "sm" }),
            "rounded-full bg-mint px-5 font-semibold text-brand hover:bg-mint/90 transition-transform hover:scale-105 active:scale-95",
          )}
        >
          Get started
        </a>
      </div>
    </header>
  );
}

/* ─── Hero — Asymmetrical glass card ────────────────────────────── */

function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.1]);
  const textY = useTransform(scrollY, [0, 500], [0, 80]);

  return (
    <section className="relative flex min-h-[110svh] items-center overflow-hidden bg-brand">
      {/* Background image with parallax */}
      <motion.div
        style={shouldReduceMotion ? undefined : { scale: heroScale }}
        className="absolute inset-0"
      >
        <Image
          src="/hero-kangaroo-wide-sunrise.png"
          alt="Skip mascot at sunrise"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover"
          style={{ objectPosition: "62% 18%" }}
        />
        {/* Overlays to ensure text contrast and cinematic feel */}
        <div className="absolute inset-0 bg-linear-to-b from-brand/20 via-brand/10 to-brand/90 md:from-brand/10 md:via-brand/5 md:to-brand/80" />
        <div className="absolute inset-0 bg-linear-to-r from-brand/50 via-brand/20 to-transparent md:from-brand/80 md:via-brand/40 md:to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={shouldReduceMotion ? undefined : { opacity: heroOpacity, y: textY }}
        className="relative z-10 w-full"
      >
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-12 md:pb-32 md:pt-40">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Left side typography */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: MOTION_EASE }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 backdrop-blur-xl"
              >
                <span className="h-2 w-2 rounded-full bg-mint animate-pulse" />
                <span className="text-[13px] font-medium tracking-wide text-white/90">
                  Australian licensed lender
                </span>
              </motion.div>
              
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: MOTION_EASE }}
                  className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] tracking-[-0.03em] text-white drop-shadow-lg"
                >
                  Skip to the
                  <br />
                  <span className="inline-block text-white/90">owning bit</span>
                  <br />
                  <span className="inline-block text-white/70">with just</span>{" "}
                  <span className="inline-block bg-linear-to-r from-mint via-mint to-[#a8e6c1] bg-clip-text text-transparent">
                    2%.
                  </span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: MOTION_EASE }}
                  className="max-w-xl text-lg leading-relaxed text-white/80 md:text-xl drop-shadow"
                >
                  Same bank-grade process. Same legal protections. A dramatically smaller deposit so you can buy on your timeline.
                </motion.p>
              </div>
            </div>

            {/* Right side glass card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: MOTION_EASE }}
              className="relative mx-auto w-full max-w-md lg:ml-auto lg:mr-0"
            >
              <div className="absolute -inset-1 rounded-[2.5rem] bg-linear-to-br from-mint/30 via-white/10 to-transparent blur-xl" />
              <div className="relative rounded-[2rem] border border-white/20 bg-brand-dark/40 p-8 shadow-2xl backdrop-blur-2xl">
                <div className="mb-6 space-y-2 text-center">
                  <h3 className="font-display text-3xl tracking-tight text-white">Start your journey</h3>
                  <p className="text-sm text-white/70">Get pre-approved with just a 2% deposit</p>
                </div>
                
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-mint/80">Property Value</p>
                    <p className="mt-1 font-display text-3xl text-white">$1,000,000</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-white/50">Traditional</p>
                      <p className="mt-1 font-display text-xl text-white/50 line-through">$200k</p>
                    </div>
                    <div className="flex-1 rounded-xl border border-mint/30 bg-mint/10 p-4">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-mint">Skip Deposit</p>
                      <p className="mt-1 font-display text-2xl text-mint">$20k</p>
                    </div>
                  </div>
                  
                  <a
                    href={APPLY_URL}
                    className={cn(
                      buttonVariants({ size: "xl" }),
                      "mt-2 w-full group rounded-full bg-mint text-brand font-semibold hover:bg-mint/90 shadow-[0_0_20px_rgba(121,200,155,0.3)] transition-transform hover:scale-[1.02] active:scale-95",
                    )}
                  >
                    Start application
                    <ArrowRight className="size-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </a>
                  
                  <p className="text-center text-xs text-white/40 pt-2">
                    10-minute application • 48-hour response
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border border-white/30 p-1.5 backdrop-blur-sm bg-black/10"
        >
          <div className="h-2 w-1 rounded-full bg-white/80" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Social proof — Animated counters ────────────────────────────── */

function SocialProofStrip() {
  const rating = useCountUp(48, 1800);
  const settlements = useCountUp(850, 2200);
  const families = useCountUp(3000, 2400);

  return (
    <section className="relative border-b border-brand/8 bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 divide-y divide-brand/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { ref: rating.ref, icon: Star, value: `${(rating.count / 10).toFixed(1)}/5`, label: "Customer rating", detail: "1,200+ reviews" },
            { ref: settlements.ref, icon: DollarSign, value: `$${settlements.count}M+`, label: "Settlements", detail: "Delivered nationally" },
            { ref: families.ref, icon: Users, value: `${families.count.toLocaleString()}+`, label: "Families settled", detail: "Across Australia" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-4 px-6 py-7 sm:justify-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/8 text-brand">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p ref={item.ref} className="font-display text-3xl tracking-tight text-brand">{item.value}</p>
                  <p className="text-xs text-ink/45">{item.label} &middot; {item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Bento Grid — Apple-style feature showcase ───────────────────── */

function BentoSection() {
  return (
    <section id="features" className="relative overflow-hidden bg-canvas py-24 md:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-mint/8 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-brand/6 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <Reveal className="mb-16 max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand/50">Why Skip</p>
          <h2 className="font-display text-5xl tracking-[-0.03em] text-brand md:text-6xl lg:text-7xl">
            Everything you need.
            <br />
            <span className="text-brand/40">Nothing you don&rsquo;t.</span>
          </h2>
        </Reveal>

        {/* Bento grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Large feature card — 2% deposit */}
          <Reveal delay={0.1} className="md:col-span-2 lg:col-span-2">
            <div className="group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[2rem] bg-linear-to-br from-brand via-brand to-brand-dark p-8 text-white md:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(121,200,155,0.25),transparent_50%)]" />
              <div className="absolute -bottom-20 -right-20 h-[300px] w-[300px] rounded-full bg-mint/15 blur-[80px] transition-transform duration-700 group-hover:scale-110" />
              <div className="relative space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium tracking-wide backdrop-blur-sm">
                  <Home className="size-3.5" />
                  The Skip advantage
                </div>
                <h3 className="max-w-md font-display text-4xl tracking-[-0.02em] md:text-5xl">
                  2% deposit.
                  <br />
                  100% real home loan.
                </h3>
                <p className="max-w-md text-base text-white/65">
                  Where banks ask for 20%, Skip asks for 2%. Same rules, same protections, same process.
                  Just 10x less cash upfront.
                </p>
              </div>
              <div className="relative mt-6 flex items-center gap-8">
                <div>
                  <p className="font-display text-6xl tracking-tight md:text-7xl">2%</p>
                  <p className="text-xs tracking-wide text-white/50">Skip deposit</p>
                </div>
                <div className="h-16 w-px bg-white/15" />
                <div>
                  <p className="font-display text-6xl tracking-tight text-white/25 md:text-7xl">20%</p>
                  <p className="text-xs tracking-wide text-white/30">Bank deposit</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Licensed lender */}
          <Reveal delay={0.2}>
            <div className="group flex h-full min-h-[340px] flex-col justify-between rounded-[2rem] border border-brand/10 bg-white p-8 transition-all hover:border-brand/20 hover:shadow-refined">
              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/8 text-brand transition-colors group-hover:bg-mint/20">
                  <Landmark className="size-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-ink">Licensed Australian lender</h3>
                <p className="text-sm leading-relaxed text-ink/55">
                  Full regulatory compliance under Australian law. Real lending protections. Real accountability.
                </p>
              </div>
              <p className="mt-6 text-xs tracking-wide text-brand/40">ACL XXXXXX</p>
            </div>
          </Reveal>

          {/* 48-hour card */}
          <Reveal delay={0.15}>
            <div className="group flex h-full min-h-[280px] flex-col justify-between rounded-[2rem] bg-linear-to-br from-mint/20 via-mint/10 to-canvas p-8 transition-all hover:shadow-refined">
              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
                  <Clock3 className="size-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-ink">48-hour pre-approval</h3>
                <p className="text-sm leading-relaxed text-ink/55">
                  A specialist reviews your file. Most eligible applications get feedback within 48 hours.
                </p>
              </div>
              <p className="mt-6 font-display text-5xl tracking-tight text-brand/20">48h</p>
            </div>
          </Reveal>

          {/* Security card */}
          <Reveal delay={0.25}>
            <div className="group flex h-full min-h-[280px] flex-col justify-between rounded-[2rem] border border-brand/10 bg-white p-8 transition-all hover:border-brand/20 hover:shadow-refined">
              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/8 text-brand transition-colors group-hover:bg-mint/20">
                  <ShieldCheck className="size-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-ink">Bank-grade security</h3>
                <p className="text-sm leading-relaxed text-ink/55">
                  Application data, documents, and approvals handled with the same security standards as major banks.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <Lock className="size-3.5 text-brand/30" />
                <p className="text-xs text-brand/30">End-to-end encrypted</p>
              </div>
            </div>
          </Reveal>

          {/* Savings highlight — wide card */}
          <Reveal delay={0.2} className="lg:col-span-2">
            <div className="group relative flex min-h-[240px] items-center overflow-hidden rounded-[2rem] border border-brand/10 bg-white p-8 transition-all hover:shadow-refined-lg md:p-10">
              <div className="absolute -right-8 -top-8 h-[200px] w-[200px] rounded-full bg-mint/8 blur-[60px]" />
              <div className="relative grid w-full gap-8 md:grid-cols-2 md:items-center">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand/50">On a $1M property</p>
                  <h3 className="font-display text-4xl tracking-[-0.02em] text-brand md:text-5xl">
                    Save $180,000
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/55">
                    That&rsquo;s the difference between a 20% deposit and Skip&rsquo;s 2%. Money that stays in your pocket.
                  </p>
                </div>
                <div className="flex items-end gap-4">
                  {/* Visual bar comparison */}
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-full rounded-full bg-brand/10" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-ink/40">Bank deposit</span>
                      <span className="font-semibold text-ink/40">$200k</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex h-3 rounded-full bg-brand/10">
                      <div className="h-full w-[10%] rounded-full bg-mint" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-brand">Skip deposit</span>
                      <span className="font-semibold text-brand">$20k</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Calculator — Clean interactive ──────────────────────────────── */

function CalculatorSection() {
  const [deposit, setDeposit] = useState(20000);
  const propertyValue = deposit * 50;
  const stampDuty = propertyValue * 0.04;
  const traditionalDeposit = propertyValue * 0.2;
  const savings = traditionalDeposit - deposit;

  return (
    <section id="calculator" className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(121,200,155,0.08),transparent_40%)]" />
        <div className="absolute inset-0 dot-pattern opacity-25" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <Reveal className="mb-16 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand/50">Calculator</p>
          <h2 className="mx-auto max-w-[20ch] font-display text-5xl tracking-[-0.03em] text-brand md:text-6xl lg:text-7xl">
            See what your savings can buy.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Input panel */}
              <div className="rounded-[2rem] border border-brand/10 bg-canvas p-8 lg:col-span-2">
                <label className="mb-8 block text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">
                  Your savings
                </label>
                <div className="mb-8 font-display text-6xl tracking-tight text-brand md:text-7xl">
                  ${(deposit / 1000).toFixed(0)}k
                </div>
                <input
                  type="range"
                  value={deposit}
                  min={5000}
                  max={100000}
                  step={1000}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-brand/10 accent-brand"
                  aria-label="Deposit amount"
                />
                <div className="mt-3 flex justify-between text-xs text-ink/35">
                  <span>$5k</span>
                  <span>$100k</span>
                </div>

                <div className="mt-8 space-y-4 border-t border-brand/10 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink/50">Your deposit (2%)</span>
                    <span className="font-semibold text-brand">${(deposit / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink/50">Skip funds (98%)</span>
                    <span className="font-semibold text-brand">${((propertyValue - deposit) / 1000000).toFixed(2)}M</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4 lg:col-span-3">
                {/* Property value — hero card */}
                <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-brand via-brand-mid to-brand p-8 text-white md:p-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(121,200,155,0.3),transparent_50%)]" />
                  <div className="relative">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                        <Home className="size-4 text-mint" />
                      </div>
                      <span className="text-xs font-medium uppercase tracking-wider text-white/60">Property value</span>
                    </div>
                    <p className="font-display text-7xl tracking-tight md:text-8xl">
                      ${(propertyValue / 1000000).toFixed(2)}M
                    </p>
                    <p className="mt-2 text-sm text-white/50">Estimated purchasing power with 2% deposit</p>
                  </div>
                </div>

                {/* Stat row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-brand/10 bg-canvas p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">Stamp duty</p>
                    <p className="mt-2 font-display text-2xl tracking-tight text-brand md:text-3xl">${(stampDuty / 1000).toFixed(0)}k</p>
                    <p className="mt-1 text-[10px] text-ink/30">Approx.</p>
                  </div>
                  <div className="rounded-2xl border border-brand/10 bg-canvas p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">Total upfront</p>
                    <p className="mt-2 font-display text-2xl tracking-tight text-brand md:text-3xl">${((deposit + stampDuty) / 1000).toFixed(0)}k</p>
                    <p className="mt-1 text-[10px] text-ink/30">Deposit + duty</p>
                  </div>
                  <div className="rounded-2xl border border-mint/30 bg-linear-to-br from-mint/15 to-mint/5 p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand/50">You save</p>
                    <p className="mt-2 font-display text-2xl tracking-tight text-brand md:text-3xl">${(savings / 1000).toFixed(0)}k</p>
                    <p className="mt-1 text-[10px] text-brand/40">vs. 20% deposit</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a href={APPLY_URL} className={cn(buttonVariants({ variant: "brand" }), "h-14 rounded-full px-10 text-base shadow-refined-lg transition-transform hover:scale-[1.02]")}>
                Get pre-approved in 48 hours
                <ArrowRight className="ml-1 size-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Comparison — Skip vs FHB ───────────────────────────────────── */

function ComparisonSection() {
  return (
    <section className="relative overflow-hidden bg-canvas py-24 md:py-32 border-t border-brand/8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(121,200,155,0.14),transparent_42%)]" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <Reveal className="mb-16 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand/50">Compare</p>
          <h2 className="mx-auto max-w-[22ch] font-display text-5xl tracking-[-0.03em] text-brand md:text-6xl">
            Better than the First Home Buyer Scheme
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-ink/60">
            Government schemes come with strings attached. Skip gives you freedom from day one.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          <Reveal delay={0.1}>
            <div className="h-full rounded-[2rem] border border-brand/8 bg-white/60 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-brand/8 px-8 py-6">
                <h3 className="font-display text-2xl tracking-[-0.02em] text-ink">
                  FHB Scheme
                </h3>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500/70">
                  <X className="h-5 w-5" />
                </span>
              </div>
              <div className="divide-y divide-brand/6">
                {FIRST_HOME_BUYER_ROWS.map((row) => (
                  <div key={`fhb-${row.label}`} className="flex items-start gap-4 px-8 py-5">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                      <X className="h-3.5 w-3.5 text-red-500/70" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
                        {row.label}
                      </p>
                      <p className="text-base font-medium text-ink/70">
                        {row.firstHomeBuyer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="h-full rounded-[2rem] border border-mint/30 bg-linear-to-b from-mint/15 to-mint/8 shadow-refined-lg">
              <div className="flex items-center justify-between border-b border-brand/12 px-8 py-6">
                <h3 className="font-display text-2xl tracking-[-0.02em] text-brand">
                  Skip
                </h3>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
                  <Check className="h-5 w-5" />
                </span>
              </div>
              <div className="divide-y divide-brand/8">
                {FIRST_HOME_BUYER_ROWS.map((row) => (
                  <div key={`skip-${row.label}`} className="flex items-start gap-4 px-8 py-5">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint/30">
                      <Check className="h-3.5 w-3.5 text-brand" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand/55">
                        {row.label}
                      </p>
                      <p className="text-base font-semibold text-brand">
                        {row.skip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Rates — Dark cinematic section ──────────────────────────────── */

function RatesSection() {
  const [mode, setMode] = useState<PricingMode>("purchase");
  const homeRate = HOME_RATES[mode];
  const investRate = INVESTMENT_RATES[mode];

  return (
    <section id="rates" className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-brand/20 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-mint/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <Reveal className="mb-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-mint/60">Pricing</p>
              <h2 className="font-display text-5xl tracking-[-0.03em] md:text-6xl lg:text-7xl">
                Transparent rates.
              </h2>
              <p className="mt-4 max-w-md text-base text-white/45">
                No hidden fees, no surprises. Compare effective and comparison rates side by side.
              </p>
            </div>

            <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setMode("purchase")}
                className={cn(
                  "rounded-full px-6 py-2.5 text-sm font-medium transition-all",
                  mode === "purchase" ? "bg-mint text-brand shadow-lg" : "text-white/50 hover:text-white",
                )}
              >
                Purchase
              </button>
              <button
                type="button"
                onClick={() => setMode("refinance")}
                className={cn(
                  "rounded-full px-6 py-2.5 text-sm font-medium transition-all",
                  mode === "refinance" ? "bg-mint text-brand shadow-lg" : "text-white/50 hover:text-white",
                )}
              >
                Refinance
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { label: "Owner Occupied", rate: homeRate },
              { label: "Investment", rate: investRate },
            ].map((card) => (
              <div key={card.label} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/8 md:p-10">
                <div className="absolute -right-16 -top-16 h-[200px] w-[200px] rounded-full bg-mint/5 blur-[60px] transition-opacity group-hover:opacity-100 opacity-0" />
                <div className="relative space-y-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-mint/80">{card.label}</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">Effective rate</p>
                      <p className="mt-2 font-display text-6xl leading-none tracking-tight">{card.rate.effectiveRate}%</p>
                      <p className="mt-1 text-xs text-white/35">p.a.</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">Comparison rate</p>
                      <p className="mt-2 font-display text-6xl leading-none tracking-tight text-white/60">{card.rate.comparisonRate}%</p>
                      <p className="mt-1 text-xs text-white/35">p.a.**</p>
                    </div>
                  </div>
                  <a
                    href={APPLY_URL}
                    className={cn(
                      buttonVariants({ variant: "mint", size: "lg" }),
                      "rounded-full font-semibold",
                    )}
                  >
                    Apply now <ChevronRight className="ml-1 size-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Roo runner section ───────────────────────────────────────────── */

function RooRunnerSection() {
  const [playingInline, setPlayingInline] = useState(false);
  const [showPlayHintModal, setShowPlayHintModal] = useState(false);
  const gameRef = useRef<SkipRooRunnerGameHandle>(null);

  useEffect(() => {
    if (!showPlayHintModal) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowPlayHintModal(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPlayHintModal]);

  return (
    <section id="roo-runner" className="py-24 bg-white md:py-32 overflow-hidden border-t border-brand/8">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal className="space-y-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-3 rounded-full bg-brand/10 text-brand hover:bg-brand/10">Interactive</Badge>
            <h2 className="font-display text-4xl md:text-5xl text-brand tracking-[-0.02em]">Leap Past The Old Hurdles</h2>
            <p className="mx-auto mt-3 max-w-[56ch] text-base leading-relaxed text-ink/65">
              While traditional banks keep moving the finish line, Skip gets you there faster. Try it yourself.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="mt-12 w-full">
        {playingInline ? (
          <SkipRooRunnerGame
            ref={gameRef}
            keyboardScope="global"
            variant="full-bleed"
            hudMode="overlay"
            autoStart
          />
        ) : (
          <SkipRooRunnerScrollPreview />
        )}
      </div>

      <div className="flex flex-col items-center gap-3 mt-10">
        {!playingInline ? (
          <button
            type="button"
            onClick={() => {
              setPlayingInline(true);
              setShowPlayHintModal(true);
            }}
            className={cn(
              buttonVariants({ variant: "brand", size: "lg" }),
              "rounded-full px-10 font-semibold shadow-refined",
            )}
          >
            Play the game
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => gameRef.current?.jump()}
              className={cn(
                buttonVariants({ variant: "brand", size: "lg" }),
                "rounded-full px-10 font-semibold shadow-refined",
              )}
            >
              Jump! (Space)
            </button>
          </>
        )}
      </div>

      {showPlayHintModal && (
        <div
          className="fixed inset-0 z-90 flex items-center justify-center bg-ink/45 px-4 backdrop-blur-[2px]"
          onClick={() => setShowPlayHintModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Game controls"
            className="w-full max-w-md rounded-2xl border border-brand/15 bg-white p-6 text-center shadow-refined-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand/55">How to play</p>
            <p className="mt-3 text-lg font-semibold text-brand">
              Tap, click or press space to jump over hurdles
            </p>
            <button
              type="button"
              onClick={() => setShowPlayHintModal(false)}
              className={cn(
                buttonVariants({ variant: "brand", size: "sm" }),
                "mt-5 rounded-full px-6",
              )}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── CTA — Dramatic full-bleed ───────────────────────────────────── */

function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-brand py-24 text-white md:py-32">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-brand-dark/25 blur-[150px]" />
        <div className="absolute right-1/4 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-mint/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-12">
        <Reveal>
          <SkipLogo variant={1} className="mx-auto mb-8 h-12 rounded-full md:h-14" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-5xl tracking-[-0.03em] md:text-6xl lg:text-[5rem]">
            Ready to skip<br className="hidden sm:block" /> to the owning bit?
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            Start with just 2% deposit. Same bank-grade process, 10x less upfront.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-mint" />
              10-minute application
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-mint" />
              Response in 48 hours
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-mint" />
              Licensed Australian lender
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={APPLY_URL}
              className={cn(
                buttonVariants({ size: "xl" }),
                "rounded-full bg-white px-10 font-semibold text-ink hover:bg-white/90 transition-transform hover:scale-[1.02]",
              )}
            >
              Apply now <ArrowRight className="ml-1 size-4" />
            </a>
            <a
              href="#calculator"
              className={cn(
                buttonVariants({ variant: "glass", size: "xl" }),
                "rounded-full border-white/20 px-10",
              )}
            >
              Calculate first
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────────────── */

function FooterSection() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <SkipLogo variant={1} className="h-8 rounded-full" />
            <p className="max-w-sm text-sm leading-relaxed text-white/40">
              Making property ownership accessible with 2% deposit home loans. Licensed and regulated in Australia.
            </p>
            <Button className="rounded-full shadow-lg" size="lg" variant="mint">
              Apply now <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Product</h4>
            <ul className="space-y-3 text-sm text-white/40">
              <li><a href="#calculator" className="transition-colors hover:text-mint">Calculator</a></li>
              <li><a href="#how-it-works" className="transition-colors hover:text-mint">How it works</a></li>
              <li><a href="#rates" className="transition-colors hover:text-mint">Pricing</a></li>
              <li><a href="#faq" className="transition-colors hover:text-mint">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Compliance</h4>
            <ul className="space-y-3 text-sm text-white/40">
              <li>Australian Credit Licence XXXXXX</li>
              <li>Responsible lending framework</li>
              <li>Bank-grade security controls</li>
              <li>Australian support team</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Legal & Contact</h4>
            <ul className="space-y-3 text-sm text-white/40">
              <li><a href="#" className="transition-colors hover:text-mint">Privacy</a></li>
              <li><a href="#" className="transition-colors hover:text-mint">Terms</a></li>
              <li><a href="#" className="transition-colors hover:text-mint">Disclaimer</a></li>
              <li><a href="#" className="transition-colors hover:text-mint">Credit Guide</a></li>
              <li>support@skip.com.au</li>
              <li>1300 000 000</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 space-y-6 border-t border-white/8 pt-8">
          <div className="rounded-xl border border-white/8 bg-white/3 p-6 backdrop-blur-sm">
            <p className="text-xs leading-relaxed text-white/30">
              <strong className="font-semibold text-white/50">Important:</strong> Skip is a registered trading name of Skip
              Financial Pty Ltd ACN XXX XXX XXX, Australian Credit Licence XXXXXX. This website contains general information
              only. Consider your circumstances before proceeding.
            </p>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/25 md:flex-row">
            <p>&copy; 2026 Skip Financial. All rights reserved.</p>
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-mint/50" />
              Australian owned and operated
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Mobile Sticky CTA ───────────────────────────────────────────── */

function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY >= window.innerHeight * 0.6);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 px-4 py-3 shadow-2xl backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <a
        href={APPLY_URL}
        className={cn(
          buttonVariants({ variant: "mint", size: "lg" }),
          "w-full rounded-full font-semibold",
        )}
      >
        Get started <ArrowRight className="ml-1 size-4" />
      </a>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────── */

export default function Option15Page() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative overflow-x-clip bg-canvas text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }} />

        <Header />

        <main className="pb-24 md:pb-0">
          <Hero />
          <SocialProofStrip />
          <BentoSection />
          <CalculatorSection />
          <ComparisonSection />
          <RatesSection />
          <RooRunnerSection />
          <CtaSection />
        </main>

        <FooterSection />
        <MobileStickyCta />

      </div>
    </MotionConfig>
  );
}
