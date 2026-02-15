"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { MotionConfig, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
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
  TrendingDown,
  Users,
} from "lucide-react";

import { SkipLogo } from "@/components/brand/skip-logo";
import { SkipToOwningBitHeading } from "@/components/brand/skip-to-owning-bit-heading";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─── Constants ────────────────────────────────────────────────────── */

const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

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

const FAQ_ITEMS = [
  {
    question: "Is this a regulated home loan?",
    answer:
      "Yes. Skip follows Australian lending standards and responsible lending requirements, including full documentation checks and legal protections.",
  },
  {
    question: "Who is this best for?",
    answer:
      "First-home buyers and upgraders who can service a mortgage but are blocked by the traditional 20% deposit hurdle.",
  },
  {
    question: "How quickly can I apply?",
    answer:
      "You can start online in minutes. Most eligible applications receive pre-approval feedback within around 48 hours.",
  },
  {
    question: "What's the catch with a 2% deposit?",
    answer:
      "There's no catch. Skip charges a slightly higher rate to offset the lower deposit, but you avoid years of saving. The total cost is transparent from day one.",
  },
  {
    question: "Can I refinance later?",
    answer:
      "Absolutely. Once you've built equity in your property, you can refinance to a lower rate — just like any other home loan.",
  },
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
          href="#apply"
          className={cn(
            buttonVariants({ size: "sm" }),
            "rounded-full bg-mint px-5 font-semibold text-brand hover:bg-mint/90",
          )}
        >
          Get started
        </a>
      </div>
    </header>
  );
}

/* ─── Hero — Cinematic dark full-bleed ────────────────────────────── */

function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.1]);
  const textY = useTransform(scrollY, [0, 500], [0, 80]);
  const mobileHeroScale = 0.1;
  const mobileHeroOverscanPct = ((1 / mobileHeroScale - 1) / 2) * 100 + 2;

  return (
    <section className="relative flex min-h-[130svh] items-center overflow-hidden bg-brand">
      {/* Background image with parallax */}
      <motion.div
        style={shouldReduceMotion ? undefined : { scale: heroScale }}
        className="absolute inset-0"
      >
        {/* Portrait image for mobile — overscan tracks scale so it always stays edge-to-edge */}
        <div className="absolute md:hidden" style={{ inset: `-${mobileHeroOverscanPct}%` }}>
          <Image
            src="/hero-keys-kangaroo.png"
            alt="Skip mascot holding house keys"
            fill
            priority
            sizes="100vw"
            quality={75}
            className="object-cover"
            style={{ objectPosition: "50% 18%", transform: `scale(${mobileHeroScale})` }}
          />
        </div>
        {/* Wide image for desktop — hard-shift left via oversized frame */}
        <div className="absolute inset-0 hidden overflow-hidden md:block">
          <div className="absolute inset-y-0 -left-[24%] w-[128%]">
            <Image
              src="/hero-keys-kangaroo-wide.png"
              alt="Skip mascot holding house keys"
              fill
              priority
              sizes="100vw"
              quality={75}
              className="object-cover"
              style={{ objectPosition: "50% 78%" }}
            />
          </div>
        </div>
        {/* Green cover overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand/0 via-brand/20 to-brand/80 md:from-brand/20 md:via-brand/20 md:to-brand/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand/10 via-brand/5 to-brand/10 md:from-brand/60 md:via-brand/20 md:to-brand/40" />
      </motion.div>

      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div className="absolute -left-16 top-1/4 h-[600px] w-[600px] animate-[orb-drift_18s_ease-in-out_infinite] rounded-full bg-brand/40 blur-[100px]" />
        <div className="absolute -right-16 bottom-1/4 h-[500px] w-[500px] animate-[orb-drift_22s_ease-in-out_infinite_reverse] rounded-full bg-mint/30 blur-[80px]" />
      </div>

      {/* Content */}
      <motion.div
        style={shouldReduceMotion ? undefined : { opacity: heroOpacity, y: textY }}
        className="relative z-10 w-full"
      >
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-12 md:pb-32 md:pt-40">
          <div className="max-w-4xl space-y-8 md:ml-auto md:max-w-2xl md:text-right">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: MOTION_EASE }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 backdrop-blur-xl md:ml-auto"
            >
              <span className="h-2 w-2 rounded-full bg-mint animate-pulse" />
              <span className="text-[13px] font-medium tracking-wide text-white/80">
                Australian licensed lender
              </span>
            </motion.div>

            {/* Main heading — staggered word reveal */}
            <div className="space-y-2">
              <motion.h1
                className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-[-0.03em] text-white"
              >
                {["Skip", "to", "the"].map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: MOTION_EASE }}
                    className="mr-[0.25em] inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
                <br />
                {["owning", "bit"].map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: MOTION_EASE }}
                    className="mr-[0.25em] inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
                <br />
                {["with", "just"].map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 + i * 0.1, ease: MOTION_EASE }}
                    className="mr-[0.25em] inline-block text-white/70"
                  >
                    {word}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, delay: 0.8, ease: MOTION_EASE }}
                  className="inline-block bg-gradient-to-r from-mint via-mint to-[#a8e6c1] bg-clip-text text-transparent"
                >
                  2%.
                </motion.span>
              </motion.h1>
            </div>

            {/* Sub text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease: MOTION_EASE }}
              className="max-w-xl text-lg leading-relaxed text-white/60 md:ml-auto md:text-xl"
            >
              Same bank-grade process. Same legal protections. A dramatically smaller deposit so you can buy on your timeline, not the bank&rsquo;s.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.15, ease: MOTION_EASE }}
              className="flex flex-wrap items-center gap-4 pt-2 md:justify-end"
              id="apply"
            >
              <a
                href="#calculator"
                className={cn(
                  buttonVariants({ size: "xl" }),
                  "group rounded-full bg-white px-8 font-semibold text-ink hover:bg-white/90",
                )}
              >
                See what you can buy
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#rates"
                className={cn(
                  buttonVariants({ variant: "glass", size: "xl" }),
                  "rounded-full border-white/20 px-8",
                )}
              >
                View rates
              </a>
            </motion.div>

            {/* Micro-proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-sm text-white/40 md:justify-end"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-mint/60" />
                ACL XXXXXX
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-mint/60" />
                48-hour pre-approval
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-mint/60" />
                Bank-grade security
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5"
        >
          <div className="h-2 w-1 rounded-full bg-white/50" />
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
            <div className="group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-brand to-brand-dark p-8 text-white md:p-10">
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
            <div className="group flex h-full min-h-[280px] flex-col justify-between rounded-[2rem] bg-gradient-to-br from-mint/20 via-mint/10 to-canvas p-8 transition-all hover:shadow-refined">
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
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-brand-mid to-brand p-8 text-white md:p-10">
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
                  <div className="rounded-2xl border border-mint/30 bg-gradient-to-br from-mint/15 to-mint/5 p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand/50">You save</p>
                    <p className="mt-2 font-display text-2xl tracking-tight text-brand md:text-3xl">${(savings / 1000).toFixed(0)}k</p>
                    <p className="mt-1 text-[10px] text-brand/40">vs. 20% deposit</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button className="h-14 rounded-full px-10 text-base shadow-refined-lg" variant="brand">
                Get pre-approved in 48 hours
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </Reveal>
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
                    href="#apply"
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

/* ─── Comparison — Side by side ───────────────────────────────────── */

function ComparisonSection() {
  const rows = [
    { label: "Minimum deposit", bank: "20%", skip: "2%" },
    { label: "On a $1M property", bank: "$200,000", skip: "$20,000" },
    { label: "Time to save", bank: "~10 years", skip: "Now" },
    { label: "Lending process", bank: "Standard", skip: "Standard" },
    { label: "Regulatory oversight", bank: "Yes", skip: "Yes" },
  ];

  return (
    <section className="relative overflow-hidden bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal className="mb-16 text-center">
          <h2 className="font-display text-5xl tracking-[-0.03em] text-brand md:text-6xl lg:text-7xl">
            Same loan. <span className="text-brand/35">Smaller barrier.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-ink/50">
            Skip follows the same process as a bank. The only difference? How
            much deposit you need.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-brand/10 bg-white shadow-refined-lg">
            {/* Header */}
            <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-gradient-to-r from-brand to-brand-dark p-6">
              <div />
              <div className="text-center">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                  Traditional
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-mint">
                  Skip
                </div>
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-brand/8">
              {rows.map((row, i) => (
                <div
                  key={row.label}
                  className={cn(
                    "grid grid-cols-[1.2fr_1fr_1fr] items-center px-6 py-5",
                    i < 2 && "bg-mint/4",
                  )}
                >
                  <span className="text-sm font-medium text-ink/70">
                    {row.label}
                  </span>
                  <span className="text-center text-sm text-ink/40">
                    {row.bank}
                  </span>
                  <span className="text-center text-sm font-semibold text-brand">
                    {row.skip}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="border-t border-brand/8 bg-canvas/50 p-6 text-center">
              <div className="inline-flex items-center gap-3 rounded-full bg-mint/15 px-5 py-3">
                <TrendingDown className="size-5 text-brand" />
                <span className="text-sm font-semibold text-brand">
                  Save up to $180,000 on a $1M property
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Pathways — Immersive image cards ────────────────────────────── */

function PathwaysSection() {
  const pathways = [
    {
      title: "Buy your first place",
      description: "Start building equity with just 2% deposit and a clear lending path.",
      imageSrc: "/skip-larger-place.png",
      imageAlt: "Kangaroo relaxing at home",
    },
    {
      title: "Upgrade sooner",
      description: "Move into a bigger home without waiting years for another deposit.",
      imageSrc: "/skip-owning-home.png",
      imageAlt: "Kangaroo mowing lawn at new home",
    },
    {
      title: "Invest with confidence",
      description: "Enter the property market with less capital tied up in deposit.",
      imageSrc: "/skip-investment-property.png",
      imageAlt: "Kangaroo overlooking investment property",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand/50">Pathways</p>
            <h2 className="font-display text-5xl tracking-[-0.03em] text-brand md:text-6xl">
              Choose your next move.
            </h2>
          </div>
          <a href="#apply" className="group inline-flex items-center gap-2 text-sm font-semibold text-brand">
            Start application <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {pathways.map((item, index) => (
            <Reveal key={item.title} delay={0.1 + index * 0.1}>
              <div className="group relative overflow-hidden rounded-[2rem] bg-ink">
                <div className="relative h-[420px] overflow-hidden">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="font-display text-3xl tracking-tight text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
                  <a href="#apply" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-mint transition-colors hover:text-mint/80">
                    Learn more <ArrowRight className="size-3.5" />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How it works — Minimal timeline ─────────────────────────────── */

function HowItWorksSection() {
  const steps = [
    { number: "01", title: "Check your numbers", description: "Answer a few questions and see your borrowing range in minutes." },
    { number: "02", title: "Apply online", description: "Submit a short application and securely upload supporting documents." },
    { number: "03", title: "Get pre-approved", description: "A lending specialist reviews your file with a typical 48-hour turnaround." },
    { number: "04", title: "Settle & move in", description: "Complete finance, collect your keys, and start your next chapter." },
  ];

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal className="mb-20 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand/50">How it works</p>
          <h2 className="font-display text-5xl tracking-[-0.03em] text-brand md:text-6xl lg:text-7xl">
            Four steps to keys.
          </h2>
        </Reveal>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-0 md:grid-cols-4">
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={0.1 + index * 0.1}>
                <div className="group relative pb-12 pl-10 md:pb-0 md:pl-0 md:text-center">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-[15px] top-10 hidden h-px w-full bg-gradient-to-r from-brand/20 to-brand/5 md:block" />
                  )}
                  {index < steps.length - 1 && (
                    <div className="absolute bottom-0 left-[15px] top-10 w-px bg-gradient-to-b from-brand/20 to-transparent md:hidden" />
                  )}

                  {/* Number dot */}
                  <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white md:relative md:mx-auto md:mb-6">
                    {step.number}
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="max-w-[200px] text-sm leading-relaxed text-ink/50 md:mx-auto">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonial — Large cinematic quote ─────────────────────────── */

function TestimonialSection() {
  const reviews = [
    {
      quote: "We thought we were years away. Skip helped us buy with confidence much sooner.",
      name: "Alicia & Tom",
      location: "Inner West, NSW",
    },
    {
      quote: "The process felt structured and clear from start to finish. No surprises.",
      name: "Nadia R.",
      location: "Brisbane, QLD",
    },
    {
      quote: "Small deposit, solid support, and fast responses when timing mattered most.",
      name: "Chris P.",
      location: "Geelong, VIC",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Featured large quote */}
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand via-brand to-brand-dark p-10 text-white md:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(121,200,155,0.25),transparent_40%)]" />
            <div className="absolute -bottom-24 -right-24 h-[300px] w-[300px] rounded-full bg-mint/10 blur-[80px]" />

            <div className="relative max-w-3xl">
              <div className="mb-8 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-5 fill-mint text-mint" />
                ))}
              </div>
              <blockquote className="font-display text-4xl leading-[1.1] tracking-[-0.02em] md:text-5xl lg:text-6xl">
                &ldquo;Skip helped us buy years earlier than we expected. The process was straightforward and the team was incredible.&rdquo;
              </blockquote>
              <div className="mt-8">
                <p className="text-base font-semibold">Sarah and Dan</p>
                <p className="text-sm text-white/50">Melbourne, VIC</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Review cards */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal key={review.name} delay={0.1 + index * 0.1}>
              <div className="rounded-2xl border border-brand/10 bg-canvas p-6">
                <div className="mb-4 flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-3.5 fill-brand/20 text-brand/20" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-ink/65">{review.quote}</p>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-brand">{review.name}</p>
                  <p className="text-xs text-ink/40">{review.location}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ — Clean accordion ───────────────────────────────────────── */

function FaqSection() {
  return (
    <section id="faq" className="relative overflow-hidden bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand/50">FAQ</p>
              <h2 className="font-display text-5xl tracking-[-0.03em] text-brand md:text-6xl">
                Questions, answered.
              </h2>
              <p className="mt-4 max-w-md text-base text-ink/50">
                Everything you need to know before applying. Can&rsquo;t find your question? Our team is happy to help.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-brand/10 bg-white p-6 transition-colors open:border-brand/20 open:shadow-refined"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-brand [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/8 text-brand transition-transform group-open:rotate-45">
                      <span className="text-lg leading-none">+</span>
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-ink/60">{item.answer}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA — Dramatic full-bleed ───────────────────────────────────── */

function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-brand/25 blur-[150px]" />
        <div className="absolute right-1/4 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-mint/15 blur-[120px]" />
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
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/50">
            Start with just 2% deposit. Same bank-grade process, 10x less upfront.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/40">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-mint/60" />
              10-minute application
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-mint/60" />
              Response in 48 hours
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-mint/60" />
              Licensed Australian lender
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#apply"
              className={cn(
                buttonVariants({ size: "xl" }),
                "rounded-full bg-white px-10 font-semibold text-ink hover:bg-white/90",
              )}
            >
              Apply now <ArrowRight className="ml-1 size-4" />
            </a>
            <a
              href="#calculator"
              className={cn(
                buttonVariants({ variant: "glass", size: "xl" }),
                "rounded-full border-white/15 px-10",
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

/* ─── Marquee ─────────────────────────────────────────────────────── */

function MarqueeBanner() {
  const items = ["2% deposit", "Licensed lender", "48-hour pre-approval", "Bank-grade security", "Transparent rates", "Skip waiting"];

  return (
    <section className="overflow-hidden border-y border-brand/8 bg-white py-4">
      <div className="flex animate-[marquee_40s_linear_infinite] items-center gap-8 whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-brand/50">
            <Check className="size-4 text-mint" />
            {item}
          </span>
        ))}
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
        href="#apply"
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

export default function Option11Page() {
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
          <RatesSection />
          <ComparisonSection />
          <PathwaysSection />
          <HowItWorksSection />
          <TestimonialSection />
          <FaqSection />
          <CtaSection />
          <MarqueeBanner />
        </main>

        <FooterSection />
        <MobileStickyCta />

        {/* Custom animations */}
        <style jsx global>{`
          @keyframes orb-drift {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -20px) scale(1.05); }
            66% { transform: translate(-20px, 15px) scale(0.95); }
          }

          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-33.333%); }
          }
        `}</style>
      </div>
    </MotionConfig>
  );
}
