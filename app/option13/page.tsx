"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  Home,
  Landmark,
  Lock,
  ShieldCheck,
  TrendingDown,
  Users,
} from "lucide-react";

import { SkipLogo } from "@/components/brand/skip-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const APPLY_URL = "https://apply.skiploans.com.au/";

const NAV_ITEMS = [
  { label: "Why Skip", href: "#five-second" },
  { label: "Calculator", href: "#calculator" },
  { label: "Rates", href: "#rates" },
  { label: "Safety", href: "#safety" },
  { label: "FAQ", href: "#faq" },
];

const FIVE_SECOND_ANSWERS = [
  {
    question: "What is this?",
    answer:
      "A regulated Australian home loan pathway that allows eligible buyers to purchase with a 2% deposit.",
    icon: Home,
  },
  {
    question: "Is it for me?",
    answer:
      "It is designed for buyers with serviceability who are delayed primarily by a large upfront deposit requirement.",
    icon: Users,
  },
  {
    question: "Is it real?",
    answer:
      "Skip has settled over $850M nationally and supported 3,000+ families through a standard lending process.",
    icon: FileCheck2,
  },
  {
    question: "Is it safe?",
    answer:
      "Applications follow responsible lending standards, full documentation checks, and bank-grade data controls.",
    icon: ShieldCheck,
  },
  {
    question: "What do I do next?",
    answer:
      "Review your numbers, complete a 10-minute eligibility check, then speak with a specialist within 48 hours.",
    icon: ArrowRight,
  },
];

const TRUST_METRICS = [
  { value: "2%", label: "Minimum deposit" },
  { value: "48 hrs", label: "Typical pre-approval response" },
  { value: "$850M+", label: "Settled nationally" },
  { value: "3,000+", label: "Families supported" },
];

const TRUST_PILLARS = [
  {
    icon: Landmark,
    title: "Regulatory compliance",
    copy:
      "Responsible lending obligations, full documentation, and legal protections across the full lending lifecycle.",
  },
  {
    icon: Lock,
    title: "Bank-grade security controls",
    copy:
      "Application and document handling are protected with privacy-first controls and secure digital workflows.",
  },
  {
    icon: CheckCircle2,
    title: "Transparent commercial terms",
    copy:
      "Clear rates, clear examples, and clear total-cost discussions before any formal commitment is made.",
  },
];

const BUYER_EXAMPLES = [
  {
    title: "First home in Perth",
    buyers: "Mia & Jacob",
    propertyPrice: 800000,
    skipDeposit: 16000,
    bankDeposit: 160000,
    timeline: "Purchased within 5 months rather than waiting years to accumulate a traditional 20% deposit.",
    imageSrc: "/skip-owning-home.png",
    imageAlt: "A buyer relaxing in their first home",
  },
  {
    title: "Upgrade for a growing family",
    buyers: "Aisha & Tom",
    propertyPrice: 1200000,
    skipDeposit: 24000,
    bankDeposit: 240000,
    timeline: "Moved from a unit to a house without pausing plans to rebuild a large deposit balance.",
    imageSrc: "/skip-larger-place.png",
    imageAlt: "A family outside a larger home",
  },
  {
    title: "First investment purchase",
    buyers: "Daniel R.",
    propertyPrice: 900000,
    skipDeposit: 18000,
    bankDeposit: 180000,
    timeline: "Entered the market sooner while preserving liquidity for cash buffer and improvement works.",
    imageSrc: "/skip-investment-property.png",
    imageAlt: "An investor reviewing a property purchase",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Preliminary assessment",
    description: "Use the calculator to review indicative purchasing power, deposit profile, and repayment estimates.",
  },
  {
    number: "02",
    title: "Submit application",
    description: "Complete the online application and provide supporting documents through a secure digital workflow.",
  },
  {
    number: "03",
    title: "Credit review",
    description: "A lending specialist reviews your file with a typical 48-hour response for eligible applications.",
  },
  {
    number: "04",
    title: "Formal approval and settlement",
    description: "On approval, proceed to settlement and transition into ownership.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is this a real regulated home loan?",
    answer:
      "Yes. Skip follows Australian lending standards, responsible lending obligations, and full documentation requirements.",
  },
  {
    question: "Why is the deposit lower?",
    answer:
      "Skip accepts a 2% deposit structure for eligible borrowers. The process remains compliance-led with transparent pricing and legal protections.",
  },
  {
    question: "Who is this best suited to?",
    answer:
      "Buyers with stable income and serviceability who are currently delayed by a traditional large-deposit requirement.",
  },
  {
    question: "Can I refinance later?",
    answer:
      "Yes. Many borrowers refinance as equity grows and their circumstances evolve, similar to other home loan pathways.",
  },
  {
    question: "How quickly can I get started?",
    answer:
      "You can begin online in minutes. Typical response time for eligible files is around 48 hours.",
  },
];

type RateMode = "purchase" | "refinance";

const RATES: Record<
  RateMode,
  {
    label: string;
    ownerOccupied: { effective: number; comparison: number; subtitle: string };
    investment: { effective: number; comparison: number; subtitle: string };
  }
> = {
  purchase: {
    label: "Purchase",
    ownerOccupied: { effective: 6.3, comparison: 6.63, subtitle: "Owner Occupied" },
    investment: { effective: 6.65, comparison: 6.95, subtitle: "Investment" },
  },
  refinance: {
    label: "Refinance",
    ownerOccupied: { effective: 6.12, comparison: 6.44, subtitle: "Owner Occupied" },
    investment: { effective: 6.49, comparison: 6.82, subtitle: "Investment" },
  },
};

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

export default function Option13Page() {
  const [rateMode, setRateMode] = useState<RateMode>("purchase");
  const [deposit, setDeposit] = useState(20000);

  const calculator = useMemo(() => {
    const propertyPrice = deposit / 0.02;
    const bankDeposit = propertyPrice * 0.2;
    const cashDifference = bankDeposit - deposit;
    const stampDutyAllowance = propertyPrice * 0.04;
    const estimatedLoanAmount = propertyPrice - deposit;
    const monthlyRepayment = estimateMonthlyRepayment(
      estimatedLoanAmount,
      RATES[rateMode].ownerOccupied.effective,
    );

    return {
      propertyPrice,
      bankDeposit,
      cashDifference,
      stampDutyAllowance,
      estimatedLoanAmount,
      monthlyRepayment,
    };
  }, [deposit, rateMode]);

  return (
    <div className="min-h-screen bg-white text-ink">
      <header className="sticky top-0 z-40 border-b border-brand/12 bg-white">
        <div className="section-shell flex h-20 items-center justify-between gap-4">
          <a href="#top" aria-label="Skip home" className="text-[2rem] leading-none text-brand">
            <SkipLogo variant={1} priority />
          </a>

          <nav className="hidden items-center gap-7 text-[13px] font-medium tracking-[0.01em] text-ink/70 lg:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-brand">
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={APPLY_URL}
            className={cn(buttonVariants({ size: "sm", variant: "brand" }), "rounded-md px-5")}
          >
            Start Application
          </a>
        </div>
      </header>

      <main id="top">
        <section className="section-shell pb-16 pt-12 md:pb-20 md:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <p className="inline-flex items-center gap-2 rounded-md border border-brand/15 bg-canvas px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand/80">
                <Landmark className="size-3.5" />
                Regulated Australian lender
              </p>

              <div className="space-y-5">
                <h1 className="font-display text-[2.2rem] leading-[1.02] tracking-[-0.025em] text-brand sm:text-5xl lg:text-[3.75rem]">
                  Regulated home loans.
                  <br />
                  2% deposit pathway.
                </h1>
                <p className="measure-copy max-w-[62ch] text-base leading-relaxed text-ink/75 sm:text-lg">
                  Skip provides eligible borrowers with a disciplined path into property ownership sooner. Lending
                  standards, documentation, and legal protections remain central. The key difference is a lower deposit
                  threshold at entry.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={APPLY_URL}
                  className={cn(buttonVariants({ variant: "brand", size: "xl" }), "rounded-md")}
                >
                  Start 10-minute eligibility check
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href="#calculator"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "xl" }),
                    "rounded-md border-brand/20 bg-white text-brand hover:bg-canvas",
                  )}
                >
                  Review calculator
                </a>
              </div>

              <p className="text-xs tracking-wide text-ink/55">
                ACL XXXXXX · Typical response around 48 hours · Privacy-first document handling
              </p>

              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {TRUST_METRICS.map((item) => (
                  <li key={item.label} className="rounded-lg border border-brand/12 bg-white p-4">
                    <p className="font-display text-[1.9rem] tracking-tight text-brand">{item.value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink/55">{item.label}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-xl border border-brand/12 bg-white p-3">
                <div className="relative aspect-[5/4] overflow-hidden rounded-lg">
                  <Image
                    src="/hero-kangaroo-wide-sunrise.png"
                    alt="Skip customer outside their new home at sunrise"
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/10" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-brand/12 bg-canvas p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/45">On a $1M property</p>
                  <p className="mt-2 font-display text-3xl tracking-tight text-brand">$180k</p>
                  <p className="text-sm text-ink/60">Lower upfront cash requirement than a 20% deposit model.</p>
                </div>
                <div className="rounded-lg border border-brand/12 bg-canvas p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/45">Core proposition</p>
                  <p className="mt-2 font-display text-3xl tracking-tight text-brand">2% deposit</p>
                  <p className="text-sm text-ink/60">Standard lending process with a lower deposit threshold.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="five-second" className="section-shell pb-16 md:pb-20">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand/55">Decision essentials</p>
              <h2 className="font-display text-3xl tracking-tight text-brand sm:text-5xl">
                Clarity in under five seconds.
              </h2>
            </div>
            <p className="hidden max-w-sm text-sm text-ink/60 md:block">
              Strong conversion starts with clarity, credibility, and a clear next action.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            {FIVE_SECOND_ANSWERS.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.question} className="rounded-lg border border-brand/12 bg-white p-5">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-canvas text-brand">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-base font-semibold text-brand">{item.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{item.answer}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="calculator" className="border-y border-brand/10 bg-white py-16 md:py-20">
          <div className="section-shell">
            <div className="mb-8 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand/55">Real numbers</p>
              <h2 className="font-display text-3xl tracking-tight text-brand sm:text-5xl">What does a 2% deposit change?</h2>
              <p className="max-w-3xl text-sm leading-relaxed text-ink/65 sm:text-base">
                Adjust the deposit to review indicative purchasing power, estimated repayments, and upfront cash
                differential versus a standard 20% deposit structure.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
              <div className="rounded-xl border border-brand/12 bg-canvas p-6 md:p-8">
                <label htmlFor="deposit-slider" className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/50">
                  Your available deposit
                </label>
                <p className="mt-3 font-display text-5xl tracking-tight text-brand md:text-6xl">{formatAud(deposit)}</p>

                <input
                  id="deposit-slider"
                  type="range"
                  value={deposit}
                  min={5000}
                  max={120000}
                  step={1000}
                  onChange={(event) => setDeposit(Number(event.target.value))}
                  className="mt-6 h-2 w-full cursor-pointer appearance-none rounded-full bg-brand/12 accent-brand"
                />

                <div className="mt-2 flex justify-between text-xs text-ink/45">
                  <span>$5k</span>
                  <span>$120k</span>
                </div>

                <div className="mt-8 grid gap-3">
                  <div className="rounded-lg border border-brand/10 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Estimated property value</p>
                    <p className="mt-1 font-display text-3xl tracking-tight text-brand">{formatAud(calculator.propertyPrice)}</p>
                  </div>
                  <div className="rounded-lg border border-brand/10 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Estimated monthly repayment</p>
                    <p className="mt-1 font-display text-3xl tracking-tight text-brand">
                      {formatAud(calculator.monthlyRepayment)}
                    </p>
                    <p className="mt-1 text-xs text-ink/50">
                      Based on {RATES[rateMode].ownerOccupied.effective.toFixed(2)}% effective rate over 30 years.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-brand/12 bg-canvas p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Skip deposit (2%)</p>
                    <p className="mt-2 font-display text-4xl tracking-tight text-brand">{formatAud(deposit)}</p>
                  </div>
                  <div className="rounded-lg border border-brand/12 bg-canvas p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Traditional deposit (20%)</p>
                    <p className="mt-2 font-display text-4xl tracking-tight text-brand">
                      {formatAud(calculator.bankDeposit)}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-brand/12 bg-canvas p-6">
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand/65">
                    <TrendingDown className="size-4" />
                    Upfront cash difference
                  </p>
                  <p className="mt-2 font-display text-5xl tracking-tight text-brand">
                    {formatAud(calculator.cashDifference)}
                  </p>
                  <p className="mt-2 text-sm text-ink/60">
                    That difference can stay as buffer, moving costs, or renovation capital rather than sitting in a
                    large deposit.
                  </p>
                </div>

                <div className="rounded-lg border border-brand/12 bg-canvas p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Planning allowance</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-ink/55">Approx. stamp duty</p>
                      <p className="font-display text-3xl tracking-tight text-brand">
                        {formatAud(calculator.stampDutyAllowance)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink/55">Estimated loan amount</p>
                      <p className="font-display text-3xl tracking-tight text-brand">
                        {formatAud(calculator.estimatedLoanAmount)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-ink/50">
                    Figures are illustrative only and not personal credit advice.
                  </p>
                </div>

                <a
                  href={APPLY_URL}
                  className={cn(
                    buttonVariants({ variant: "brand", size: "xl" }),
                    "w-full justify-center rounded-md",
                  )}
                >
                  Check eligibility
                  <ChevronRight className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="rates" className="section-shell section-y">
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand/55">Rates</p>
              <h2 className="font-display text-3xl tracking-tight text-brand sm:text-5xl">Transparent pricing.</h2>
              <p className="max-w-2xl text-sm text-ink/65 sm:text-base">
                Same clear structure whether you are purchasing or refinancing.
              </p>
            </div>

            <div className="inline-flex rounded-md border border-brand/12 bg-white p-1">
              {(Object.keys(RATES) as RateMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setRateMode(mode)}
                  className={cn(
                    "rounded-sm px-5 py-2 text-sm font-semibold transition-colors",
                    rateMode === mode ? "bg-brand text-white" : "text-ink/65 hover:text-brand",
                  )}
                >
                  {RATES[mode].label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title: "Owner Occupied", rate: RATES[rateMode].ownerOccupied },
              { title: "Investment", rate: RATES[rateMode].investment },
            ].map((card) => (
              <article key={card.title} className="rounded-xl border border-brand/12 bg-white p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand/55">{card.rate.subtitle}</p>
                <h3 className="mt-2 text-xl font-semibold text-brand">{card.title}</h3>

                <div className="mt-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-ink/45">Effective rate</p>
                    <p className="mt-2 font-display text-4xl tracking-tight text-brand">
                      {card.rate.effective.toFixed(2)}%
                    </p>
                    <p className="text-xs text-ink/45">p.a.</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-ink/45">Comparison rate</p>
                    <p className="mt-2 font-display text-4xl tracking-tight text-brand/70">
                      {card.rate.comparison.toFixed(2)}%
                    </p>
                    <p className="text-xs text-ink/45">p.a.*</p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-ink/50">
                  *Comparison rates are indicative and based on standardized assumptions.
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-brand/10 bg-white py-16 md:py-20">
          <div className="section-shell">
            <div className="mb-8 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand/55">Real examples</p>
              <h2 className="font-display text-3xl tracking-tight text-brand sm:text-5xl">
                Illustrative borrower outcomes.
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-ink/65 sm:text-base">
                Example scenarios illustrating the deposit gap and practical outcomes. Amounts are illustrative and for
                guidance only.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {BUYER_EXAMPLES.map((example) => (
                <article key={example.title} className="overflow-hidden rounded-xl border border-brand/12 bg-canvas">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={example.imageSrc}
                      alt={example.imageAlt}
                      fill
                      sizes="(max-width: 1023px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-4 p-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand/55">{example.buyers}</p>
                      <h3 className="mt-1 text-xl font-semibold text-brand">{example.title}</h3>
                    </div>

                    <div className="space-y-2 rounded-lg border border-brand/12 bg-white p-4 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-ink/60">Property price</span>
                        <strong className="text-brand">{formatAud(example.propertyPrice)}</strong>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-ink/60">Skip deposit (2%)</span>
                        <strong className="text-brand">{formatAud(example.skipDeposit)}</strong>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-ink/60">Traditional 20% deposit</span>
                        <strong className="text-brand">{formatAud(example.bankDeposit)}</strong>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-ink/65">{example.timeline}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="safety" className="section-shell section-y">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr]">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand/55">Governance and controls</p>
              <h2 className="font-display text-3xl tracking-tight text-brand sm:text-5xl">
                Structured and compliance-led.
              </h2>
              <p className="text-sm leading-relaxed text-ink/65 sm:text-base">
                Lending decisions are grounded in regulatory discipline, transparent commercial terms, and practical
                borrower support from initial assessment through settlement.
              </p>

              <div className="rounded-lg border border-brand/12 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Compliance notes</p>
                <ul className="mt-3 space-y-2 text-sm text-ink/65">
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
                    Full terms, fees, and repayment obligations disclosed before commitment.
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid gap-4">
              {TRUST_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <article key={pillar.title} className="rounded-lg border border-brand/12 bg-white p-5">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-brand/10 text-brand">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-brand">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/65">{pillar.copy}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-brand/10 bg-white py-16 md:py-20">
          <div className="section-shell">
            <div className="mb-8 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand/55">How it works</p>
              <h2 className="font-display text-3xl tracking-tight text-brand sm:text-5xl">Four-step lending pathway.</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {PROCESS_STEPS.map((step) => (
                <article key={step.number} className="rounded-lg border border-brand/12 bg-canvas p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand/55">{step.number}</p>
                  <h3 className="mt-2 text-lg font-semibold text-brand">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{step.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-brand/12 bg-canvas p-5">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
                <Clock3 className="size-4" />
                Typical pre-approval response in around 48 hours for eligible applications.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="section-shell section-y">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand/55">FAQ</p>
              <h2 className="font-display text-3xl tracking-tight text-brand sm:text-5xl">Questions, answered.</h2>
              <p className="text-sm leading-relaxed text-ink/65 sm:text-base">
                Everything buyers usually ask before proceeding to formal application.
              </p>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => (
                <details
                  key={item.question}
                  className="rounded-lg border border-brand/12 bg-white p-5 transition-colors open:border-brand/25"
                >
                  <summary className="cursor-pointer list-none text-base font-semibold text-brand [&::-webkit-details-marker]:hidden">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-brand/10 bg-canvas py-16 md:py-20">
          <div className="section-shell">
            <div className="rounded-xl border border-brand/14 bg-white p-8 text-center md:p-10">
              <SkipLogo variant={1} className="mx-auto h-10 rounded-full" />
              <h2 className="mt-5 font-display text-4xl tracking-tight text-brand sm:text-5xl">
                Ready to proceed?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink/70 sm:text-base">
                Begin with a 10-minute eligibility check. If your scenario is suitable, a specialist will guide you
                through a clear lending pathway to settlement.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={APPLY_URL}
                  className={cn(
                    buttonVariants({ size: "xl", variant: "brand" }),
                    "rounded-md px-8",
                  )}
                >
                  Start application
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href="#calculator"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "xl" }),
                    "rounded-md border-brand/20 bg-white px-8 text-brand hover:bg-canvas",
                  )}
                >
                  Review numbers again
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1f2a24] py-12 text-white">
        <div className="section-shell space-y-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <SkipLogo variant={1} className="h-8 rounded-full" />
              <p className="text-sm leading-relaxed text-white/60">
                2% deposit home loans with a compliance-led process and practical specialist guidance.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Product</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/65">
                <li><a href="#five-second" className="transition-colors hover:text-white">Why Skip</a></li>
                <li><a href="#calculator" className="transition-colors hover:text-white">Calculator</a></li>
                <li><a href="#rates" className="transition-colors hover:text-white">Rates</a></li>
                <li><a href="#faq" className="transition-colors hover:text-white">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Compliance</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/65">
                <li>Australian Credit Licence XXXXXX</li>
                <li>Responsible lending obligations</li>
                <li>General information only</li>
                <li>Privacy-first document handling</li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs leading-relaxed text-white/55">
              Skip Financial Pty Ltd ACN XXX XXX XXX, Australian Credit Licence XXXXXX. Information on this page is
              general in nature and does not consider your objectives, financial situation, or needs. Lending criteria,
              terms, fees, and credit approval apply.
            </p>
          </div>

          <p className="text-xs text-white/45">© 2026 Skip Financial. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
