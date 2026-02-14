"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MotionConfig, motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BadgeDollarSign,
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
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SkipLogo } from "@/components/brand/skip-logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SkipToOwningBitHeading } from "@/components/brand/skip-to-owning-bit-heading";
import { cn } from "@/lib/utils";

/* ─── Constants ────────────────────────────────────────────────────── */

const MOTION_EASE = [0.22, 1, 0.36, 1] as const;
const CALCULATION_DELAY_MS = 220;

const SOCIAL_PROOF_ITEMS = [
  { icon: Star, value: "4.8/5", label: "Customer rating", detail: "1,200+ reviews" },
  { icon: DollarSign, value: "$850M+", label: "Settlements delivered", detail: "Nationally" },
  { icon: Users, value: "3,000+", label: "Families settled", detail: "Across Australia" },
];

const TRUST_PILLARS = [
  {
    icon: Landmark,
    title: "Licensed Australian lender",
    description: "Regulated under Australian law with full compliance and legal protections.",
  },
  {
    icon: Clock3,
    title: "48-hour pre-approval",
    description: "A lending specialist reviews your file with a typical 48-hour turnaround.",
  },
  {
    icon: ShieldCheck,
    title: "Bank-grade security",
    description: "Application, document handling, and approvals follow strict privacy standards.",
  },
];

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

const BANK_COMPARISONS = [
  { label: "Minimum deposit", bank: "20%", skip: "2%", highlight: true },
  { label: "For a $1M property", bank: "$200,000", skip: "$20,000", highlight: true },
  { label: "Time to save deposit", bank: "~10 years", skip: "Now", highlight: false },
  { label: "Lending process", bank: "Standard", skip: "Standard", highlight: false },
];

const FIRST_HOME_BUYER_ROWS = [
  { label: "Deposit", fhb: "5%", skip: "2%" },
  { label: "Flexibility", fhb: "Can't convert to investment", skip: "Full flexibility" },
  { label: "Available to", fhb: "First home buyers only", skip: "Everyone" },
  { label: "Deposit rules", fhb: "Must use all your savings", skip: "No restrictions" },
];

const PATHWAYS = [
  {
    title: "Buy your first place",
    description: "Start building equity with a 2% deposit and a straightforward lending path.",
    imageSrc: "/skip-owning-home.png",
    imageAlt: "Kangaroo relaxing at home",
  },
  {
    title: "Upgrade sooner",
    description: "Move into a larger home without waiting years to build another large deposit.",
    imageSrc: "/skip-larger-place.png",
    imageAlt: "Kangaroo outside a larger home",
  },
  {
    title: "Invest with confidence",
    description: "Enter the property market with less upfront capital and a clear plan.",
    imageSrc: "/skip-investment-property.png",
    imageAlt: "Kangaroo looking over an investment property view",
  },
];

const HOW_IT_WORKS_STEPS = [
  { number: "01", title: "Check your numbers", description: "Answer a few questions and see your borrowing range in minutes." },
  { number: "02", title: "Apply online", description: "Submit a short application and securely upload supporting documents." },
  { number: "03", title: "Get pre-approved", description: "A lending specialist reviews your file with a typical 48-hour turnaround." },
  { number: "04", title: "Settle & move in", description: "Complete finance, collect your keys, and start your next chapter." },
];

const BENEFITS = [
  "Bank-grade privacy and document security",
  "Transparent rates with no hidden surprises",
  "Dedicated support from application to settlement",
  "Built for owner-occupiers and investors",
];

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

/* ─── Shared small components ──────────────────────────────────────── */

function Slider({ value, onChange, min, max, step }: { value: number; onChange: (v: number) => void; min: number; max: number; step: number }) {
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-mint/20 accent-brand"
      aria-label="Deposit amount"
    />
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink/60">{label}</span>
      <span className="font-semibold text-brand">{value}</span>
    </div>
  );
}

/* ─── Header ───────────────────────────────────────────────────────── */

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
    <header className="fixed inset-x-0 top-0 z-30">
      <div
        className={cn(
          "mx-auto mt-4 flex w-[94%] max-w-6xl items-center justify-between rounded-full px-6 py-3 text-white shadow-2xl backdrop-blur-xl transition-all duration-300",
          scrolled
            ? "mt-3 border border-white/20 bg-brand/90"
            : "border border-white/15 bg-brand/70",
        )}
      >
        <SkipLogo variant={1} className="h-8 rounded-full" priority />
        <nav aria-label="Primary" className="hidden items-center gap-7 text-sm font-medium md:flex">
          <a href="#calculator" className="rounded-sm transition-colors hover:text-mint">Calculator</a>
          <a href="#rates" className="rounded-sm transition-colors hover:text-mint">Rates</a>
          <a href="#how-it-works" className="rounded-sm transition-colors hover:text-mint">How it works</a>
          <a href="#faq" className="rounded-sm transition-colors hover:text-mint">FAQ</a>
        </nav>
        <a
          href="#apply"
          className={cn(
            buttonVariants({ variant: "mint", size: "sm" }),
            "rounded-full font-semibold focus-visible:ring-mint focus-visible:ring-offset-brand",
          )}
        >
          Apply now
        </a>
      </div>
    </header>
  );
}

/* ─── Hero — Split layout with social proof ────────────────────────── */

function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-canvas via-white to-canvas">
      {/* Background wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(52rem 34rem at 14% -6%, color-mix(in srgb, var(--mint) 42%, white), transparent 68%), radial-gradient(45rem 28rem at 102% 8%, color-mix(in srgb, var(--brand) 14%, white), transparent 64%), linear-gradient(180deg, #f8fcf8 0%, #f1f8f2 28%, #f3f8f3 100%)",
        }}
      />

      <div className="section-shell pb-16 pt-32 md:pb-20 md:pt-40 lg:pb-24 lg:pt-44">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left — Copy */}
          <div className="space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: MOTION_EASE }}
            >
              <Badge variant="mint" className="rounded-full border-brand/15 px-4 py-1.5 text-[0.72rem] uppercase tracking-[0.14em]">
                Australian Lender · 2% Deposit Home Loans
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: MOTION_EASE }}
              className="space-y-4"
            >
              <SkipToOwningBitHeading
                className="text-5xl tracking-[-0.025em] text-brand md:text-6xl lg:text-7xl"
                logoVariant={1}
                textClassName="text-brand"
                lineTwo="owning bit."
                priorityLogo
              />
              <p className="measure-copy text-base leading-relaxed text-ink/70 md:text-lg">
                Same lending process. Same security controls. A dramatically lower deposit
                so your timeline can match your income, not a decade of saving.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: MOTION_EASE }}
              className="flex flex-wrap items-center gap-3"
              id="apply"
            >
              <a
                href="#calculator"
                className={cn(buttonVariants({ variant: "brand", size: "xl" }), "group rounded-full")}
              >
                Calculate your borrowing
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </a>
              <a
                href="#rates"
                className={cn(
                  buttonVariants({ variant: "outline", size: "xl" }),
                  "rounded-full border-brand/20 bg-white/70 text-brand hover:bg-white",
                )}
              >
                See rates
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xs tracking-wide text-brand/60"
            >
              ACL XXXXXX · 48 hours typical response · Privacy-first data handling
            </motion.p>

            {/* Hero stat pills */}
            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: MOTION_EASE }}
              className="grid gap-3 sm:grid-cols-3"
            >
              {[
                { value: "2%", label: "Deposit to start" },
                { value: "48 hrs", label: "Typical pre-approval" },
                { value: "10x less", label: "Upfront cash vs banks" },
              ].map((item) => (
                <li
                  key={item.label}
                  className="rounded-2xl border border-brand/10 bg-white/80 px-5 py-4 shadow-[0_12px_36px_-28px_rgba(31,86,58,0.5)]"
                >
                  <p className="font-display text-3xl tracking-tight text-brand">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-brand/60">{item.label}</p>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right — Hero image card */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: MOTION_EASE }}
            className="relative mx-auto w-full max-w-xl"
          >
            {/* Floating badges */}
            <div className="absolute -left-8 -top-6 z-20 hidden rounded-2xl bg-brand px-5 py-3 text-white shadow-refined-lg md:block">
              <p className="text-[10px] uppercase tracking-[0.14em] text-mint">Typical pre-approval</p>
              <p className="font-display text-2xl tracking-tight">48 hours</p>
            </div>
            <div className="absolute -bottom-5 -right-5 z-20 hidden rounded-2xl bg-mint px-5 py-3 text-brand shadow-refined-lg md:block">
              <p className="text-[10px] uppercase tracking-[0.14em] text-brand/70">Min. deposit</p>
              <p className="font-display text-2xl tracking-tight">2%</p>
            </div>

            {/* Image card */}
            <div className="relative overflow-hidden rounded-[2.25rem] border border-brand/10 bg-white p-3 shadow-[0_42px_90px_-46px_rgba(31,86,58,0.7)]">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-32"
                style={{
                  background:
                    "linear-gradient(180deg, color-mix(in srgb, var(--mint) 50%, white) 0%, color-mix(in srgb, var(--mint) 15%, transparent) 76%, transparent 100%)",
                }}
              />
              <Image
                src="/hero-kangaroo-wide.png"
                alt="Skip mascot celebrating in front of a sold property sign"
                width={1200}
                height={800}
                priority
                className="relative z-10 mx-auto h-auto w-full rounded-[1.75rem] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Social Proof Bar ─────────────────────────────────────────────── */

function SocialProofBar() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="border-y border-brand/8 bg-white/80 backdrop-blur-sm">
      <div className="section-shell">
        <div className="grid grid-cols-1 divide-y divide-brand/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {SOCIAL_PROOF_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1, ease: MOTION_EASE }}
                className="flex items-center gap-4 px-6 py-5 sm:justify-center"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint/15 text-brand">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-2xl tracking-tight text-brand">{item.value}</p>
                  <p className="text-xs uppercase tracking-[0.12em] text-ink/50">{item.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Trust Pillars — Three horizontal cards ───────────────────────── */

function TrustPillarsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section-y relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(121,200,155,0.12),transparent_42%)]" />
      <div className="section-shell relative">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: MOTION_EASE }}
          className="mb-12 space-y-3 text-center"
        >
          <Badge variant="mint" className="mx-auto px-5 py-2 text-sm">
            Regulated · Transparent · Supportive
          </Badge>
          <h2 className="section-heading mx-auto max-w-[20ch] text-brand">
            Built on the same foundation as your bank.
          </h2>
          <p className="measure-copy mx-auto text-base text-ink/60 md:text-lg">
            Skip is a licensed Australian lender. Same rules, same protections — just 10x less deposit.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {TRUST_PILLARS.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + index * 0.1, ease: MOTION_EASE }}
              whileHover={{ y: -4 }}
            >
              <Card className="glass shadow-refined h-full rounded-2xl border-ink/8 p-7 text-center transition-all hover:border-mint/25 hover:shadow-refined-lg">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-mint/15 text-brand">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-ink/60">{description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Deposit Calculator (enhanced) ────────────────────────────────── */

function DepositCalculator() {
  const [deposit, setDeposit] = useState(20000);
  const [isCalculating, setIsCalculating] = useState(false);
  const propertyValue = deposit * 50;
  const stampDuty = propertyValue * 0.04;
  const traditionalDeposit = propertyValue * 0.2;
  const savings = traditionalDeposit - deposit;
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isCalculating) return;
    const id = window.setTimeout(() => setIsCalculating(false), CALCULATION_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [deposit, isCalculating]);

  const handleChange = (v: number) => {
    setIsCalculating(true);
    setDeposit(v);
  };

  return (
    <section ref={ref} className="section-y-lg relative overflow-hidden bg-white" id="calculator">
      <div className="gradient-mesh absolute inset-0" />
      <div className="dot-pattern absolute inset-0 opacity-40" />

      <div className="section-shell relative">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: MOTION_EASE }}
            className="mb-14 space-y-4 text-center"
          >
            <h2 className="section-heading mx-auto max-w-[20ch] text-brand">
              You can buy sooner than you think
            </h2>
            <p className="measure-copy mx-auto text-base text-ink/60 md:text-lg">
              Discover your purchasing power with just 2% deposit
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Slider panel */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: MOTION_EASE }}
              className="lg:col-span-2"
            >
              <Card className="glass shadow-refined-lg flex h-full flex-col justify-center rounded-3xl border-ink/10 p-8">
                <CardContent className="space-y-8 p-0">
                  <div>
                    <label className="mb-6 block text-xs font-semibold uppercase tracking-wider text-ink/70">
                      Your Savings
                    </label>
                    <motion.div key={deposit} initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }} className="mb-6">
                      {isCalculating ? (
                        <div className="skeleton mx-auto h-16 w-40 rounded-2xl md:mx-0" aria-hidden />
                      ) : (
                        <div className="text-5xl font-bold tracking-tight text-brand md:text-6xl">
                          ${(deposit / 1000).toFixed(0)}k
                        </div>
                      )}
                    </motion.div>
                    <Slider value={deposit} onChange={handleChange} min={5000} max={100000} step={1000} />
                    <div className="mt-3 flex justify-between text-xs text-ink/40">
                      <span>$5k</span>
                      <span>$100k</span>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-ink/10 pt-6">
                    {isCalculating ? (
                      <>
                        <div className="skeleton h-5 w-full rounded-md" aria-hidden />
                        <div className="skeleton h-5 w-full rounded-md" aria-hidden />
                      </>
                    ) : (
                      <>
                        <InfoRow label="Your deposit (2%)" value={`$${(deposit / 1000).toFixed(0)}k`} />
                        <InfoRow label="Skip provides (98%)" value={`$${((propertyValue - deposit) / 1000000).toFixed(2)}M`} />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results panel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: MOTION_EASE }}
              className="space-y-4 lg:col-span-3"
            >
              {/* Property value card */}
              <motion.div
                key={propertyValue}
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="shadow-refined-lg relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand-mid to-brand p-8 text-white md:p-12"
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-mint/20 blur-3xl" />

                <div className="relative">
                  <div className="mb-5 flex items-center gap-2">
                    <div className="rounded-xl bg-white/10 p-2 backdrop-blur-sm">
                      <Home className="h-5 w-5 text-mint" />
                    </div>
                    <span className="text-sm font-medium uppercase tracking-wide text-white/80">Property Value</span>
                  </div>
                  {isCalculating ? (
                    <div className="skeleton mb-2 h-16 w-56 rounded-2xl" aria-hidden />
                  ) : (
                    <div className="mb-2 text-6xl font-bold tracking-tight md:text-7xl lg:text-8xl">
                      ${(propertyValue / 1000000).toFixed(2)}M
                    </div>
                  )}
                  <p className="text-sm text-white/60">With just a 2% deposit, you could own this</p>
                </div>
              </motion.div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="glass shadow-refined rounded-2xl border-ink/10 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint/10">
                      <DollarSign className="h-3.5 w-3.5 text-brand" />
                    </div>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-ink/55">Stamp Duty</span>
                  </div>
                  {isCalculating ? (
                    <div className="skeleton h-9 w-20 rounded-lg" aria-hidden />
                  ) : (
                    <div className="text-2xl font-bold tracking-tight text-brand md:text-3xl">${(stampDuty / 1000).toFixed(0)}k</div>
                  )}
                  <p className="mt-0.5 text-[11px] text-ink/45">Approx.</p>
                </Card>

                <Card className="glass shadow-refined rounded-2xl border-ink/10 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint/15">
                      <TrendingUp className="h-3.5 w-3.5 text-brand" />
                    </div>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-ink/55">Total Upfront</span>
                  </div>
                  {isCalculating ? (
                    <div className="skeleton h-9 w-20 rounded-lg" aria-hidden />
                  ) : (
                    <div className="text-2xl font-bold tracking-tight text-brand md:text-3xl">
                      ${((deposit + stampDuty) / 1000).toFixed(0)}k
                    </div>
                  )}
                  <p className="mt-0.5 text-[11px] text-ink/45">You need this</p>
                </Card>

                {/* NEW: Savings comparison */}
                <Card className="shadow-refined rounded-2xl border-mint/30 bg-gradient-to-br from-mint/15 to-mint/5 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white">
                      <TrendingDown className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-brand/70">You Save</span>
                  </div>
                  {isCalculating ? (
                    <div className="skeleton h-9 w-20 rounded-lg" aria-hidden />
                  ) : (
                    <div className="text-2xl font-bold tracking-tight text-brand md:text-3xl">
                      ${(savings / 1000).toFixed(0)}k
                    </div>
                  )}
                  <p className="mt-0.5 text-[11px] text-brand/55">vs. 20% deposit</p>
                </Card>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 text-center"
          >
            <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button className="shadow-refined-lg h-auto rounded-2xl px-8 py-4 text-base" size="lg" variant="brand">
                Get Pre-Approved in 48 Hours
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Rates — Dark section with toggle ─────────────────────────────── */

function RatesSection() {
  const [mode, setMode] = useState<PricingMode>("purchase");
  const homeRate = HOME_RATES[mode];
  const investRate = INVESTMENT_RATES[mode];
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="rates" className="section-shell section-y">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: MOTION_EASE }}
        className="overflow-hidden rounded-[2rem] bg-brand text-white shadow-[0_38px_75px_-45px_rgba(24,67,45,0.85)]"
      >
        <div className="p-7 md:p-10">
          {/* Header */}
          <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-3">
              <Badge className="w-fit border-white/25 bg-white/10 text-[0.72rem] uppercase tracking-[0.14em] text-white">
                Current rates
              </Badge>
              <h2 className="font-display text-4xl tracking-tight md:text-5xl">
                Clear pricing. No confusion.
              </h2>
              <p className="max-w-lg text-sm text-white/75 md:text-base">
                Compare product and comparison rates side by side, with transparent terms from day one.
              </p>
            </div>

            {/* Toggle */}
            <div className="flex rounded-full border border-white/20 bg-white/10 p-1">
              <button
                type="button"
                onClick={() => setMode("purchase")}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                  mode === "purchase" ? "bg-mint text-brand shadow-lg" : "text-white/70 hover:text-white",
                )}
              >
                Purchase
              </button>
              <button
                type="button"
                onClick={() => setMode("refinance")}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                  mode === "refinance" ? "bg-mint text-brand shadow-lg" : "text-white/70 hover:text-white",
                )}
              >
                Refinance
              </button>
            </div>
          </div>

          {/* Rate cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Owner Occupied", subtitle: "P&I rates from", rate: homeRate },
              { label: "Investment Property", subtitle: "P&I rates from", rate: investRate },
            ].map((card) => (
              <Card key={card.label} className="rounded-2xl border-white/15 bg-white/8 text-white shadow-none backdrop-blur-sm">
                <CardContent className="space-y-5 p-6">
                  <p className="text-sm uppercase tracking-[0.12em] text-mint">{card.label}</p>
                  <div>
                    <p className="font-display text-5xl leading-none tracking-tight">{card.rate.effectiveRate}%</p>
                    <p className="mt-1 text-xs text-white/60">Effective rate p.a.</p>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div>
                    <p className="font-display text-3xl leading-none tracking-tight">{card.rate.comparisonRate}%</p>
                    <p className="mt-1 text-xs text-white/60">Comparison rate p.a.**</p>
                  </div>
                  <a
                    href="#apply"
                    className={cn(
                      buttonVariants({ variant: "mint", size: "sm" }),
                      "mt-2 w-full rounded-full font-semibold",
                    )}
                  >
                    Apply now
                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Bank Comparison ──────────────────────────────────────────────── */

function BankComparison() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-y-lg relative overflow-hidden bg-muted/40">
      <div className="gradient-mesh absolute inset-0" />

      <div className="section-shell relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: MOTION_EASE }}
          className="mb-14 space-y-4 text-center"
        >
          <h2 className="section-heading text-brand">Skip the wait.</h2>
          <p className="measure-copy mx-auto text-base text-ink/60 md:text-lg">
            Same security as banks. Better terms for you.
          </p>
        </motion.div>

        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: MOTION_EASE }}
            className="glass shadow-refined-lg overflow-hidden rounded-3xl border border-ink/10"
          >
            <div className="grid grid-cols-3 bg-gradient-to-br from-brand to-brand-dark p-6">
              <div />
              <div className="text-center">
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <X className="h-5 w-5 text-white/70" />
                </div>
                <div className="text-sm font-semibold text-white/90">Traditional</div>
              </div>
              <div className="text-center">
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-mint shadow-lg">
                  <Check className="h-5 w-5 text-brand" />
                </div>
                <div className="text-sm font-semibold text-white">Skip</div>
              </div>
            </div>

            <div className="divide-y divide-ink/5">
              {BANK_COMPARISONS.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.15 + index * 0.06 }}
                  className={cn(
                    "grid grid-cols-3 gap-4 p-4 md:p-6",
                    item.highlight ? "bg-mint/5" : "bg-white",
                  )}
                >
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-ink md:text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center justify-center text-center">
                    <span className="text-sm font-semibold text-ink/50 md:text-lg">{item.bank}</span>
                  </div>
                  <div className="flex items-center justify-center text-center">
                    <span className={cn("text-sm font-bold md:text-lg", item.highlight ? "text-brand" : "text-ink")}>
                      {item.skip}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-ink/5 bg-gradient-to-br from-soft/50 to-white p-6">
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button className="shadow-refined h-auto w-full rounded-2xl px-6 py-4" variant="brand">
                  Choose Skip — Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <div className="glass shadow-refined inline-flex items-center gap-3 rounded-full border border-mint/20 px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint">
                <TrendingDown className="h-5 w-5 text-brand" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-ink/60">On a $1M property, you save</div>
                <div className="text-lg font-bold text-brand md:text-xl">$180,000 upfront</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── First Home Buyer Comparison ──────────────────────────────────── */

function FirstHomeBuyerSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-y relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(121,200,155,0.14),transparent_42%)]" />
      <div className="section-shell relative">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: MOTION_EASE }}
          className="mb-12 space-y-4 text-center md:mb-14"
        >
          <h2 className="section-heading text-brand">
            Skip the First Home Buyer constraints.
          </h2>
          <p className="measure-copy mx-auto text-base text-ink/60 md:text-lg">
            More flexible, available to everyone, and a lower deposit.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          <Card className="rounded-3xl border-ink/10 bg-muted/30">
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
                <h3 className="text-xl font-semibold text-ink md:text-2xl">First Home Buyer Scheme</h3>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-ink/10 text-ink/60">
                  <X className="h-5 w-5" />
                </span>
              </div>
              <dl className="divide-y divide-ink/10">
                {FIRST_HOME_BUYER_ROWS.map((row) => (
                  <div key={`fhb-${row.label}`} className="space-y-2 px-6 py-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">{row.label}</dt>
                    <dd className="text-base font-medium text-ink/80 md:text-lg">{row.fhb}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-mint/40 bg-gradient-to-b from-mint/20 to-mint/10 shadow-refined">
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b border-brand/15 px-6 py-5">
                <h3 className="text-xl font-semibold text-brand md:text-2xl">Skip</h3>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
                  <Check className="h-5 w-5" />
                </span>
              </div>
              <dl className="divide-y divide-brand/10">
                {FIRST_HOME_BUYER_ROWS.map((row) => (
                  <div key={`skip-${row.label}`} className="space-y-2 px-6 py-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand/60">{row.label}</dt>
                    <dd className="text-base font-semibold text-brand md:text-lg">{row.skip}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ─── Skip To... Journey Cards ─────────────────────────────────────── */

function PathwaysSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section ref={ref} className="section-y-lg relative overflow-hidden bg-gradient-to-b from-white via-soft/20 to-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-20 h-[600px] w-[600px] rounded-full bg-mint/5 blur-3xl" />
        <div className="absolute bottom-20 left-0 h-[500px] w-[500px] rounded-full bg-brand/5 blur-3xl" />
      </div>

      <div className="section-shell relative">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: MOTION_EASE }}
          className="mb-14 flex flex-wrap items-end justify-between gap-4"
        >
          <div className="space-y-3">
            <Badge variant="outline" className="rounded-full border-brand/20 bg-white/70 text-brand">
              Popular pathways
            </Badge>
            <h2 className="section-heading text-brand">Choose your next move.</h2>
          </div>
          <a href="#apply" className="group inline-flex items-center gap-2 text-sm font-semibold text-brand">
            Start application
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {PATHWAYS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 48 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + index * 0.12, ease: MOTION_EASE }}
              whileHover={{ y: -6 }}
            >
              <Card className="group h-full overflow-hidden rounded-[1.6rem] border-brand/10 bg-white shadow-refined transition-shadow hover:shadow-refined-lg">
                <CardContent className="p-0">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      width={640}
                      height={420}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/15 via-transparent to-transparent" />
                  </div>
                  <div className="space-y-3 p-6">
                    <h3 className="font-display text-2xl leading-tight tracking-tight text-brand md:text-3xl">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-ink/65">{item.description}</p>
                    <a href="#apply" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark">
                      Learn more
                      <ArrowRight className="size-3.5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─────────────────────────────────────────────────── */

function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-y-lg relative overflow-hidden bg-white" id="how-it-works">
      <div className="dot-pattern absolute inset-0 opacity-30" />

      <div className="section-shell relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: MOTION_EASE }}
          className="mb-14 text-center"
        >
          <Badge variant="mint" className="mx-auto mb-4 w-fit border-brand/15">
            How it works
          </Badge>
          <h2 className="section-heading text-brand">From application to keys.</h2>
          <p className="measure-copy mx-auto mt-4 text-base text-ink/60 md:text-lg">
            Same as a bank — just with better numbers.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1, ease: MOTION_EASE }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <Card className="glass shadow-refined h-full rounded-2xl border-ink/8 p-6 transition-all group-hover:border-mint/25 group-hover:shadow-refined-lg">
                <div className="mb-4 font-display text-5xl leading-none text-brand/25 lg:text-6xl">{step.number}</div>
                <h3 className="mb-2 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="text-sm leading-relaxed text-ink/60">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3"
        >
          {[
            { title: "Fully Regulated", desc: "ASIC licensed Australian lender" },
            { title: "No Hidden Fees", desc: "Transparent, upfront pricing" },
            { title: "Local Support", desc: "Australian team, always here" },
          ].map((card) => (
            <motion.div key={card.title} whileHover={{ y: -2 }}>
              <Card className="glass shadow-refined rounded-2xl border-ink/8 p-5 text-center">
                <div className="mx-auto mb-2 h-2 w-2 rounded-full bg-mint" />
                <h4 className="text-base font-semibold text-ink">{card.title}</h4>
                <p className="mt-1 text-sm text-ink/55">{card.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Benefits + Testimonial ───────────────────────────────────────── */

function BenefitsAndTestimonialSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section-shell section-y" id="benefits">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: MOTION_EASE }}
        className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"
      >
        {/* Why Skip panel */}
        <div className="rounded-[2rem] bg-brand p-7 text-white md:p-9">
          <h2 className="font-display text-4xl tracking-tight md:text-5xl">Why people choose Skip.</h2>
          <ul className="mt-6 space-y-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-mint" aria-hidden />
                <span className="text-sm text-white/88 md:text-base">{benefit}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <ShieldCheck className="mb-2 size-5 text-mint" />
              <p className="text-xs uppercase tracking-[0.12em] text-white/70">Security</p>
              <p className="mt-1 text-sm text-white/90">Bank-grade controls and encrypted doc handling.</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <Clock3 className="mb-2 size-5 text-mint" />
              <p className="text-xs uppercase tracking-[0.12em] text-white/70">Speed</p>
              <p className="mt-1 text-sm text-white/90">Faster path from application to pre-approval.</p>
            </div>
          </div>
        </div>

        {/* Testimonial panel */}
        <div className="rounded-[2rem] border border-brand/10 bg-white p-7 md:p-9">
          <BadgeDollarSign className="mb-4 size-6 text-brand" />
          <h3 className="font-display text-3xl leading-tight tracking-tight text-brand md:text-4xl">
            &ldquo;Skip helped us buy years earlier than we expected.&rdquo;
          </h3>
          <p className="mt-4 text-sm text-ink/70 md:text-base">
            We thought we needed a full 20% saved to make a move. With Skip we kept our plans
            on track, stayed in control of repayments, and bought in the suburb we actually wanted.
          </p>
          <p className="mt-4 text-sm font-semibold text-brand">Sarah and Dan, Melbourne</p>

          <div className="mt-7 rounded-2xl bg-canvas p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-brand/55">Quick comparison</p>
            <dl className="mt-2 space-y-2 text-sm text-brand/80">
              <div className="flex items-center justify-between gap-4 border-b border-brand/10 pb-2">
                <dt>Traditional deposit</dt>
                <dd className="font-semibold">20%</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-brand/10 pb-2">
                <dt>Skip minimum deposit</dt>
                <dd className="font-semibold text-brand">2%</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Time to start</dt>
                <dd className="font-semibold text-brand">Now</dd>
              </div>
            </dl>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── FAQ ───────────────────────────────────────────────────────────── */

function FaqSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="faq" className="section-shell section-y">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: MOTION_EASE }}
        className="rounded-[2rem] border border-brand/10 bg-white p-6 md:p-10"
      >
        <div className="mb-8">
          <Badge variant="mint" className="mb-3 border-brand/15">FAQ</Badge>
          <h2 className="font-display text-4xl tracking-tight text-brand md:text-5xl">
            Common questions
          </h2>
        </div>
        <div className="divide-y divide-brand/10">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex list-none items-center justify-between gap-4 text-left text-base font-semibold text-brand marker:content-none [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronRight className="size-4 shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink/65 md:text-base">{item.answer}</p>
            </details>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Closing CTA ──────────────────────────────────────────────────── */

function ClosingCtaSection() {
  return (
    <section className="section-shell pb-20">
      <Card className="relative overflow-hidden rounded-[2rem] border-brand/20 bg-gradient-to-br from-brand to-brand-dark p-8 text-white shadow-[0_30px_80px_-40px_rgba(31,86,58,0.8)] md:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(121,200,155,0.28),transparent_42%)]" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
          <SkipLogo variant={1} className="h-10 rounded-full md:h-12" />
          <h2 className="section-heading mt-6 max-w-[18ch] text-white">
            Ready to skip to the owning bit?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            Start with just 2% deposit. Same bank-grade process, 10x less upfront.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/85">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-mint" />
              10-minute application
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-mint" />
              Response in 48 hours
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-mint" />
              Licensed Australian lender
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#apply"
              className={cn(
                buttonVariants({ variant: "mint", size: "lg" }),
                "rounded-full px-8 font-semibold focus-visible:ring-mint focus-visible:ring-offset-brand",
              )}
            >
              Apply now
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#calculator"
              className={cn(
                buttonVariants({ variant: "glass", size: "lg" }),
                "rounded-full px-8 focus-visible:ring-mint focus-visible:ring-offset-brand",
              )}
            >
              Calculate first
            </a>
          </div>
        </div>
      </Card>
    </section>
  );
}

/* ─── Marquee banner ───────────────────────────────────────────────── */

function MarqueeBanner() {
  return (
    <section className="overflow-hidden border-y border-brand/10 bg-mint/30">
      <div className="whitespace-nowrap py-4 text-center text-sm font-semibold uppercase tracking-[0.16em] text-brand/80">
        <span className="mx-5">Skip lending</span>
        <span className="mx-5">2% deposit</span>
        <span className="mx-5">transparent rates</span>
        <span className="mx-5">local support</span>
        <span className="mx-5">security first</span>
        <span className="mx-5">skip waiting</span>
      </div>
    </section>
  );
}

/* ─── Footer ───────────────────────────────────────────────────────── */

function FooterSection() {
  return (
    <footer className="section-y relative overflow-hidden bg-gradient-to-b from-brand to-brand-dark text-white">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="section-shell relative">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-2">
              <div>
                <h3 className="font-display mb-3 text-4xl tracking-tight">Skip</h3>
                <p className="max-w-md text-sm leading-relaxed text-white/70">
                  Making property ownership accessible with 2% deposit home loans. Licensed and regulated in Australia.
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button className="rounded-xl shadow-lg focus-visible:ring-mint focus-visible:ring-offset-brand" size="lg" variant="mint">
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">Product</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li><a href="#calculator" className="rounded-sm transition-colors hover:text-mint">Calculator</a></li>
                <li><a href="#how-it-works" className="rounded-sm transition-colors hover:text-mint">How It Works</a></li>
                <li><a href="#rates" className="rounded-sm transition-colors hover:text-mint">Pricing</a></li>
                <li><a href="#faq" className="rounded-sm transition-colors hover:text-mint">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">Compliance</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li>Australian Credit Licence XXXXXX</li>
                <li>Responsible lending framework</li>
                <li>Bank-grade security controls</li>
                <li>Australian support team</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">Legal & Contact</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li><a href="#" className="rounded-sm transition-colors hover:text-mint">Privacy</a></li>
                <li><a href="#" className="rounded-sm transition-colors hover:text-mint">Terms</a></li>
                <li><a href="#" className="rounded-sm transition-colors hover:text-mint">Disclaimer</a></li>
                <li><a href="#" className="rounded-sm transition-colors hover:text-mint">Credit Guide</a></li>
                <li>support@skip.com.au</li>
                <li>1300 000 000</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 border-t border-white/10 pt-8">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-xs leading-relaxed text-white/60">
                <strong className="font-semibold text-white/80">Important:</strong> Skip is a registered trading name of Skip
                Financial Pty Ltd ACN XXX XXX XXX, Australian Credit Licence XXXXXX. This website contains general information
                only. Consider your circumstances before proceeding.
              </p>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/50 md:flex-row">
              <p>&copy; 2026 Skip Financial. All rights reserved.</p>
              <p className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-mint" />
                <span>Australian owned and operated</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Mobile Sticky CTA ────────────────────────────────────────────── */

function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY >= window.innerHeight * 0.5);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/20 bg-brand/95 px-4 py-3 shadow-2xl backdrop-blur-md md:hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <a
        href="#apply"
        className={cn(
          buttonVariants({ variant: "mint", size: "lg" }),
          "w-full rounded-full font-semibold focus-visible:ring-mint focus-visible:ring-offset-brand",
        )}
      >
        Apply now
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function Option7Page() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative overflow-x-clip bg-canvas text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }} />

        <Header />

        <main className="pb-24 md:pb-0">
          <Hero />
          <SocialProofBar />
          <TrustPillarsSection />
          <DepositCalculator />
          <RatesSection />
          <BankComparison />
          <FirstHomeBuyerSection />
          <PathwaysSection />
          <HowItWorksSection />
          <BenefitsAndTestimonialSection />
          <FaqSection />
          <ClosingCtaSection />
          <MarqueeBanner />
        </main>

        <FooterSection />
        <MobileStickyCta />
      </div>
    </MotionConfig>
  );
}
