"use client";

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import Image from "next/image";
import {
  MotionConfig,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "motion/react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Home,
  Landmark,
  Lock,
  ShieldCheck,
  Users,
  X,
  Percent,
  Zap,
  FileCheck,
  KeyRound,
} from "lucide-react";

import { SkipLogo } from "@/components/brand/skip-logo";
import { SkipRooRunnerGame, type SkipRooRunnerGameHandle } from "@/components/ui/skip-roo-runner-game";
import { SkipRooRunnerScrollPreview } from "@/components/ui/skip-roo-runner-scroll-preview";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─── Constants ────────────────────────────────────────────────────── */

const MOTION_EASE = [0.22, 1, 0.36, 1] as const;
const APPLY_URL = "https://apply.skiploans.com.au/";

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "Skip Financial",
  url: "https://www.skip.com.au",
  description:
    "2% deposit home loans with bank-style process and Australian regulatory oversight.",
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
  { label: "Deposit", fhb: "5%", skip: "2%" },
  { label: "Property price", fhb: "Caps limit your choice", skip: "No caps" },
  {
    label: "Flexibility",
    fhb: "You may owe money if you sell",
    skip: "You can do what you want",
  },
  {
    label: "Available to",
    fhb: "Only first home buyers",
    skip: "Everyone",
  },
  {
    label: "Deposit rules",
    fhb: "Must use all your money",
    skip: "No restrictions",
  },
];

/* ─── Animated counter ─────────────────────────────────────────────── */

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
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
  }, [isInView, end, duration]);

  return { count, ref };
}

/* ─── Reveal wrapper ──────────────────────────────────────────────── */

function Reveal({
  children,
  className,
  delay = 0,
  y = 48,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: MOTION_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Horizontal reveal (for editorial slides) ────────────────────── */

function RevealX({
  children,
  className,
  delay = 0,
  x = 60,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  x?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: MOTION_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Editorial Header ─────────────────────────────────────────────── */

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto mt-4 flex w-[94%] max-w-6xl items-center justify-between rounded-full px-6 py-3 transition-all duration-500",
          scrolled
            ? "mt-3 border border-white/12 bg-ink/85 shadow-2xl backdrop-blur-2xl"
            : "border border-transparent bg-transparent"
        )}
      >
        <SkipLogo variant={1} className="h-7 rounded-full" priority />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 text-[13px] font-medium tracking-wide md:flex"
        >
          {["Features", "Calculator", "Rates", "How it works"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className={cn(
                "rounded-sm transition-colors",
                scrolled
                  ? "text-white/60 hover:text-white"
                  : "text-white/70 hover:text-white"
              )}
            >
              {item}
            </a>
          ))}
        </nav>

        <a
          href={APPLY_URL}
          className={cn(
            buttonVariants({ size: "sm" }),
            "rounded-full bg-mint px-5 font-semibold text-brand hover:bg-mint/90 transition-transform hover:scale-105 active:scale-95"
          )}
        >
          Get started
        </a>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HERO — Editorial spread: massive type, floating image, minimal chrome
   ═══════════════════════════════════════════════════════════════════════ */

function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 700], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 700], [1, 1.08]);
  const textY = useTransform(scrollY, [0, 600], [0, 100]);
  const imgY = useTransform(scrollY, [0, 600], [0, -60]);

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink">
      {/* Background — dark with subtle brand tint */}
      <motion.div
        style={shouldReduceMotion ? undefined : { scale: heroScale }}
        className="absolute inset-0"
      >
        <Image
          src="/hero-kangaroo-wide-sunrise.png"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover opacity-40"
          style={{ objectPosition: "62% 18%" }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/70 to-ink/40" />
        <div className="absolute inset-0 bg-linear-to-r from-ink/80 via-transparent to-ink/60" />
      </motion.div>

      {/* Grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Floating kangaroo silhouette — right side */}
      <motion.div
        style={shouldReduceMotion ? undefined : { y: imgY }}
        className="pointer-events-none absolute bottom-0 right-0 z-0 hidden w-[45%] max-w-[600px] opacity-20 mix-blend-lighten lg:block"
      >
        <Image
          src="/hero-kangaroo.png"
          alt=""
          width={800}
          height={800}
          className="object-contain object-bottom"
          priority
        />
      </motion.div>

      {/* Content */}
      <motion.div
        style={shouldReduceMotion ? undefined : { opacity: heroOpacity, y: textY }}
        className="relative z-10 w-full"
      >
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-32 md:px-12 md:pb-24">
          {/* Top line — editorial label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: MOTION_EASE }}
            className="mb-8 flex items-center gap-3"
          >
            <div className="h-px w-10 bg-mint/60" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-mint/80">
              Licensed Australian Lender
            </span>
          </motion.div>

          {/* Massive editorial headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: MOTION_EASE }}
            className="font-display text-[clamp(3.2rem,8vw,8rem)] leading-[0.88] tracking-[-0.04em] text-white"
          >
            Two
            <br />
            percent
            <br />
            <span className="bg-linear-to-r from-mint via-[#a8e6c1] to-mint bg-clip-text text-transparent">
              changes
            </span>
            <br />
            <span className="text-white/30">everything.</span>
          </motion.h1>

          {/* Subline + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: MOTION_EASE }}
            className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
          >
            <p className="max-w-md text-lg leading-relaxed text-white/50 md:text-xl">
              Same bank-grade process. Same legal protections.
              <br className="hidden md:block" />A dramatically smaller deposit.
            </p>

            <div className="flex items-center gap-4">
              <a
                href={APPLY_URL}
                className={cn(
                  buttonVariants({ size: "xl" }),
                  "group rounded-full bg-mint px-8 font-semibold text-brand shadow-[0_0_30px_rgba(121,200,155,0.25)] transition-all hover:bg-mint/90 hover:shadow-[0_0_40px_rgba(121,200,155,0.35)] hover:scale-[1.03] active:scale-95"
                )}
              >
                Apply now
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#calculator"
                className={cn(
                  buttonVariants({ variant: "glass", size: "xl" }),
                  "rounded-full border-white/15 px-8"
                )}
              >
                Calculate
              </a>
            </div>
          </motion.div>

          {/* Bottom editorial rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.2, ease: MOTION_EASE }}
            className="mt-12 h-px origin-left bg-linear-to-r from-white/20 via-white/8 to-transparent"
          />

          {/* Proof points — editorial style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4, ease: MOTION_EASE }}
            className="mt-6 flex flex-wrap gap-x-10 gap-y-3 text-[13px] tracking-wide text-white/35"
          >
            <span>10-minute application</span>
            <span>48-hour response</span>
            <span>$850M+ settled nationally</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5"
        >
          <div className="h-2 w-1 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SOCIAL PROOF — Horizontal counter strip
   ═══════════════════════════════════════════════════════════════════════ */

function SocialProofStrip() {
  const rating = useCountUp(48, 1800);
  const settlements = useCountUp(850, 2200);
  const families = useCountUp(3000, 2400);

  const stats = [
    {
      ref: rating.ref,
      value: `${(rating.count / 10).toFixed(1)}`,
      suffix: "/5",
      label: "Customer rating",
      sub: "1,200+ reviews",
    },
    {
      ref: settlements.ref,
      value: `$${settlements.count}M`,
      suffix: "+",
      label: "Settled",
      sub: "Nationally",
    },
    {
      ref: families.ref,
      value: `${families.count.toLocaleString()}`,
      suffix: "+",
      label: "Families",
      sub: "Across Australia",
    },
  ];

  return (
    <section className="relative border-b border-brand/8 bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "flex items-baseline gap-3 py-8 sm:justify-center",
                i < 2 && "border-b border-brand/8 sm:border-b-0 sm:border-r"
              )}
            >
              <span
                ref={s.ref}
                className="font-display text-4xl tracking-tight text-brand md:text-5xl"
              >
                {s.value}
              </span>
              <div>
                <span className="font-display text-lg text-brand/40">
                  {s.suffix}
                </span>
                <p className="text-[11px] uppercase tracking-[0.14em] text-ink/40">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FEATURES — Horizontal scrolling editorial carousel
   ═══════════════════════════════════════════════════════════════════════ */

const FEATURE_CARDS = [
  {
    icon: Percent,
    tag: "The Advantage",
    title: "2% deposit.\n100% real\nhome loan.",
    body: "Where banks ask for 20%, Skip asks for 2%. Same rules, same protections — just 10x less cash upfront.",
    accent: "from-brand via-brand-mid to-brand-dark",
    highlight: "$180k",
    highlightLabel: "saved on a $1M property",
    dark: true,
  },
  {
    icon: Clock3,
    tag: "Speed",
    title: "48-hour\npre-approval.",
    body: "A specialist reviews your file. Most eligible applications get feedback within 48 hours — not weeks.",
    accent: "from-mint/25 via-mint/12 to-canvas",
    highlight: "48h",
    highlightLabel: "typical response",
    dark: false,
  },
  {
    icon: Landmark,
    tag: "Trust",
    title: "Licensed\nAustralian\nlender.",
    body: "Full regulatory compliance under Australian law. Real lending protections. Real accountability.",
    accent: "from-canvas via-white to-canvas",
    highlight: "ACL",
    highlightLabel: "regulated",
    dark: false,
  },
  {
    icon: ShieldCheck,
    tag: "Security",
    title: "Bank-grade\nsecurity.",
    body: "Application data, documents, and approvals handled with the same security standards as major banks.",
    accent: "from-ink via-ink to-brand-dark",
    highlight: "256-bit",
    highlightLabel: "encryption",
    dark: true,
  },
  {
    icon: Users,
    tag: "Flexibility",
    title: "For everyone.\nNot just first\nbuyers.",
    body: "First home, upgrade, investment — Skip is available to all buyer types. No government scheme restrictions.",
    accent: "from-brand/8 via-mint/15 to-canvas",
    highlight: "All",
    highlightLabel: "buyer types",
    dark: false,
  },
];

function FeaturesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <section id="features" className="relative overflow-hidden bg-canvas py-24 md:py-32">
      {/* Section heading — editorial style */}
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8 bg-brand/30" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand/40">
                  Why Skip
                </span>
              </div>
              <h2 className="font-display text-5xl tracking-[-0.03em] text-brand md:text-6xl lg:text-7xl">
                Everything you need.
                <br />
                <span className="text-brand/25">Nothing you don&rsquo;t.</span>
              </h2>
            </div>

            {/* Carousel arrows */}
            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-brand/15 text-brand transition-all hover:bg-brand hover:text-white disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-brand"
                aria-label="Scroll left"
              >
                <ArrowRight className="size-5 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-brand/15 text-brand transition-all hover:bg-brand hover:text-white disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-brand"
                aria-label="Scroll right"
              >
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={scrollRef}
        className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-4 md:px-12 lg:gap-6"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Left spacer for centering on large screens */}
        <div className="hidden w-[calc((100vw-72rem)/2)] shrink-0 lg:block" />

        {FEATURE_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <RevealX key={card.tag} delay={i * 0.08} x={40}>
              <div
                className={cn(
                  "group relative flex w-[85vw] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[2rem] p-8 transition-shadow duration-500 sm:w-[420px] md:p-10",
                  card.dark
                    ? `bg-linear-to-br ${card.accent} text-white`
                    : `bg-linear-to-br ${card.accent} border border-brand/8 text-ink`
                )}
                style={{ minHeight: 440 }}
              >
                {/* Glow on dark cards */}
                {card.dark && (
                  <div className="absolute -right-16 -top-16 h-[250px] w-[250px] rounded-full bg-mint/15 blur-[80px] transition-transform duration-700 group-hover:scale-125" />
                )}

                <div className="relative space-y-5">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]",
                      card.dark
                        ? "border border-white/15 bg-white/10 text-white/80 backdrop-blur-sm"
                        : "border border-brand/12 bg-white/80 text-brand/60"
                    )}
                  >
                    <Icon className="size-3.5" />
                    {card.tag}
                  </div>

                  <h3
                    className={cn(
                      "font-display text-[2rem] leading-[1.05] tracking-[-0.02em] md:text-[2.25rem]",
                      card.dark ? "" : "text-brand"
                    )}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {card.title}
                  </h3>

                  <p
                    className={cn(
                      "max-w-[30ch] text-[15px] leading-relaxed",
                      card.dark ? "text-white/55" : "text-ink/50"
                    )}
                  >
                    {card.body}
                  </p>
                </div>

                {/* Large highlight number */}
                <div className="relative mt-8">
                  <p
                    className={cn(
                      "font-display text-6xl tracking-tight md:text-7xl",
                      card.dark ? "text-white/15" : "text-brand/10"
                    )}
                  >
                    {card.highlight}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-xs tracking-wide",
                      card.dark ? "text-white/30" : "text-ink/30"
                    )}
                  >
                    {card.highlightLabel}
                  </p>
                </div>
              </div>
            </RevealX>
          );
        })}

        {/* Right spacer */}
        <div className="hidden w-[calc((100vw-72rem)/2)] shrink-0 lg:block" />
        <div className="w-4 shrink-0 md:w-8" />
      </div>

      {/* CSS to hide scrollbar */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CALCULATOR — Editorial asymmetric layout
   ═══════════════════════════════════════════════════════════════════════ */

function CalculatorSection() {
  const [deposit, setDeposit] = useState(20000);
  const propertyValue = deposit * 50;
  const stampDuty = propertyValue * 0.04;
  const traditionalDeposit = propertyValue * 0.2;
  const savings = traditionalDeposit - deposit;

  return (
    <section
      id="calculator"
      className="relative overflow-hidden bg-white py-24 md:py-32"
    >
      {/* Subtle dot pattern */}
      <div className="pointer-events-none absolute inset-0 dot-pattern opacity-20" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Offset header */}
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8 bg-brand/30" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand/40">
                  Calculator
                </span>
              </div>
              <h2 className="font-display text-5xl tracking-[-0.03em] text-brand md:text-6xl">
                See your
                <br />
                purchasing
                <br />
                power.
              </h2>
            </div>
            <div className="flex items-end lg:col-span-7">
              <p className="max-w-md text-base leading-relaxed text-ink/45">
                Drag the slider to see how much home you can afford with just a 2%
                deposit — and how much you save versus the traditional 20%.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Calculator body */}
        <Reveal delay={0.15}>
          <div className="mt-16 grid gap-6 lg:grid-cols-12">
            {/* Left: input + savings */}
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-[2rem] border border-brand/10 bg-canvas/80 p-8 backdrop-blur-sm">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
                  Your deposit
                </label>
                <div className="mt-4 font-display text-[4rem] leading-none tracking-tight text-brand md:text-[5rem]">
                  ${(deposit / 1000).toFixed(0)}k
                </div>
                <input
                  type="range"
                  value={deposit}
                  min={5000}
                  max={100000}
                  step={1000}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="mt-6 h-2 w-full cursor-pointer appearance-none rounded-full bg-brand/10 accent-brand"
                  aria-label="Deposit amount"
                />
                <div className="mt-2 flex justify-between text-[11px] text-ink/30">
                  <span>$5k</span>
                  <span>$100k</span>
                </div>
              </div>

              {/* Savings card */}
              <div className="rounded-[2rem] border border-mint/30 bg-linear-to-br from-mint/15 to-mint/5 p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand/50">
                  You save vs. 20% deposit
                </p>
                <p className="mt-3 font-display text-6xl tracking-tight text-brand md:text-7xl">
                  ${(savings / 1000).toFixed(0)}k
                </p>
                <p className="mt-2 text-sm text-brand/40">
                  on a ${(propertyValue / 1000000).toFixed(2)}M property
                </p>
              </div>
            </div>

            {/* Right: results */}
            <div className="space-y-6 lg:col-span-7">
              {/* Property value — hero card */}
              <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-brand via-brand-mid to-brand-dark p-8 text-white md:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(121,200,155,0.25),transparent_50%)]" />
                <div className="relative flex items-end justify-between">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Home className="size-4 text-mint" />
                      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/50">
                        Property value
                      </span>
                    </div>
                    <p className="font-display text-[4.5rem] leading-none tracking-tight md:text-[6rem]">
                      ${(propertyValue / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <p className="hidden text-right text-sm text-white/30 md:block">
                    Estimated purchasing
                    <br />
                    power with 2% deposit
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl border border-brand/10 bg-canvas/60 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/35">
                    Stamp duty
                  </p>
                  <p className="mt-2 font-display text-2xl tracking-tight text-brand md:text-3xl">
                    ${(stampDuty / 1000).toFixed(0)}k
                  </p>
                  <p className="mt-1 text-[10px] text-ink/25">est.</p>
                </div>
                <div className="rounded-2xl border border-brand/10 bg-canvas/60 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/35">
                    Total upfront
                  </p>
                  <p className="mt-2 font-display text-2xl tracking-tight text-brand md:text-3xl">
                    ${((deposit + stampDuty) / 1000).toFixed(0)}k
                  </p>
                  <p className="mt-1 text-[10px] text-ink/25">deposit + duty</p>
                </div>
                <div className="rounded-2xl border border-brand/10 bg-canvas/60 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/35">
                    Skip funds
                  </p>
                  <p className="mt-2 font-display text-2xl tracking-tight text-brand md:text-3xl">
                    {((propertyValue - deposit) / 1000000).toFixed(2)}M
                  </p>
                  <p className="mt-1 text-[10px] text-ink/25">98% funded</p>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-2">
                <a
                  href={APPLY_URL}
                  className={cn(
                    buttonVariants({ variant: "brand", size: "lg" }),
                    "rounded-full px-10 font-semibold shadow-refined transition-transform hover:scale-[1.02]"
                  )}
                >
                  Get pre-approved in 48 hours
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HOW IT WORKS — Numbered editorial spread
   ═══════════════════════════════════════════════════════════════════════ */

const STEPS = [
  {
    num: "01",
    title: "Apply online",
    body: "Complete our 10-minute digital application. Upload your documents securely — no branch visit needed.",
    icon: FileCheck,
  },
  {
    num: "02",
    title: "Get assessed",
    body: "A specialist reviews your file using the same responsible lending framework as banks. Most responses within 48 hours.",
    icon: Clock3,
  },
  {
    num: "03",
    title: "Receive approval",
    body: "Pre-approval confirmed. You'll know exactly what you can afford and can start searching with confidence.",
    icon: CheckCircle2,
  },
  {
    num: "04",
    title: "Settle & move in",
    body: "Find your property, exchange contracts, and settle. Your 2% deposit made it possible — now enjoy your home.",
    icon: KeyRound,
  },
];

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-ink py-24 text-white md:py-32"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/3 h-[500px] w-[500px] rounded-full bg-brand/25 blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-mint/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Section heading */}
        <Reveal>
          <div className="mb-20 flex items-center gap-3">
            <div className="h-px w-8 bg-mint/40" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-mint/50">
              Process
            </span>
          </div>
          <h2 className="font-display text-5xl tracking-[-0.03em] md:text-6xl lg:text-7xl">
            Four steps to
            <br />
            <span className="text-white/30">home ownership.</span>
          </h2>
        </Reveal>

        {/* Steps — editorial offset layout */}
        <div className="mt-20 space-y-0">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isEven = i % 2 === 0;
            return (
              <Reveal key={step.num} delay={i * 0.1}>
                <div
                  className={cn(
                    "group grid items-center gap-8 border-t border-white/8 py-12 md:grid-cols-12 md:py-16",
                    isEven ? "" : ""
                  )}
                >
                  {/* Large number */}
                  <div
                    className={cn(
                      "md:col-span-3",
                      isEven ? "md:order-1" : "md:order-1"
                    )}
                  >
                    <span className="font-display text-[5rem] leading-none tracking-tight text-white/8 transition-colors duration-500 group-hover:text-mint/20 md:text-[7rem]">
                      {step.num}
                    </span>
                  </div>

                  {/* Content */}
                  <div
                    className={cn(
                      "space-y-4 md:col-span-5",
                      isEven ? "md:order-2" : "md:order-2"
                    )}
                  >
                    <h3 className="font-display text-3xl tracking-[-0.02em] md:text-4xl">
                      {step.title}
                    </h3>
                    <p className="max-w-md text-base leading-relaxed text-white/40">
                      {step.body}
                    </p>
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      "hidden md:col-span-4 md:flex md:order-3",
                      isEven ? "md:justify-end" : "md:justify-end"
                    )}
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/8 bg-white/5 text-mint/60 transition-all duration-500 group-hover:border-mint/20 group-hover:bg-mint/10 group-hover:text-mint">
                      <Icon className="size-8" />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   RATES — Editorial rate cards with animated tab switch
   ═══════════════════════════════════════════════════════════════════════ */

function RatesSection() {
  const [mode, setMode] = useState<PricingMode>("purchase");
  const homeRate = HOME_RATES[mode];
  const investRate = INVESTMENT_RATES[mode];

  return (
    <section
      id="rates"
      className="relative overflow-hidden bg-canvas py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-mint/8 blur-[180px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <Reveal>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8 bg-brand/30" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand/40">
                  Pricing
                </span>
              </div>
              <h2 className="font-display text-5xl tracking-[-0.03em] text-brand md:text-6xl lg:text-7xl">
                Transparent
                <br />
                rates.
              </h2>
              <p className="mt-4 max-w-md text-base text-ink/40">
                No hidden fees, no surprises. Compare effective and comparison
                rates side by side.
              </p>
            </div>

            {/* Toggle */}
            <div className="flex rounded-full border border-brand/12 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setMode("purchase")}
                className={cn(
                  "rounded-full px-7 py-2.5 text-sm font-medium transition-all duration-300",
                  mode === "purchase"
                    ? "bg-brand text-white shadow-lg"
                    : "text-ink/40 hover:text-ink"
                )}
              >
                Purchase
              </button>
              <button
                type="button"
                onClick={() => setMode("refinance")}
                className={cn(
                  "rounded-full px-7 py-2.5 text-sm font-medium transition-all duration-300",
                  mode === "refinance"
                    ? "bg-brand text-white shadow-lg"
                    : "text-ink/40 hover:text-ink"
                )}
              >
                Refinance
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              { label: "Owner Occupied", rate: homeRate },
              { label: "Investment", rate: investRate },
            ].map((card) => (
              <div
                key={card.label}
                className="group relative overflow-hidden rounded-[2rem] border border-brand/10 bg-white p-8 transition-all duration-300 hover:border-brand/20 hover:shadow-refined-lg md:p-10"
              >
                <div className="absolute -right-16 -top-16 h-[200px] w-[200px] rounded-full bg-mint/6 blur-[60px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative space-y-8">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand/50">
                      {card.label}
                    </p>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/8 text-brand">
                      <Home className="size-5" />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${card.label}-${mode}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35, ease: MOTION_EASE }}
                      className="grid grid-cols-2 gap-6"
                    >
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/30">
                          Effective rate
                        </p>
                        <p className="mt-2 font-display text-[3.5rem] leading-none tracking-tight text-brand md:text-6xl">
                          {card.rate.effectiveRate}%
                        </p>
                        <p className="mt-1 text-xs text-ink/25">p.a.</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/30">
                          Comparison rate
                        </p>
                        <p className="mt-2 font-display text-[3.5rem] leading-none tracking-tight text-ink/30 md:text-6xl">
                          {card.rate.comparisonRate}%
                        </p>
                        <p className="mt-1 text-xs text-ink/25">p.a.**</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <a
                    href={APPLY_URL}
                    className={cn(
                      buttonVariants({ variant: "brand", size: "lg" }),
                      "rounded-full font-semibold transition-transform hover:scale-[1.02]"
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

/* ═══════════════════════════════════════════════════════════════════════
   COMPARISON — FHB vs Skip — editorial split
   ═══════════════════════════════════════════════════════════════════════ */

function ComparisonSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32 border-t border-brand/8">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal>
          <div className="mb-16 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8 bg-brand/30" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand/40">
                  Compare
                </span>
              </div>
              <h2 className="font-display text-5xl tracking-[-0.03em] text-brand md:text-6xl">
                Better than the
                <br />
                FHB Scheme.
              </h2>
            </div>
            <div className="flex items-end lg:col-span-6">
              <p className="max-w-md text-base leading-relaxed text-ink/40">
                Government schemes come with strings attached. Skip gives you
                freedom from day one — no caps, no restrictions, open to everyone.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Comparison cards — side by side */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* FHB Scheme */}
          <Reveal delay={0.1}>
            <div className="h-full rounded-[2rem] border border-brand/8 bg-canvas/50">
              <div className="flex items-center justify-between border-b border-brand/8 px-8 py-6">
                <h3 className="font-display text-2xl tracking-[-0.02em] text-ink/60">
                  FHB Scheme
                </h3>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/8 text-red-500/60">
                  <X className="size-5" />
                </span>
              </div>
              <div className="divide-y divide-brand/6">
                {FIRST_HOME_BUYER_ROWS.map((row) => (
                  <div
                    key={`fhb-${row.label}`}
                    className="flex items-start gap-4 px-8 py-5"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/8">
                      <X className="size-3.5 text-red-500/60" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/35">
                        {row.label}
                      </p>
                      <p className="text-[15px] text-ink/55">{row.fhb}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Skip */}
          <Reveal delay={0.2}>
            <div className="h-full rounded-[2rem] border border-mint/25 bg-linear-to-b from-mint/12 to-mint/4 shadow-refined">
              <div className="flex items-center justify-between border-b border-brand/10 px-8 py-6">
                <h3 className="font-display text-2xl tracking-[-0.02em] text-brand">
                  Skip
                </h3>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
                  <Check className="size-5" />
                </span>
              </div>
              <div className="divide-y divide-brand/8">
                {FIRST_HOME_BUYER_ROWS.map((row) => (
                  <div
                    key={`skip-${row.label}`}
                    className="flex items-start gap-4 px-8 py-5"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint/25">
                      <Check className="size-3.5 text-brand" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/50">
                        {row.label}
                      </p>
                      <p className="text-[15px] font-semibold text-brand">
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

/* ═══════════════════════════════════════════════════════════════════════
   ROO RUNNER — Interactive game section
   ═══════════════════════════════════════════════════════════════════════ */

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
    <section className="overflow-hidden border-t border-brand/8 bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/12 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand/50">
              <Zap className="size-3.5" />
              Interactive
            </div>
            <h2 className="font-display text-4xl tracking-[-0.02em] text-brand md:text-5xl">
              Leap Past The Old Hurdles
            </h2>
            <p className="mx-auto mt-3 max-w-[52ch] text-base leading-relaxed text-ink/50">
              While traditional banks keep moving the finish line, Skip gets you
              there faster. Try it yourself.
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

      <div className="mt-10 flex flex-col items-center gap-3">
        {!playingInline ? (
          <button
            type="button"
            onClick={() => {
              setPlayingInline(true);
              setShowPlayHintModal(true);
            }}
            className={cn(
              buttonVariants({ variant: "brand", size: "lg" }),
              "rounded-full px-10 font-semibold shadow-refined"
            )}
          >
            Play the game
          </button>
        ) : (
          <button
            type="button"
            onClick={() => gameRef.current?.jump()}
            className={cn(
              buttonVariants({ variant: "brand", size: "lg" }),
              "rounded-full px-10 font-semibold shadow-refined"
            )}
          >
            Jump! (Space)
          </button>
        )}
      </div>

      {/* Play hint modal */}
      {showPlayHintModal && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/50 px-4 backdrop-blur-sm"
          onClick={() => setShowPlayHintModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Game controls"
            className="w-full max-w-md rounded-2xl border border-brand/12 bg-white p-8 text-center shadow-refined-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand/40">
              How to play
            </p>
            <p className="mt-3 text-lg font-semibold text-brand">
              Tap, click or press space to jump over hurdles
            </p>
            <button
              type="button"
              onClick={() => setShowPlayHintModal(false)}
              className={cn(
                buttonVariants({ variant: "brand", size: "sm" }),
                "mt-6 rounded-full px-6"
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

/* ═══════════════════════════════════════════════════════════════════════
   CTA — Full-bleed editorial spread
   ═══════════════════════════════════════════════════════════════════════ */

function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-brand py-28 text-white md:py-36">
      {/* Dramatic glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-brand-dark/40 blur-[180px]" />
        <div className="absolute right-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-mint/20 blur-[150px]" />
      </div>

      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center md:px-12">
        <Reveal>
          <SkipLogo variant={1} className="mx-auto mb-8 h-12 rounded-full md:h-14" />
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.9] tracking-[-0.04em]">
            Ready to skip
            <br />
            to the owning bit?
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-lg text-lg text-white/50">
            Start with just 2% deposit. Same bank-grade process, 10x less
            upfront.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-white/40">
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

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={APPLY_URL}
              className={cn(
                buttonVariants({ size: "xl" }),
                "group rounded-full bg-white px-10 font-semibold text-ink shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:bg-white/90 transition-all hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]"
              )}
            >
              Apply now
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#calculator"
              className={cn(
                buttonVariants({ variant: "glass", size: "xl" }),
                "rounded-full border-white/15 px-10"
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

/* ═══════════════════════════════════════════════════════════════════════
   FOOTER — Refined editorial footer
   ═══════════════════════════════════════════════════════════════════════ */

function FooterSection() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <SkipLogo variant={1} className="h-8 rounded-full" />
            <p className="max-w-sm text-sm leading-relaxed text-white/35">
              Making property ownership accessible with 2% deposit home loans.
              Licensed and regulated in Australia.
            </p>
            <a
              href={APPLY_URL}
              className={cn(
                buttonVariants({ variant: "mint", size: "lg" }),
                "rounded-full font-semibold shadow-lg"
              )}
            >
              Apply now <ArrowRight className="ml-1 size-4" />
            </a>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-white/35">
              <li>
                <a
                  href="#calculator"
                  className="transition-colors hover:text-mint"
                >
                  Calculator
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="transition-colors hover:text-mint"
                >
                  How it works
                </a>
              </li>
              <li>
                <a href="#rates" className="transition-colors hover:text-mint">
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="transition-colors hover:text-mint"
                >
                  Features
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
              Compliance
            </h4>
            <ul className="space-y-3 text-sm text-white/35">
              <li>Australian Credit Licence XXXXXX</li>
              <li>Responsible lending framework</li>
              <li>Bank-grade security controls</li>
              <li>Australian support team</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
              Legal & Contact
            </h4>
            <ul className="space-y-3 text-sm text-white/35">
              <li>
                <a href="#" className="transition-colors hover:text-mint">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-mint">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-mint">
                  Disclaimer
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-mint">
                  Credit Guide
                </a>
              </li>
              <li>support@skip.com.au</li>
              <li>1300 000 000</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 space-y-6 border-t border-white/6 pt-8">
          <div className="rounded-xl border border-white/6 bg-white/3 p-6">
            <p className="text-xs leading-relaxed text-white/25">
              <strong className="font-semibold text-white/40">
                Important:
              </strong>{" "}
              Skip is a registered trading name of Skip Financial Pty Ltd ACN XXX
              XXX XXX, Australian Credit Licence XXXXXX. This website contains
              general information only. Consider your circumstances before
              proceeding.
            </p>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/20 md:flex-row">
            <p>&copy; 2026 Skip Financial. All rights reserved.</p>
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-mint/40" />
              Australian owned and operated
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MOBILE STICKY CTA
   ═══════════════════════════════════════════════════════════════════════ */

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
          "w-full rounded-full font-semibold"
        )}
      >
        Get started <ArrowRight className="ml-1 size-4" />
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PAGE — Editorial composition
   ═══════════════════════════════════════════════════════════════════════ */

export default function Option16Page() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative overflow-x-clip bg-canvas text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_JSON_LD),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />

        <Header />

        <main className="pb-24 md:pb-0">
          <Hero />
          <SocialProofStrip />
          <FeaturesCarousel />
          <CalculatorSection />
          <HowItWorksSection />
          <RatesSection />
          <ComparisonSection />
          <RooRunnerSection />
          <CtaSection />
        </main>

        <FooterSection />
        <MobileStickyCta />
      </div>
    </MotionConfig>
  );
}
