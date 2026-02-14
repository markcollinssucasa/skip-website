"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  House,
  Lock,
  ShieldCheck,
  Sparkles,
  TrendingDown,
} from "lucide-react";

import { SkipLogo } from "@/components/brand/skip-logo";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type RateMode = "purchase" | "refinance";

interface RateRow {
  effective: string;
  comparison: string;
  subtitle: string;
}

interface RateCard {
  title: string;
  description: string;
  rates: Record<RateMode, RateRow>;
}

const RATE_CARDS: RateCard[] = [
  {
    title: "Owner Occupied",
    description: "For your home",
    rates: {
      purchase: {
        effective: "6.30",
        comparison: "6.63",
        subtitle: "New purchase",
      },
      refinance: {
        effective: "6.12",
        comparison: "6.44",
        subtitle: "Refinance",
      },
    },
  },
  {
    title: "Investment",
    description: "For portfolio growth",
    rates: {
      purchase: {
        effective: "6.65",
        comparison: "6.95",
        subtitle: "New purchase",
      },
      refinance: {
        effective: "6.49",
        comparison: "6.82",
        subtitle: "Refinance",
      },
    },
  },
];

const COMPARISON_ROWS = [
  { label: "Deposit", bank: "20%", skip: "2%" },
  { label: "On a $1M property", bank: "$200,000 upfront", skip: "$20,000 upfront" },
  { label: "Typical time to save", bank: "8-10 years", skip: "Buy sooner" },
  { label: "Loan process", bank: "Bank process", skip: "Bank process" },
];

const SKIP_TO_CARDS = [
  {
    title: "My own home",
    description: "Stop renting sooner with a smaller upfront hurdle.",
    imageSrc: "/skip-owning-home.png",
    imageAlt: "Kangaroo relaxing in a living room",
  },
  {
    title: "A larger place",
    description: "Upgrade when life changes, not years later.",
    imageSrc: "/skip-larger-place.png",
    imageAlt: "Kangaroo mowing a yard in front of a larger home",
  },
  {
    title: "An investment property",
    description: "Enter the market with less cash tied up in deposit.",
    imageSrc: "/skip-investment-property.png",
    imageAlt: "Kangaroo at sunset representing investment goals",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Start online",
    description: "Tell us about your goals in a short guided application.",
  },
  {
    number: "02",
    title: "Get assessed",
    description: "A specialist reviews your scenario and documents.",
  },
  {
    number: "03",
    title: "Find and secure",
    description: "Search with confidence knowing your funding path.",
  },
  {
    number: "04",
    title: "Settle and move",
    description: "Complete settlement and get keys to your property.",
  },
];

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Licensed lender",
    description: "Australian credit-licensed and compliance-led.",
  },
  {
    icon: Lock,
    title: "Privacy-first",
    description: "Bank-grade security controls for application data.",
  },
  {
    icon: Building2,
    title: "Human support",
    description: "Local team from pre-approval through settlement.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is this a real home loan?",
    answer:
      "Yes. Skip home loans follow standard lending checks, documentation requirements, and legal protections.",
  },
  {
    question: "Who is this best for?",
    answer:
      "Buyers who can service a mortgage but are blocked by a traditional 20% deposit requirement.",
  },
  {
    question: "How quickly can I apply?",
    answer:
      "You can start online in minutes. A specialist then guides you through your full application.",
  },
  {
    question: "Can I use this for investment properties?",
    answer:
      "Yes. Investment pricing and eligibility are available depending on your profile and property details.",
  },
];

const REVIEW_CARDS = [
  {
    quote: "We thought we were years away. Skip helped us buy with confidence much sooner.",
    name: "Alicia & Tom",
    location: "Inner West NSW",
  },
  {
    quote: "The process felt structured and clear from start to finish. No surprises.",
    name: "Nadia R.",
    location: "Brisbane QLD",
  },
  {
    quote: "Small deposit, solid support, and fast responses when timing mattered most.",
    name: "Chris P.",
    location: "Geelong VIC",
  },
];

function formatK(value: number) {
  return `${(value / 1000).toFixed(0)}k`;
}

export default function Option3Page() {
  const [mode, setMode] = useState<RateMode>("purchase");
  const [deposit, setDeposit] = useState(20000);

  const propertyValue = deposit * 50;
  const stampDuty = propertyValue * 0.04;
  const upfront = deposit + stampDuty;

  return (
    <main id="top" className="bg-canvas text-ink">
      <header className="sticky top-0 z-40 border-b border-brand/10 bg-canvas/80 backdrop-blur-xl">
        <div className="section-shell flex h-[4.5rem] items-center justify-between">
          <a href="#top" aria-label="Skip home" className="inline-flex items-center">
            <SkipLogo variant={1} className="h-8" />
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-ink/70 md:flex">
            <a href="#rates" className="transition-colors hover:text-brand">
              Rates
            </a>
            <a href="#calculator" className="transition-colors hover:text-brand">
              Calculator
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-brand">
              How it works
            </a>
            <a href="#faq" className="transition-colors hover:text-brand">
              FAQ
            </a>
          </nav>
          <a
            href="#apply"
            className={cn(
              buttonVariants({ variant: "brand", size: "sm" }),
              "rounded-full px-5 focus-visible:ring-brand focus-visible:ring-offset-canvas",
            )}
          >
            Start now
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-brand/10 bg-[linear-gradient(150deg,rgba(31,86,58,0.06),transparent_42%),linear-gradient(330deg,rgba(121,200,155,0.16),transparent_38%),linear-gradient(180deg,#ffffff_0%,#f3f8f3_100%)]">
        <div className="section-shell grid min-h-[calc(100vh-72px)] items-center gap-14 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
          <div className="space-y-8">
            <Badge variant="mint" className="w-fit px-4 py-1.5 text-[0.72rem] tracking-[0.12em]">
              AUSTRALIAN LENDER
            </Badge>
            <div className="space-y-5">
              <h1 className="font-display max-w-[16ch] text-5xl leading-[0.94] tracking-[-0.03em] text-brand md:text-7xl">
                Own sooner with a 2% deposit.
              </h1>
              <p className="max-w-[58ch] text-lg leading-relaxed text-ink/75 md:text-xl">
                Same loan process. Same security controls. A dramatically lower upfront deposit so your timeline can
                match your income, not a decade of saving.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#apply"
                className={cn(
                  buttonVariants({ variant: "brand", size: "xl" }),
                  "h-[3.25rem] rounded-full px-8 shadow-[0_18px_40px_-24px_rgba(31,86,58,0.65)]",
                )}
              >
                Apply now
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#calculator"
                className={cn(
                  buttonVariants({ variant: "outline", size: "xl" }),
                  "h-[3.25rem] rounded-full border-brand/30 bg-white/75 px-8 text-brand hover:bg-mint/20",
                )}
              >
                See borrowing power
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricPill label="From deposit" value="2%" />
              <MetricPill label="Typical response" value="48 hrs" />
              <MetricPill label="Families settled" value="3,000+" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-8 -top-10 h-56 w-56 rounded-full bg-mint/25 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-brand/15 blur-3xl" />
            <Card className="relative overflow-hidden rounded-[2.25rem] border-brand/10 bg-white/80 shadow-[0_36px_90px_-54px_rgba(31,86,58,0.68)]">
              <CardContent className="p-3">
                <div className="relative aspect-[5/6] overflow-hidden rounded-[1.85rem] border border-white/70">
                  <Image
                    src="/hero-kangaroo.png"
                    alt="Kangaroo celebrating in front of a sold sign"
                    fill
                    priority
                    sizes="(min-width: 1024px) 44vw, 90vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/35 via-brand/5 to-transparent" />
                </div>
              </CardContent>
            </Card>
            <div className="absolute bottom-5 left-5 rounded-2xl border border-white/50 bg-white/85 px-4 py-3 shadow-xl backdrop-blur">
              <p className="text-[0.66rem] font-semibold tracking-[0.14em] text-ink/55">DEPOSIT ON $1M</p>
              <p className="font-display text-3xl leading-none tracking-[-0.03em] text-brand">$20k</p>
            </div>
            <div className="absolute right-5 top-5 rounded-2xl border border-brand/20 bg-brand px-4 py-3 text-white shadow-xl">
              <p className="text-[0.66rem] font-semibold tracking-[0.14em] text-white/70">SKIP RATE FROM</p>
              <p className="font-display text-3xl leading-none tracking-[-0.03em]">6.30%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-12 md:py-14">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-3xl border-brand/15 bg-white/70">
            <CardContent className="flex items-start gap-4 p-6">
              <span className="mt-0.5 rounded-xl bg-mint/30 p-2 text-brand">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-brand">Licensed and regulated</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/65">Built on responsible lending standards.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-brand/15 bg-white/70">
            <CardContent className="flex items-start gap-4 p-6">
              <span className="mt-0.5 rounded-xl bg-mint/30 p-2 text-brand">
                <Lock className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-brand">Bank-grade security</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/65">Your application data is protected end-to-end.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-brand/15 bg-white/70">
            <CardContent className="flex items-start gap-4 p-6">
              <span className="mt-0.5 rounded-xl bg-mint/30 p-2 text-brand">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-brand">Fast specialist support</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/65">Clear guidance from pre-approval to settlement.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="rates" className="section-y border-y border-brand/10 bg-white">
        <div className="section-shell">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-[0.2em] text-brand/65">PRICING</p>
              <h2 className="font-display text-4xl tracking-[-0.02em] text-brand md:text-6xl">Rates built for speed</h2>
              <p className="max-w-[58ch] text-base leading-relaxed text-ink/65 md:text-lg">
                Choose your scenario to preview indicative rates. Final pricing and eligibility depend on your full
                application profile.
              </p>
            </div>
            <div className="flex w-full max-w-[20rem] rounded-full border border-brand/20 bg-canvas p-1">
              <button
                type="button"
                onClick={() => setMode("purchase")}
                className={cn(
                  "w-1/2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                  mode === "purchase" ? "bg-brand text-white" : "text-brand/70 hover:text-brand",
                )}
                aria-pressed={mode === "purchase"}
              >
                Purchase
              </button>
              <button
                type="button"
                onClick={() => setMode("refinance")}
                className={cn(
                  "w-1/2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                  mode === "refinance" ? "bg-brand text-white" : "text-brand/70 hover:text-brand",
                )}
                aria-pressed={mode === "refinance"}
              >
                Refinance
              </button>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {RATE_CARDS.map((card) => {
              const row = card.rates[mode];
              return (
                <Card
                  key={card.title}
                  className="rounded-[2rem] border-brand/15 bg-[linear-gradient(155deg,rgba(255,255,255,1),rgba(121,200,155,0.14))]"
                >
                  <CardContent className="space-y-7 p-7 md:p-9">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.18em] text-brand/65">{row.subtitle}</p>
                        <h3 className="mt-2 font-display text-3xl tracking-[-0.02em] text-brand md:text-4xl">
                          {card.title}
                        </h3>
                        <p className="mt-2 text-sm text-ink/65">{card.description}</p>
                      </div>
                      <span className="rounded-full bg-brand/8 px-3 py-1 text-xs font-semibold text-brand">P&I</span>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div className="rounded-2xl border border-brand/15 bg-white px-4 py-4">
                        <p className="text-[0.68rem] font-semibold tracking-[0.15em] text-ink/55">EFFECTIVE RATE</p>
                        <p className="mt-2 font-display text-5xl leading-none tracking-[-0.04em] text-brand">
                          {row.effective}
                        </p>
                        <p className="mt-1 text-sm text-ink/70">% p.a.</p>
                      </div>
                      <div className="rounded-2xl border border-brand/15 bg-white px-4 py-4">
                        <p className="text-[0.68rem] font-semibold tracking-[0.15em] text-ink/55">COMPARISON RATE</p>
                        <p className="mt-2 font-display text-5xl leading-none tracking-[-0.04em] text-brand">
                          {row.comparison}
                        </p>
                        <p className="mt-1 text-sm text-ink/70">% p.a.</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href="#apply"
                        className={cn(buttonVariants({ variant: "brand", size: "lg" }), "rounded-full px-6")}
                      >
                        Apply now
                        <ChevronRight className="h-4 w-4" />
                      </a>
                      <a
                        href="#faq"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark"
                      >
                        View eligibility
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-y-lg border-b border-brand/10">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-brand/65">WHY SKIP</p>
            <h2 className="font-display max-w-[15ch] text-4xl tracking-[-0.02em] text-brand md:text-6xl">
              Skip the decade-long deposit grind.
            </h2>
            <p className="max-w-[56ch] text-base leading-relaxed text-ink/70 md:text-lg">
              If you can service a loan but cannot hit a traditional deposit target, Skip reduces the barrier while
              preserving the structure and protections you expect from a mainstream lender.
            </p>
            <a href="#calculator" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full border-brand/30 px-6 text-brand")}>
              Run the numbers
            </a>
          </div>

          <Card className="overflow-hidden rounded-[2rem] border-brand/15 bg-white">
            <CardContent className="p-0">
              <div className="grid grid-cols-3 bg-brand px-6 py-5 text-sm text-white">
                <span />
                <span className="text-center font-semibold text-white/75">Traditional</span>
                <span className="text-center font-semibold">Skip</span>
              </div>
              {COMPARISON_ROWS.map((row) => (
                <div key={row.label} className="grid grid-cols-3 items-center gap-3 border-t border-brand/10 px-5 py-4 md:px-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">{row.label}</p>
                  <p className="text-center text-sm font-medium text-ink/60 md:text-base">{row.bank}</p>
                  <p className="text-center text-sm font-semibold text-brand md:text-base">{row.skip}</p>
                </div>
              ))}
              <div className="border-t border-brand/10 bg-mint/18 px-6 py-5">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand md:text-base">
                  <TrendingDown className="h-4 w-4" />
                  Example cash difference on $1M purchase: $180,000 less upfront.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-y">
        <div className="section-shell">
          <div className="mb-8 space-y-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-brand/65">SKIP TO...</p>
            <h2 className="font-display text-4xl tracking-[-0.02em] text-brand md:text-6xl">Your next chapter</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {SKIP_TO_CARDS.map((card) => (
              <Card key={card.title} className="group overflow-hidden rounded-[1.8rem] border-brand/15 bg-white">
                <CardContent className="p-5">
                  <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-2xl">
                    <Image
                      src={card.imageSrc}
                      alt={card.imageAlt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand/18 via-transparent to-transparent" />
                  </div>
                  <h3 className="font-display text-2xl tracking-[-0.02em] text-brand">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="calculator" className="section-y-lg border-y border-brand/10 bg-white">
        <div className="section-shell">
          <div className="mb-10 space-y-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-brand/65">CALCULATOR</p>
            <h2 className="font-display text-4xl tracking-[-0.02em] text-brand md:text-6xl">See what your deposit can do</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
            <Card className="rounded-[2rem] border-brand/15 bg-canvas">
              <CardContent className="space-y-7 p-7">
                <div>
                  <p className="text-xs font-semibold tracking-[0.14em] text-ink/60">YOUR DEPOSIT</p>
                  <p className="mt-2 font-display text-6xl leading-none tracking-[-0.04em] text-brand">
                    ${formatK(deposit)}
                  </p>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={100000}
                  step={1000}
                  value={deposit}
                  onChange={(event) => setDeposit(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-brand/20 accent-brand"
                  aria-label="Deposit amount"
                />
                <div className="flex justify-between text-xs text-ink/55">
                  <span>$5k</span>
                  <span>$100k</span>
                </div>
                <div className="space-y-3 border-t border-brand/10 pt-4">
                  <InfoRow label="Your deposit (2%)" value={`$${formatK(deposit)}`} />
                  <InfoRow label="Estimated stamp duty" value={`$${formatK(stampDuty)}`} />
                  <InfoRow label="Estimated total upfront" value={`$${formatK(upfront)}`} />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden rounded-[2rem] border-brand/15 bg-[linear-gradient(145deg,#1f563a,#2a7050)] text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(121,200,155,0.32),transparent_40%)]" />
              <CardContent className="relative space-y-7 p-7 md:p-9">
                <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-white/80">
                  <House className="h-3.5 w-3.5" />
                  ESTIMATED PROPERTY VALUE
                </p>
                <div>
                  <p className="font-display text-7xl leading-none tracking-[-0.045em] md:text-8xl">
                    ${(propertyValue / 1000000).toFixed(2)}M
                  </p>
                  <p className="mt-3 max-w-[45ch] text-sm leading-relaxed text-white/75 md:text-base">
                    This estimate uses a 2% deposit ratio and excludes fees and individual eligibility checks. Use it
                    as a guide before submitting your full application.
                  </p>
                </div>
                <a
                  href="#apply"
                  className={cn(
                    buttonVariants({ variant: "mint", size: "lg" }),
                    "w-fit rounded-full px-6 text-brand",
                  )}
                >
                  Get pre-approved
                  <ArrowRight className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section-y-lg">
        <div className="section-shell">
          <div className="mb-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-[0.2em] text-brand/65">HOW IT WORKS</p>
              <h2 className="font-display text-4xl tracking-[-0.02em] text-brand md:text-6xl">Simple path, serious lending</h2>
            </div>
            <p className="max-w-[50ch] text-base leading-relaxed text-ink/70 md:text-lg">
              The experience is modern and direct, but the lending process remains structured, documented, and
              compliance-led.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <Card key={step.number} className="rounded-3xl border-brand/15 bg-white">
                <CardContent className="space-y-4 p-6">
                  <p className="font-display text-6xl leading-none tracking-[-0.04em] text-brand/25">{step.number}</p>
                  <h3 className="text-xl font-semibold text-brand">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-ink/65">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="rounded-3xl border-brand/15 bg-white/80">
                  <CardContent className="p-6">
                    <span className="mb-4 inline-flex rounded-xl bg-mint/22 p-2 text-brand">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h4 className="text-lg font-semibold text-brand">{item.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-y border-y border-brand/10 bg-white">
        <div className="section-shell space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-brand/65">REVIEWS</p>
            <h2 className="font-display text-4xl tracking-[-0.02em] text-brand md:text-6xl">Trusted by buyers across Australia</h2>
          </div>
          <Card className="rounded-[2rem] border-brand/15 bg-[linear-gradient(140deg,#1f563a,#2a7050)] text-white">
            <CardContent className="p-8 md:p-10">
              <blockquote className="max-w-[34ch] font-display text-4xl leading-[1.02] tracking-[-0.025em] md:text-6xl">
                "We thought we were years away from owning. Skip got us in far sooner."
              </blockquote>
              <p className="mt-5 text-sm text-white/75 md:text-base">Alicia & Tom, Inner West NSW</p>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-3">
            {REVIEW_CARDS.map((review) => (
              <Card key={review.name} className="rounded-3xl border-brand/15 bg-canvas">
                <CardContent className="space-y-5 p-6">
                  <p className="text-sm leading-relaxed text-ink/75">{review.quote}</p>
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-brand">{review.name}</p>
                    <p className="text-xs text-ink/55">{review.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="section-y">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-brand/65">FAQ</p>
            <h2 className="font-display max-w-[12ch] text-4xl tracking-[-0.02em] text-brand md:text-6xl">
              Questions, answered.
            </h2>
            <p className="max-w-[52ch] text-base leading-relaxed text-ink/70 md:text-lg">
              Need detail before applying? Start here. If your question is specific, our team can step through your
              scenario directly.
            </p>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group rounded-3xl border border-brand/15 bg-white p-6 open:border-brand/35"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-brand md:text-lg">
                  {item.question}
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-mint/20 text-brand transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-ink/70 md:text-base">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="section-shell pb-14 md:pb-20">
        <Card className="relative overflow-hidden rounded-[2rem] border-brand/20 bg-brand text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(121,200,155,0.42),transparent_42%)]" />
          <CardContent className="relative flex flex-col items-start gap-6 p-8 md:p-11">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-white/80">
              <CheckCircle2 className="h-3.5 w-3.5 text-mint" />
              READY WHEN YOU ARE
            </p>
            <h2 className="font-display max-w-[15ch] text-4xl leading-[0.95] tracking-[-0.02em] md:text-6xl">
              Ready to skip to the owning bit?
            </h2>
            <p className="max-w-[58ch] text-base leading-relaxed text-white/80 md:text-lg">
              Start with a quick application and get clarity on your borrowing path. Our team will guide each step.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="mint" size="lg" className="rounded-full px-7 text-brand">
                Start my application
                <ArrowRight className="h-4 w-4" />
              </Button>
              <a
                href="#calculator"
                className={cn(
                  buttonVariants({ variant: "glass", size: "lg" }),
                  "rounded-full border-white/35 px-7",
                )}
              >
                Calculate first
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="overflow-hidden border-y border-brand/15 bg-mint/45 py-3">
        <div className="marquee-track flex min-w-max items-center gap-10 text-xs font-semibold tracking-[0.2em] text-brand/85 md:text-sm">
          {Array.from({ length: 18 }).map((_, index) => (
            <span key={index} className="inline-flex items-center gap-2 whitespace-nowrap">
              <Check className="h-3.5 w-3.5" />
              2% DEPOSIT HOME LOANS
            </span>
          ))}
        </div>
      </section>

      <footer className="bg-[linear-gradient(180deg,#1f563a,#18432d)] text-white">
        <div className="section-shell py-14 md:py-18">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-2">
              <SkipLogo variant={1} className="h-9 rounded-[0.35rem]" />
              <p className="max-w-[48ch] text-sm leading-relaxed text-white/70">
                Skip Financial Pty Ltd ACN XXX XXX XXX. Australian Credit Licence XXXXXX. General information only.
                Consider your circumstances before proceeding.
              </p>
            </div>
            <FooterLinks
              title="Product"
              links={[
                { label: "Rates", href: "#rates" },
                { label: "Calculator", href: "#calculator" },
                { label: "How it works", href: "#how-it-works" },
                { label: "FAQ", href: "#faq" },
              ]}
            />
            <FooterLinks
              title="Compliance"
              links={[
                { label: "Responsible lending", href: "#" },
                { label: "Security controls", href: "#" },
                { label: "Privacy policy", href: "#" },
                { label: "Credit guide", href: "#" },
              ]}
            />
            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-white/80">Contact</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>support@skip.com.au</li>
                <li>1300 000 000</li>
                <li>Mon-Fri, 9am-5pm AEST</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-white/15 pt-5 text-xs text-white/55">
            <p>&copy; 2026 Skip Financial. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .marquee-track {
          animation: skip-marquee 30s linear infinite;
        }

        @keyframes skip-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </main>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-brand/15 bg-white/75 px-4 py-3">
      <p className="text-[0.66rem] font-semibold tracking-[0.14em] text-ink/55">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-brand">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-5 text-sm">
      <span className="text-ink/60">{label}</span>
      <span className="font-semibold text-brand">{value}</span>
    </div>
  );
}

function FooterLinks({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-white/80">{title}</p>
      <ul className="space-y-2 text-sm text-white/70">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="transition-colors hover:text-mint">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
