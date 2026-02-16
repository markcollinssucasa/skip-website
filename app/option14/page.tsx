"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  FileCheck2,
  Home,
  Landmark,
  Lock,
  ShieldCheck,
  Star,
  TrendingDown,
  Users,
} from "lucide-react";

import { SkipLogo } from "@/components/brand/skip-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─── Constants ────────────────────────────────────────────────────── */

const APPLY_URL = "https://apply.skiploans.com.au/";
const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "Skip Financial",
  url: "https://www.skip.com.au",
  description: "2% deposit home loans with bank-grade process and Australian regulatory oversight.",
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

const FIVE_SECOND_ANSWERS = [
  {
    question: "What is this?",
    answer: "A regulated Australian home loan that lets eligible buyers purchase with a 2% deposit instead of 20%.",
    icon: Home,
  },
  {
    question: "Is it for me?",
    answer: "Built for buyers who can service a mortgage but are blocked by the traditional deposit hurdle.",
    icon: Users,
  },
  {
    question: "Is it real?",
    answer: "Over $850M settled nationally. 3,000+ families supported through a standard lending process.",
    icon: FileCheck2,
  },
  {
    question: "Is it safe?",
    answer: "Responsible lending standards, strict documentation, bank-grade data security, and full regulatory oversight.",
    icon: ShieldCheck,
  },
  {
    question: "What do I do next?",
    answer: "Run your numbers below, then check eligibility in about 10 minutes. Specialist response within 48 hours.",
    icon: ArrowRight,
  },
];

type RateMode = "purchase" | "refinance";

const RATES: Record<
  RateMode,
  {
    label: string;
    ownerOccupied: { effective: number; comparison: number };
    investment: { effective: number; comparison: number };
  }
> = {
  purchase: {
    label: "Purchase",
    ownerOccupied: { effective: 6.3, comparison: 6.63 },
    investment: { effective: 6.65, comparison: 6.95 },
  },
  refinance: {
    label: "Refinance",
    ownerOccupied: { effective: 6.12, comparison: 6.44 },
    investment: { effective: 6.49, comparison: 6.82 },
  },
};

const BUYER_EXAMPLES = [
  {
    title: "First home in Perth",
    buyers: "Mia & Jacob",
    propertyPrice: 800000,
    skipDeposit: 16000,
    bankDeposit: 160000,
    timeline: "Bought in 5 months instead of waiting years to save a 20% deposit.",
    imageSrc: "/skip-owning-home.png",
    imageAlt: "A buyer relaxing in their first home",
  },
  {
    title: "Upgrade for a growing family",
    buyers: "Aisha & Tom",
    propertyPrice: 1200000,
    skipDeposit: 24000,
    bankDeposit: 240000,
    timeline: "Moved from a unit to a house without pausing life to rebuild a large deposit.",
    imageSrc: "/skip-larger-place.png",
    imageAlt: "A family outside a larger home",
  },
  {
    title: "First investment purchase",
    buyers: "Daniel R.",
    propertyPrice: 900000,
    skipDeposit: 18000,
    bankDeposit: 180000,
    timeline: "Entered the market sooner while preserving liquidity for buffer and renovation.",
    imageSrc: "/skip-investment-property.png",
    imageAlt: "An investor reviewing a property purchase",
  },
];

const PROCESS_STEPS = [
  { number: "01", title: "Check your numbers", description: "Use the calculator to understand purchasing power and estimated repayments." },
  { number: "02", title: "Apply online", description: "Submit your application and documents in one secure, guided flow." },
  { number: "03", title: "Get specialist review", description: "A lending specialist reviews your file with a typical 48-hour pre-approval response." },
  { number: "04", title: "Settle and move in", description: "Complete formal approval, settle, and collect your keys." },
];

const FAQ_ITEMS = [
  {
    question: "Is this a regulated home loan?",
    answer: "Yes. Skip follows Australian lending standards and responsible lending requirements, including full documentation checks and legal protections.",
  },
  {
    question: "Why is the deposit lower?",
    answer: "Skip accepts a 2% deposit structure for eligible buyers. The process remains compliance-led, with transparent pricing and legal protections throughout.",
  },
  {
    question: "Who is this best for?",
    answer: "Buyers with stable income and serviceability who are currently delayed by a traditional large-deposit requirement. First-home buyers, upgraders, and investors.",
  },
  {
    question: "What's the catch with 2%?",
    answer: "There's no catch. Skip charges a slightly higher rate to offset the lower deposit, but you avoid years of saving. The total cost is transparent from day one.",
  },
  {
    question: "Can I refinance later?",
    answer: "Absolutely. Once you've built equity in your property, you can refinance to a lower rate — just like any other home loan.",
  },
  {
    question: "How quickly can I get started?",
    answer: "You can start online in minutes. Most eligible applications receive pre-approval feedback within around 48 hours.",
  },
];

const COMPARISON_ROWS = [
  { label: "Minimum deposit", bank: "20%", skip: "2%" },
  { label: "On a $1M property", bank: "$200,000", skip: "$20,000" },
  { label: "Time to save deposit", bank: "~10 years", skip: "Now" },
  { label: "Lending process", bank: "Standard", skip: "Standard" },
  { label: "Regulatory oversight", bank: "Yes", skip: "Yes" },
  { label: "Legal protections", bank: "Yes", skip: "Yes" },
];

/* ─── Helpers ──────────────────────────────────────────────────────── */

function formatAud(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

function estimateMonthlyRepayment(principal: number, annualRate: number, years = 30) {
  const monthlyRate = annualRate / 100 / 12;
  const periods = years * 12;
  const factor = (1 + monthlyRate) ** periods;
  return (principal * monthlyRate * factor) / (factor - 1);
}

/* ─── Animated counter hook ───────────────────────────────────────── */

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
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
  y = 32,
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
      transition={{ duration: 0.6, delay, ease: MOTION_EASE }}
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
          {[
            { label: "Why Skip", href: "#five-second" },
            { label: "Calculator", href: "#calculator" },
            { label: "Rates", href: "#rates" },
            { label: "How it works", href: "#how-it-works" },
            { label: "FAQ", href: "#faq" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-sm transition-colors",
                scrolled ? "text-white/70 hover:text-white" : "text-white/80 hover:text-white",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={APPLY_URL}
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

/* ─── Hero — Cinematic, calm, confident ───────────────────────────── */

function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.08]);
  const textY = useTransform(scrollY, [0, 500], [0, 60]);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-brand">
      {/* Background image with parallax */}
      <motion.div
        style={shouldReduceMotion ? undefined : { scale: heroScale }}
        className="absolute inset-0"
      >
        {/* Mobile image */}
        <div className="absolute inset-0 md:hidden">
          <Image
            src="/hero-kangaroo-wide-sunrise.png"
            alt="Skip — your path to home ownership"
            fill
            priority
            sizes="100vw"
            quality={75}
            className="object-cover"
            style={{ objectPosition: "62% 18%" }}
          />
        </div>
        {/* Desktop image */}
        <div className="absolute inset-0 hidden md:block">
          <Image
            src="/hero-kangaroo-wide-sunrise.png"
            alt="Skip — your path to home ownership"
            fill
            priority
            sizes="100vw"
            quality={75}
            className="object-cover"
            style={{ objectPosition: "62% 18%" }}
          />
        </div>
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand/40 via-brand/30 to-brand/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand/70 via-brand/30 to-brand/50" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={shouldReduceMotion ? undefined : { opacity: heroOpacity, y: textY }}
        className="relative z-10 w-full"
      >
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-12 md:pb-32 md:pt-40">
          <div className="max-w-3xl space-y-8">
            {/* Regulation badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: MOTION_EASE }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 backdrop-blur-xl"
            >
              <Landmark className="size-3.5 text-mint" />
              <span className="text-[13px] font-medium tracking-wide text-white/80">
                Regulated Australian lender · ACL XXXXXX
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: MOTION_EASE }}
              className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.03em] text-white"
            >
              Buy with 2% deposit.
              <br />
              <span className="text-white/60">Borrow with confidence.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: MOTION_EASE }}
              className="max-w-xl text-lg leading-relaxed text-white/55 md:text-xl"
            >
              Same bank-grade process. Same legal protections. A dramatically smaller deposit so you can buy on your timeline, not the bank&rsquo;s.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: MOTION_EASE }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <a
                href={APPLY_URL}
                className={cn(
                  buttonVariants({ size: "xl" }),
                  "group rounded-full bg-white px-8 font-semibold text-ink hover:bg-white/90",
                )}
              >
                Check eligibility
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#calculator"
                className={cn(
                  buttonVariants({ variant: "glass", size: "xl" }),
                  "rounded-full border-white/20 px-8",
                )}
              >
                Run the numbers
              </a>
            </motion.div>

            {/* Micro-proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.95 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-white/40"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-mint/60" />
                $850M+ settled
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-mint/60" />
                48-hour pre-approval
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-mint/60" />
                3,000+ families
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
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

/* ─── Five-second clarity — Modal with kangaroo entrance ──────────── */

function FiveSecondSection() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <section id="five-second" className="relative overflow-hidden bg-canvas py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-mint/6 blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 text-center md:px-12">
          <Reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand/50">Why Skip</p>
            <h2 className="mx-auto max-w-[20ch] font-display text-4xl tracking-[-0.03em] text-brand sm:text-5xl md:text-6xl">
              Got five seconds?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-ink/55">
              Every question a new visitor asks — answered clearly.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={cn(
                buttonVariants({ size: "xl", variant: "brand" }),
                "mt-10 rounded-full px-10",
              )}
            >
              Get the essentials, in five seconds
              <ArrowRight className="size-4" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="five-second-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              key="five-second-panel"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: MOTION_EASE }}
              className="relative mx-4 max-h-[90svh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl md:p-10"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand/8 text-brand transition-colors hover:bg-brand/15"
                aria-label="Close"
              >
                <span className="text-lg leading-none">&times;</span>
              </button>

              {/* Kangaroo entrance */}
              <div className="mb-8 flex flex-col items-center">
                <motion.div
                  initial={{ y: 80, opacity: 0, scale: 0.5, rotate: -8 }}
                  animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.15,
                  }}
                >
                  <Image
                    src="/brand/skip-roo.png"
                    alt="Skip kangaroo mascot"
                    width={120}
                    height={120}
                    className="drop-shadow-lg"
                  />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5, ease: MOTION_EASE }}
                  className="mt-4 font-display text-3xl tracking-[-0.02em] text-brand sm:text-4xl"
                >
                  The essentials
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                  className="mt-1 text-sm text-ink/50"
                >
                  Five questions, answered in five seconds.
                </motion.p>
              </div>

              {/* Cards — stagger in */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {FIVE_SECOND_ANSWERS.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.question}
                      initial={{ opacity: 0, y: 24, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: 0.45 + index * 0.1,
                        duration: 0.5,
                        ease: MOTION_EASE,
                      }}
                      className="flex h-full flex-col rounded-2xl border border-brand/10 bg-canvas p-5"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/8 text-brand">
                        <Icon className="size-5" />
                      </div>
                      <h4 className="mb-1.5 text-sm font-semibold text-brand">{item.question}</h4>
                      <p className="text-[13px] leading-relaxed text-ink/60">{item.answer}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA inside modal */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5, ease: MOTION_EASE }}
                className="mt-8 text-center"
              >
                <a
                  href={APPLY_URL}
                  className={cn(
                    buttonVariants({ size: "xl", variant: "brand" }),
                    "rounded-full px-10",
                  )}
                >
                  Check eligibility
                  <ArrowRight className="size-4" />
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Deposit comparison — Side by side ───────────────────────────── */

function ComparisonSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal className="mb-16 text-center">
          <h2 className="font-display text-4xl tracking-[-0.03em] text-brand sm:text-5xl md:text-6xl">
            Same loan. <span className="text-brand/35">Smaller barrier.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-ink/50">
            Skip follows the same process as a bank. The only difference is how much deposit you need.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-brand/10 bg-white shadow-refined-lg">
            {/* Header */}
            <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-gradient-to-r from-brand to-brand-dark p-6">
              <div />
              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Traditional</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-mint">Skip</div>
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-brand/8">
              {COMPARISON_ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className={cn(
                    "grid grid-cols-[1.2fr_1fr_1fr] items-center px-6 py-5",
                    i < 2 && "bg-mint/4",
                  )}
                >
                  <span className="text-sm font-medium text-ink/70">{row.label}</span>
                  <span className="text-center text-sm text-ink/40">{row.bank}</span>
                  <span className="text-center text-sm font-semibold text-brand">{row.skip}</span>
                </div>
              ))}
            </div>

            {/* Bottom highlight */}
            <div className="border-t border-brand/8 bg-canvas/50 p-6 text-center">
              <div className="inline-flex items-center gap-3 rounded-full bg-mint/15 px-5 py-3">
                <TrendingDown className="size-5 text-brand" />
                <span className="text-sm font-semibold text-brand">
                  Save up to $180,000 upfront on a $1M property
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Calculator — Interactive ────────────────────────────────────── */

function CalculatorSection() {
  const [deposit, setDeposit] = useState(20000);
  const [rateMode, setRateMode] = useState<RateMode>("purchase");

  const calc = useMemo(() => {
    const propertyPrice = deposit / 0.02;
    const bankDeposit = propertyPrice * 0.2;
    const cashDifference = bankDeposit - deposit;
    const stampDuty = propertyPrice * 0.04;
    const loanAmount = propertyPrice - deposit;
    const monthlyRepayment = estimateMonthlyRepayment(loanAmount, RATES[rateMode].ownerOccupied.effective);
    return { propertyPrice, bankDeposit, cashDifference, stampDuty, loanAmount, monthlyRepayment };
  }, [deposit, rateMode]);

  return (
    <section id="calculator" className="relative overflow-hidden bg-canvas py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 dot-pattern opacity-20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <Reveal className="mb-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand/50">Real numbers</p>
          <h2 className="font-display text-4xl tracking-[-0.03em] text-brand sm:text-5xl md:text-6xl">
            What does 2% change?
          </h2>
          <p className="mt-4 max-w-2xl text-base text-ink/55">
            Move the slider to see purchasing power, estimated repayments, and the cash difference versus a standard 20% deposit.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Input panel */}
              <div className="rounded-[2rem] border border-brand/10 bg-white p-8 lg:col-span-2">
                <label htmlFor="deposit-range" className="mb-8 block text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">
                  Your available deposit
                </label>
                <div className="mb-8 font-display text-5xl tracking-tight text-brand md:text-6xl">
                  {formatAud(deposit)}
                </div>
                <input
                  id="deposit-range"
                  type="range"
                  value={deposit}
                  min={5000}
                  max={120000}
                  step={1000}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-brand/10 accent-brand"
                  aria-label="Deposit amount"
                />
                <div className="mt-3 flex justify-between text-xs text-ink/35">
                  <span>$5k</span>
                  <span>$120k</span>
                </div>

                <div className="mt-8 space-y-4 border-t border-brand/10 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink/50">Your deposit (2%)</span>
                    <span className="font-semibold text-brand">{formatAud(deposit)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink/50">Loan amount (98%)</span>
                    <span className="font-semibold text-brand">{formatAud(calc.loanAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink/50">Monthly repayment</span>
                    <span className="font-semibold text-brand">{formatAud(calc.monthlyRepayment)}</span>
                  </div>
                  <p className="text-[10px] text-ink/35">
                    Based on {RATES[rateMode].ownerOccupied.effective.toFixed(2)}% effective rate over 30 years. Illustrative only.
                  </p>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4 lg:col-span-3">
                {/* Property value hero card */}
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-brand-mid to-brand p-8 text-white md:p-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(121,200,155,0.25),transparent_50%)]" />
                  <div className="relative">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                        <Home className="size-4 text-mint" />
                      </div>
                      <span className="text-xs font-medium uppercase tracking-wider text-white/60">Property value</span>
                    </div>
                    <p className="font-display text-6xl tracking-tight md:text-7xl">
                      {formatAud(calc.propertyPrice)}
                    </p>
                    <p className="mt-2 text-sm text-white/50">Estimated purchasing power with 2% deposit</p>
                  </div>
                </div>

                {/* Stat row */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-brand/10 bg-white p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">Stamp duty</p>
                    <p className="mt-2 font-display text-2xl tracking-tight text-brand md:text-3xl">{formatAud(calc.stampDuty)}</p>
                    <p className="mt-1 text-[10px] text-ink/30">Approx.</p>
                  </div>
                  <div className="rounded-2xl border border-brand/10 bg-white p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">Total upfront</p>
                    <p className="mt-2 font-display text-2xl tracking-tight text-brand md:text-3xl">{formatAud(deposit + calc.stampDuty)}</p>
                    <p className="mt-1 text-[10px] text-ink/30">Deposit + duty</p>
                  </div>
                  <div className="col-span-2 rounded-2xl border border-mint/30 bg-gradient-to-br from-mint/15 to-mint/5 p-5 sm:col-span-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand/50">You save</p>
                    <p className="mt-2 font-display text-2xl tracking-tight text-brand md:text-3xl">{formatAud(calc.cashDifference)}</p>
                    <p className="mt-1 text-[10px] text-brand/40">vs. 20% deposit</p>
                  </div>
                </div>

                <a
                  href={APPLY_URL}
                  className={cn(
                    buttonVariants({ variant: "brand", size: "xl" }),
                    "w-full justify-center rounded-full",
                  )}
                >
                  Check my eligibility
                  <ChevronRight className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Rates — Dark section ────────────────────────────────────────── */

function RatesSection() {
  const [mode, setMode] = useState<RateMode>("purchase");
  const data = RATES[mode];

  return (
    <section id="rates" className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
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
              <h2 className="font-display text-4xl tracking-[-0.03em] sm:text-5xl md:text-6xl">
                Transparent rates.
              </h2>
              <p className="mt-4 max-w-md text-base text-white/45">
                No hidden fees, no surprises. Effective and comparison rates side by side.
              </p>
            </div>

            <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
              {(Object.keys(RATES) as RateMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-full px-6 py-2.5 text-sm font-medium transition-all",
                    mode === m ? "bg-mint text-brand shadow-lg" : "text-white/50 hover:text-white",
                  )}
                >
                  {RATES[m].label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { label: "Owner Occupied", rate: data.ownerOccupied },
              { label: "Investment", rate: data.investment },
            ].map((card) => (
              <div key={card.label} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/8 md:p-10">
                <div className="absolute -right-16 -top-16 h-[200px] w-[200px] rounded-full bg-mint/5 blur-[60px] opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative space-y-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-mint/80">{card.label}</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">Effective rate</p>
                      <p className="mt-2 font-display text-5xl leading-none tracking-tight md:text-6xl">{card.rate.effective.toFixed(2)}%</p>
                      <p className="mt-1 text-xs text-white/35">p.a.</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">Comparison rate</p>
                      <p className="mt-2 font-display text-5xl leading-none tracking-tight text-white/60 md:text-6xl">{card.rate.comparison.toFixed(2)}%</p>
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
          <p className="mt-6 text-center text-xs text-white/30">
            *Comparison rates are indicative and based on standardized assumptions. Lending criteria, terms, fees, and credit approval apply.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Real examples — Buyer scenarios ─────────────────────────────── */

function BuyerExamplesSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal className="mb-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand/50">Real examples</p>
          <h2 className="font-display text-4xl tracking-[-0.03em] text-brand sm:text-5xl md:text-6xl">
            How the 2% model plays out.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-ink/55">
            Example scenarios illustrating the deposit gap and practical outcomes. Amounts are illustrative and for guidance only.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {BUYER_EXAMPLES.map((example, index) => (
            <Reveal key={example.title} delay={0.05 + index * 0.08}>
              <div className="group overflow-hidden rounded-[2rem] border border-brand/10 bg-canvas transition-all hover:shadow-refined">
                <div className="relative h-[260px] overflow-hidden">
                  <Image
                    src={example.imageSrc}
                    alt={example.imageAlt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-xs font-medium tracking-wide text-white/70">{example.buyers}</p>
                    <h3 className="font-display text-2xl tracking-tight text-white">{example.title}</h3>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <div className="space-y-2 rounded-xl border border-brand/10 bg-white p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-ink/55">Property price</span>
                      <strong className="text-brand">{formatAud(example.propertyPrice)}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink/55">Skip deposit (2%)</span>
                      <strong className="text-brand">{formatAud(example.skipDeposit)}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink/55">Traditional (20%)</span>
                      <strong className="text-ink/40">{formatAud(example.bankDeposit)}</strong>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-ink/60">{example.timeline}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How it works — Clean timeline ───────────────────────────────── */

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal className="mb-20 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand/50">How it works</p>
          <h2 className="font-display text-4xl tracking-[-0.03em] text-brand sm:text-5xl md:text-6xl">
            Four steps to keys.
          </h2>
        </Reveal>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-0 md:grid-cols-4">
            {PROCESS_STEPS.map((step, index) => (
              <Reveal key={step.number} delay={0.05 + index * 0.08}>
                <div className="group relative pb-12 pl-10 md:pb-0 md:pl-0 md:text-center">
                  {/* Connector lines */}
                  {index < PROCESS_STEPS.length - 1 && (
                    <div className="absolute left-[15px] top-10 hidden h-px w-full bg-gradient-to-r from-brand/20 to-brand/5 md:block" />
                  )}
                  {index < PROCESS_STEPS.length - 1 && (
                    <div className="absolute bottom-0 left-[15px] top-10 w-px bg-gradient-to-b from-brand/20 to-transparent md:hidden" />
                  )}

                  {/* Number */}
                  <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white md:relative md:mx-auto md:mb-6">
                    {step.number}
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="max-w-[200px] text-sm leading-relaxed text-ink/50 md:mx-auto">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-16 flex items-center justify-center gap-3 rounded-2xl border border-brand/10 bg-white p-5 text-center">
              <Clock3 className="size-5 text-brand" />
              <p className="text-sm font-semibold text-brand">
                Typical pre-approval response in around 48 hours for eligible applications.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Trust and safety ────────────────────────────────────────────── */

function TrustSection() {
  const pillars = [
    {
      icon: Landmark,
      title: "Regulated lending framework",
      copy: "Responsible lending obligations, full documentation, and legal protections throughout the process.",
    },
    {
      icon: Lock,
      title: "Bank-grade data security",
      copy: "Application and document handling are protected with privacy-first controls and secure digital workflows.",
    },
    {
      icon: CheckCircle2,
      title: "Transparent numbers",
      copy: "Clear rates, clear examples, and clear total-cost conversations before you commit to anything.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr]">
          <Reveal>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand/50">Safety &amp; credibility</p>
              <h2 className="font-display text-4xl tracking-[-0.03em] text-brand sm:text-5xl">
                Conservative <span className="text-brand/40">by design.</span>
              </h2>
              <p className="mt-4 max-w-md text-base text-ink/55">
                The proposition is disruptive. The execution is deliberately disciplined: regulated lending, transparent numbers, and practical support from first check to settlement.
              </p>

              <div className="mt-8 rounded-2xl border border-brand/10 bg-canvas p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Compliance notes</p>
                <ul className="space-y-2 text-sm text-ink/60">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                    Australian Credit Licence details provided in formal lending documentation.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                    Responsible lending checks apply to all applications.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                    Full terms, fees, and obligations disclosed before commitment.
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-4">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.title} className="group rounded-2xl border border-brand/10 bg-canvas p-6 transition-all hover:border-brand/20 hover:shadow-refined">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-mint/20">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-brand">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">{pillar.copy}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ────────────────────────────────────────────────── */

function TestimonialSection() {
  const reviews = [
    { quote: "We thought we were years away. Skip helped us buy with confidence much sooner.", name: "Alicia & Tom", location: "Inner West, NSW" },
    { quote: "The process felt structured and clear from start to finish. No surprises.", name: "Nadia R.", location: "Brisbane, QLD" },
    { quote: "Small deposit, solid support, and fast responses when timing mattered most.", name: "Chris P.", location: "Geelong, VIC" },
  ];

  return (
    <section className="relative overflow-hidden bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand via-brand to-brand-dark p-10 text-white md:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(121,200,155,0.2),transparent_40%)]" />
            <div className="absolute -bottom-24 -right-24 h-[300px] w-[300px] rounded-full bg-mint/10 blur-[80px]" />

            <div className="relative max-w-3xl">
              <div className="mb-8 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-5 fill-mint text-mint" />
                ))}
              </div>
              <blockquote className="font-display text-3xl leading-[1.15] tracking-[-0.02em] sm:text-4xl md:text-5xl">
                &ldquo;Skip helped us buy years earlier than we expected. The process was straightforward and the team was incredible.&rdquo;
              </blockquote>
              <div className="mt-8">
                <p className="text-base font-semibold">Sarah and Dan</p>
                <p className="text-sm text-white/50">Melbourne, VIC</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal key={review.name} delay={0.05 + index * 0.08}>
              <div className="rounded-2xl border border-brand/10 bg-white p-6">
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

/* ─── FAQ — Accordion ─────────────────────────────────────────────── */

function FaqSection() {
  return (
    <section id="faq" className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand/50">FAQ</p>
              <h2 className="font-display text-4xl tracking-[-0.03em] text-brand sm:text-5xl">
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
                  className="group rounded-2xl border border-brand/10 bg-canvas p-6 transition-colors open:border-brand/20 open:shadow-refined"
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

/* ─── Final CTA ───────────────────────────────────────────────────── */

function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-brand/25 blur-[150px]" />
        <div className="absolute right-1/4 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-mint/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-12">
        <Reveal>
          <SkipLogo variant={1} className="mx-auto mb-8 h-12 rounded-full md:h-14" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-4xl tracking-[-0.03em] sm:text-5xl md:text-6xl">
            Ready to move sooner?
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/50">
            Start with a 10-minute eligibility check. If your scenario fits, a specialist will guide you through a transparent path to settlement.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
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

        <Reveal delay={0.25}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={APPLY_URL}
              className={cn(
                buttonVariants({ size: "xl" }),
                "rounded-full bg-white px-10 font-semibold text-ink hover:bg-white/90",
              )}
            >
              Start application <ArrowRight className="ml-1 size-4" />
            </a>
            <a
              href="#calculator"
              className={cn(
                buttonVariants({ variant: "glass", size: "xl" }),
                "rounded-full border-white/15 px-10",
              )}
            >
              Recheck numbers
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Marquee ─────────────────────────────────────────────────────── */

function MarqueeBanner() {
  const items = ["2% deposit", "Licensed lender", "48-hour pre-approval", "Bank-grade security", "Transparent rates", "$850M+ settled"];

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
            <a
              href={APPLY_URL}
              className={cn(
                buttonVariants({ variant: "mint", size: "lg" }),
                "rounded-full font-semibold shadow-lg",
              )}
            >
              Apply now <ArrowRight className="ml-1 size-4" />
            </a>
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
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Legal &amp; Contact</h4>
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
              only and does not consider your objectives, financial situation, or needs. Lending criteria, terms, fees, and
              credit approval apply. Consider your circumstances before proceeding.
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

export default function Option14Page() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative overflow-x-clip bg-canvas text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }} />

        <Header />

        <main className="pb-24 md:pb-0">
          <Hero />
          <SocialProofStrip />
          <FiveSecondSection />
          <ComparisonSection />
          <CalculatorSection />
          <RatesSection />
          <BuyerExamplesSection />
          <HowItWorksSection />
          <TrustSection />
          <TestimonialSection />
          <FaqSection />
          <CtaSection />
          <MarqueeBanner />
        </main>

        <FooterSection />
        <MobileStickyCta />

        <style jsx global>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-33.333%); }
          }
        `}</style>
      </div>
    </MotionConfig>
  );
}
