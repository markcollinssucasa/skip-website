"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MotionConfig, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Home,
  Landmark,
  Lock,
  Shield,
  ShieldCheck,
  Star,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SkipLogo } from "@/components/brand/skip-logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SkipRooRunnerScrollPreview } from "@/components/ui/skip-roo-runner-scroll-preview";
import { SkipToOwningBitHeading } from "@/components/brand/skip-to-owning-bit-heading";
import { cn } from "@/lib/utils";

const MOTION_EASE = [0.22, 1, 0.36, 1] as const;
const TRUST_MICROCOPY = "ACL XXXXXX • 48 hours typical response • Privacy-first data handling";
const CALCULATION_DELAY_MS = 220;

const FAQ_ITEMS = [
  {
    question: "Is this a real home loan?",
    answer:
      "Yes. It is a regulated home loan with standard lending checks, documentation, and legal protections.",
  },
  {
    question: "Who is this best for?",
    answer:
      "First-home buyers and upgraders who can service a mortgage but are blocked by the traditional 20% deposit hurdle.",
  },
  {
    question: "How quickly can I apply?",
    answer:
      "You can start online in minutes, then a lending specialist guides your full application through to settlement.",
  },
];

const TRUST_PILLARS = [
  {
    icon: Landmark,
    title: "Licensed Australian lender",
    description: "Structured like a bank process with clear compliance and legal protections.",
  },
  {
    icon: Lock,
    title: "Bank-grade security controls",
    description: "Application, document handling, and approvals follow strict privacy standards.",
  },
  {
    icon: ShieldCheck,
    title: "Human support through settlement",
    description: "Dedicated specialists guide valuations, milestones, and final approval.",
  },
];

const HOME_PRICING_RATES: PricingSet = {
  purchase: {
    title: "New purchase",
    subtitle: "Owner Occupied · P&I rates from:",
    effectiveRate: "6.30",
    comparisonRate: "6.63",
  },
  refinance: {
    title: "Refinance",
    subtitle: "Owner Occupied · P&I rates from:",
    effectiveRate: "6.12",
    comparisonRate: "6.44",
  },
};

const INVESTMENT_PRICING_RATES: PricingSet = {
  purchase: {
    title: "New purchase",
    subtitle: "Investor · P&I rates from:",
    effectiveRate: "6.65",
    comparisonRate: "6.95",
  },
  refinance: {
    title: "Refinance",
    subtitle: "Investor · P&I rates from:",
    effectiveRate: "6.49",
    comparisonRate: "6.82",
  },
};

const BANK_COMPARISONS = [
  { label: "Deposit", bank: "20%", skip: "2%", highlight: true },
  { label: "For $1M Property", bank: "$200k", skip: "$20k", highlight: true },
  { label: "Time to Save", bank: "10 years", skip: "Now", highlight: false },
];

const FIRST_HOME_BUYER_ROWS = [
  {
    label: "Deposit",
    firstHomeBuyer: "5%",
    skip: "2%",
  },
  {
    label: "Flexibility",
    firstHomeBuyer: "Can't convert to investment property",
    skip: "Can do what you want",
  },
  {
    label: "Available to",
    firstHomeBuyer: "Only first home buyers",
    skip: "Everyone",
  },
  {
    label: "Deposit rules",
    firstHomeBuyer: "Must use all your money",
    skip: "No restrictions",
  },
];

const SKIP_CARD_ITEMS = [
  {
    title: "... my own home",
    description: "Stop renting. Start owning. Your first property is within reach with just 2% deposit.",
    imageSrc: "/skip-owning-home.png",
    imageAlt: "Kangaroo relaxing on a couch at home",
    delay: 0.2,
  },
  {
    title: "... a larger place",
    description: "Growing family? Need more space? Upgrade without waiting years to save a huge deposit.",
    imageSrc: "/skip-larger-place.png",
    imageAlt: "Kangaroo mowing the lawn outside a larger home",
    delay: 0.4,
  },
  {
    title: "... an investment property",
    description: "Build your property portfolio. Get into the investment market with minimal upfront capital.",
    imageSrc: "/skip-investment-property.png",
    imageAlt: "Kangaroo on a balcony at sunset representing investment property goals",
    delay: 0.6,
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Apply Online",
    description: "Quick 10-minute application. ",
    delay: 0.1,
  },
  {
    number: "02",
    title: "Get pre-approved",
    description: "Pre-approval within 48 hours.",
    delay: 0.2,
  },
  {
    number: "03",
    title: "Find Property",
    description: "Shop knowing what you can afford.",
    delay: 0.3,
  },
  {
    number: "04",
    title: "Move In",
    description: "Finalise and get the keys.",
    delay: 0.4,
  },
];

const PROCESS_TRUST_CARDS = [
  { title: "Fully Regulated", description: "ASIC licensed Australian lender" },
  { title: "No Hidden Fees", description: "Transparent, upfront pricing" },
  { title: "Local Support", description: "Australian team, always here" },
];

const INCLUDED_WITH_LOAN_ITEMS = [
  "Licensed lender process",
  "Dedicated application specialist",
  "Transparent fees and milestones",
];

const HERO_SOCIAL_PROOF = [
  {
    label: "Customer rating",
    value: "4.8/5",
    detail: "1,200+ reviews",
  },
  {
    label: "Approvals issued",
    value: "$850M+",
    detail: "Nationally settled",
  },
  {
    label: "Families settled",
    value: "3,000+",
    detail: "Across Australia",
  },
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

type PricingMode = "purchase" | "refinance";

interface PricingData {
  title: string;
  subtitle: string;
  effectiveRate: string;
  comparisonRate: string;
}

interface PricingSet {
  purchase: PricingData;
  refinance: PricingData;
}

interface TrustMicrocopyProps {
  className?: string;
  inverse?: boolean;
}

function TrustMicrocopy({ className, inverse = false }: TrustMicrocopyProps) {
  return (
    <p className={cn("text-xs leading-relaxed", inverse ? "text-white/75" : "text-ink/65", className)}>
      {TRUST_MICROCOPY}
    </p>
  );
}

function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 1.08]);

  return (
    <section className="relative flex min-h-screen items-end justify-center overflow-hidden">
      <motion.div style={shouldReduceMotion ? undefined : { scale }} className="absolute inset-0">
        <Image
          src="/hero-kangaroo-wide.png"
          alt="Kangaroo celebrating in front of a sold property sign"
          fill
          priority
          className="object-cover md:object-[center_40%]!"
          style={{ objectPosition: '65% 15%' }}
          // style={{
          //   maskImage:
          //     "linear-gradient(to right, transparent, black 15%, black 85%, transparent), linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          //   maskComposite: "intersect",
          //   WebkitMaskImage:
          //     "linear-gradient(to right, transparent, black 15%, black 85%, transparent), linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          //   WebkitMaskComposite: "destination-in",
          // }}
        />
         {/* <div className="absolute inset-0 bg-black/50" /> */}
        <div className="absolute inset-0 bg-linear-to-b from-black/0 mdvia-black/10 md:to-black/50 via-black/10 to-black/70" />
        <div className="absolute inset-0 bg-linear-to-r md:from-black/50 md:via-black/10 md:to-black/50" />
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(121,200,155,0.2),transparent_38%)]" />

      <motion.div
        style={shouldReduceMotion ? undefined : { opacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-44 md:px-12 md:pb-20 md:pt-52 lg:pb-24 lg:pt-56"
      >
        <div className="max-w-3xl space-y-5 text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: MOTION_EASE }}
            className="space-y-6"
          >
            <SkipToOwningBitHeading
              className="text-5xl tracking-[-0.02em] text-white md:text-6xl lg:text-7xl"
              logoVariant={1}
              textClassName="text-white"
              lineTwo="owning bit."
              priorityLogo
            />
            <p className="text-2xl tracking-tight text-white/95 md:text-3xl lg:text-3xl">
              2% Deposit Home Loans.
            </p>
            <p className="text-lg text-white/70">Same process. Same security. 10x less deposit.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: MOTION_EASE }}
            className="flex flex-col gap-4 pt-2 sm:flex-row"
          >
            <motion.a
              href="#apply"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02, boxShadow: "0 20px 40px rgba(121, 200, 155, 0.4)" }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              className={cn(
                buttonVariants({ variant: "mint", size: "xl" }),
                "group shadow-2xl focus-visible:ring-mint focus-visible:ring-offset-brand",
              )}
            >
              Apply now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.a>
            <motion.a
              href="#calculator"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02, backgroundColor: "rgba(255,255,255,0.2)" }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              className={cn(
                buttonVariants({ variant: "glass", size: "xl" }),
                "border-2 shadow-xl focus-visible:ring-mint focus-visible:ring-offset-brand",
              )}
            >
              Calculate your borrowing
            </motion.a>
          </motion.div>

          {/* <TrustMicrocopy inverse className="max-w-xl" /> */}

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: MOTION_EASE }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Card className="rounded-2xl border-white/20 bg-white/10 px-6 py-4 text-white backdrop-blur-xl">
              <p className="mb-1 text-sm text-white/70">From just</p>
              <p className="text-3xl font-bold text-white">$20k</p>
            </Card>
            <Card className="rounded-2xl border-white/20 bg-white/10 px-6 py-4 text-white backdrop-blur-xl">
              <p className="mb-1 text-sm text-white/70">Can buy</p>
              <p className="text-3xl font-bold text-white">$1M+</p>
            </Card>
          </motion.div> */}

          {/* <div className="grid max-w-3xl gap-3 pt-2 sm:grid-cols-3">
            {HERO_SOCIAL_PROOF.map((proof) => (
              <Card key={proof.label} className="rounded-2xl border-white/20 bg-white/10 p-4 text-white backdrop-blur-xl">
                <div className="mb-1 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-white/70">
                  <Star className="h-3.5 w-3.5 text-mint" />
                  {proof.label}
                </div>
                <p className="text-2xl font-semibold tracking-tight">{proof.value}</p>
                <p className="text-sm text-white/75">{proof.detail}</p>
              </Card>
            ))}
          </div> */}
        </div>
      </motion.div>
    </section>
  );
}

function TrustProofSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-y relative overflow-hidden bg-gradient-to-b from-canvas via-white to-canvas">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(121,200,155,0.16),transparent_40%)]" />

      <div className="section-shell relative grid gap-10 lg:grid-cols-[1fr_0.92fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: MOTION_EASE }}
          className="space-y-7"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: MOTION_EASE }}
          >
            <Badge variant="mint" className="px-5 py-2 text-sm">
              Regulated • Real • Revolutionary
            </Badge>
          </motion.div>
          <div className="space-y-4">
            <h2 className="section-heading max-w-[14ch] text-brand">
              Don&apos;t be constrained by your deposit.
            </h2>
            <p className="measure-copy text-lg leading-relaxed text-ink/65 md:text-xl">
              Skip exists to make it possibe for Austrlaian to buy a home sooner than they think.
              A modern lender who understands the challenges of buying a home in Australia.
            </p>
          </div>

          <div className="space-y-3">
            {TRUST_PILLARS.map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -18 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
              >
                <Card className="border-brand/10 bg-white/85 p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-mint/20 text-brand">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-ink">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink/60">{description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.12, ease: MOTION_EASE }}
          className="relative"
        >
          <Card className="shadow-refined-lg relative overflow-hidden rounded-[2rem] border-brand/15 bg-white p-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.7rem]">
              <Image
                src="/hero-keys-kangaroo.png"
                alt="Kangaroo holding house keys"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand/45 via-transparent to-transparent" />
            </div>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="absolute -bottom-6 -left-4 rounded-2xl border border-mint/35 bg-white/92 px-4 py-3 shadow-xl backdrop-blur-md md:-left-6"
          >
            <p className="text-[11px] uppercase tracking-[0.16em] text-ink/50">Approval pace</p>
            <p className="text-xl font-semibold text-brand">48 hours typical</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.42 }}
            className="absolute -top-6 right-1 rounded-2xl border border-white/30 bg-brand/90 px-4 py-3 text-white shadow-xl backdrop-blur-md md:right-3"
          >
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/65">Deposit</p>
            <p className="text-xl font-semibold">2%</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

interface PricingShowcaseProps {
  id: string;
  heading: string;
  rates: PricingSet;
}

function PricingShowcase({ id, heading, rates }: PricingShowcaseProps) {
  const [mode, setMode] = useState<PricingMode>("purchase");
  const current = rates[mode];

  return (
    <section id={id} className="section-shell section-y">
      <div className="mb-8 text-center">
        <h2 className="section-heading mx-auto max-w-[16ch] text-brand">{heading}</h2>
      </div>

      <div className="mx-auto mb-6 flex w-full max-w-md rounded-full border border-brand/20 bg-white p-1">
        <button
          type="button"
          onClick={() => setMode("purchase")}
          className={cn(
            "w-1/2 rounded-full px-5 py-3 text-sm font-medium transition-colors focus-visible:ring-brand focus-visible:ring-offset-background",
            mode === "purchase" ? "bg-mint/35 text-brand" : "text-ink/65 hover:text-brand",
          )}
        >
          Purchase
        </button>
        <button
          type="button"
          onClick={() => setMode("refinance")}
          className={cn(
            "w-1/2 rounded-full px-5 py-3 text-sm font-medium transition-colors focus-visible:ring-brand focus-visible:ring-offset-background",
            mode === "refinance" ? "bg-mint/35 text-brand" : "text-ink/65 hover:text-brand",
          )}
        >
          Refinance
        </button>
      </div>

      <Card className="mx-auto max-w-[440px] rounded-[2rem] border-mint/45 bg-mint/45 p-6 shadow-[inset_0_-6px_0_0_rgba(31,86,58,0.26)] md:p-8">
        <CardContent className="space-y-5 p-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-5xl leading-none text-ink">{current.title}</h3>
              <p className="mt-2 text-base text-ink/80">{current.subtitle}</p>
            </div>
            <ChevronDown className="mt-1 h-6 w-6 text-brand/80" />
          </div>

          <div className="h-px bg-brand/22" />

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[3.4rem] leading-none tracking-[-0.04em] text-ink">{current.effectiveRate}</p>
              <p className="mt-1 text-sm text-ink/85">% p.a.</p>
              <p className="mt-1 text-[1.02rem] leading-tight text-ink/75">Effective Interest Rate*</p>
            </div>
            <div>
              <p className="text-[3.4rem] leading-none tracking-[-0.04em] text-ink">{current.comparisonRate}</p>
              <p className="mt-1 text-sm text-ink/85">% p.a.</p>
              <p className="mt-1 text-[1.02rem] leading-tight text-ink/75">Comparison Rate**</p>
            </div>
          </div>

          <div className="h-px bg-brand/22" />

          <div className="flex items-center gap-4">
            <Button className="rounded-full px-6" variant="brand">
              Apply now
              <ChevronRight className="h-4 w-4" />
            </Button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-base font-medium text-brand/90 hover:text-brand"
            >
              Eligibility
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* <TrustMicrocopy /> */}
        </CardContent>
      </Card>
    </section>
  );
}

function DepositCalculator() {
  const [deposit, setDeposit] = useState(20000);
  const [isCalculating, setIsCalculating] = useState(false);
  const propertyValue = deposit * 50;
  const stampDuty = propertyValue * 0.04;
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isCalculating) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsCalculating(false);
    }, CALCULATION_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [deposit, isCalculating]);

  const handleDepositChange = (nextValue: number) => {
    setIsCalculating(true);
    setDeposit(nextValue);
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
            className="mb-16 space-y-4 text-center"
          >
            <h2 className="section-heading mx-auto max-w-[20ch] text-brand">You can buy sooner than you think</h2>
            <p className="measure-copy mx-auto text-base text-ink/60 md:text-lg">
              Discover your purchasing power with just 2% deposit
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-5">
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
                    <Slider value={deposit} onChange={handleDepositChange} min={5000} max={100000} step={1000} />
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

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: MOTION_EASE }}
              className="space-y-4 lg:col-span-3"
            >
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
                  <div className="mb-6 flex items-center gap-2">
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

              <div className="grid grid-cols-2 gap-4">
                <Card className="glass shadow-refined rounded-2xl border-ink/10 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint/10">
                      <DollarSign className="h-4 w-4 text-brand" />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wider text-ink/60">Stamp Duty</span>
                  </div>
                  {isCalculating ? (
                    <div className="skeleton h-10 w-24 rounded-lg" aria-hidden />
                  ) : (
                    <div className="text-3xl font-bold tracking-tight text-brand">${(stampDuty / 1000).toFixed(0)}k</div>
                  )}
                  <p className="mt-1 text-xs text-ink/50">Approximate</p>
                </Card>

                <Card className="glass shadow-refined rounded-2xl border-mint/20 bg-gradient-to-br from-mint/5 to-transparent p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint/20">
                      <TrendingUp className="h-4 w-4 text-brand" />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wider text-ink/60">Total Upfront</span>
                  </div>
                  {isCalculating ? (
                    <div className="skeleton h-10 w-24 rounded-lg" aria-hidden />
                  ) : (
                    <div className="text-3xl font-bold tracking-tight text-brand">
                      ${((deposit + stampDuty) / 1000).toFixed(0)}k
                    </div>
                  )}
                  <p className="mt-1 text-xs text-ink/50">You need this much</p>
                </Card>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button className="shadow-refined-lg h-auto rounded-2xl px-8 py-4" size="lg" variant="brand">
                Get Pre-Approved in 48 Hours
              </Button>
            </motion.div>
            {/* <TrustMicrocopy className="mt-4" /> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

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
          className="mb-16 space-y-4 text-center"
        >
          <h2 className="section-heading text-brand">Skip ... the wait</h2>
          <p className="measure-copy mx-auto text-base text-ink/60 md:text-lg">Same security as banks. Better terms for you.</p>
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
                <div className="text-sm font-semibold text-white/90">Traditional Way</div>
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
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
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
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="shadow-refined h-auto w-full rounded-2xl px-6 py-4" variant="brand">
                  Choose Skip - Apply Now
                </Button>
              </motion.div>
              {/* <TrustMicrocopy className="mt-4 text-center" /> */}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <div className="glass shadow-refined inline-flex items-center gap-3 rounded-full border border-mint/20 px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-mint to-mint">
                <TrendingDown className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-ink/60">You save</div>
                <div className="text-lg font-bold text-brand md:text-xl">$180,000 upfront</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FirstHomeBuyerConstraintSection() {
  return (
    <section className="section-y relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(121,200,155,0.14),transparent_42%)]" />
      <div className="section-shell relative">
        <div className="mb-12 space-y-4 text-center md:mb-14">
          <h2 className="section-heading text-brand">
            Skip ... the First Home Buyer Contraint
          </h2>
        </div>

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
                    <dd className="text-base font-medium text-ink/80 md:text-lg">{row.firstHomeBuyer}</dd>
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

function SkipToSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-150px" });

  return (
    <section ref={ref} className="section-y-lg relative overflow-hidden bg-gradient-to-b from-white via-soft/20 to-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-20 h-[600px] w-[600px] rounded-full bg-mint/5 blur-3xl" />
        <div className="absolute bottom-20 left-0 h-[500px] w-[500px] rounded-full bg-brand/5 blur-3xl" />
      </div>

      <div className="section-shell relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: MOTION_EASE }}
          className="mb-20 space-y-4 text-center"
        >
          <h2 className="section-heading text-brand">Skip to...</h2>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {SKIP_CARD_ITEMS.map((card) => (
            <SkipCard
              key={card.title}
              title={card.title}
              description={card.description}
              imageSrc={card.imageSrc}
              imageAlt={card.imageAlt}
              delay={card.delay}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

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
          className="mb-16 space-y-4 text-center"
        >
          <h2 className="section-heading text-brand">How it works</h2>
          <p className="measure-copy mx-auto text-base text-ink md:text-lg">
            Same as a bank - just with better numbers
          </p>
        </motion.div>

        <div className="mx-auto mb-16 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <Step
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              delay={step.delay}
              isInView={isInView}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3"
        >
          {PROCESS_TRUST_CARDS.map((card) => (
            <TrustCard key={card.title} title={card.title} description={card.description} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface SkipCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  delay: number;
  isInView: boolean;
}

function SkipCard({ title, description, imageSrc, imageAlt, delay, isInView }: SkipCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: MOTION_EASE }}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
      className="group rounded-3xl border border-ink/5 bg-white/80 p-6 transition-all duration-300 backdrop-blur-xl md:p-7"
    >
      <h3 className="mb-4 text-xl font-display text-ink transition-colors group-hover:text-brand">{title}</h3>
      {/* <p className="mb-6 leading-relaxed text-ink/70">{description}</p> */}
      <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-2xl border border-brand/10 bg-canvas">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/20 via-transparent to-transparent" />
      </div>
    </motion.div>
  );
}

interface StepProps {
  number: string;
  title: string;
  description: string;
  delay: number;
  isInView: boolean;
}

function Step({ number, title, description, delay, isInView }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: MOTION_EASE }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <Card className="glass shadow-refined h-full rounded-2xl border-ink/10 p-6 transition-all group-hover:border-mint/20 group-hover:shadow-refined-lg">
        <div className="mb-4 text-6xl leading-none font-display text-brand">{number}</div>
        <h3 className="mb-2 text-lg font-semibold text-ink">{title}</h3>
        <p className="leading-relaxed text-ink/60">{description}</p>
      </Card>
    </motion.div>
  );
}

interface TrustCardProps {
  title: string;
  description: string;
}

function TrustCard({ title, description }: TrustCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }}>
      <Card className="glass shadow-refined rounded-2xl border-ink/10 p-6 text-center">
        <div className="mx-auto mb-3 h-2 w-2 rounded-full bg-mint" />
        <h4 className="mb-1 text-lg font-semibold text-ink">{title}</h4>
        <p className="text-ink/60">{description}</p>
      </Card>
    </motion.div>
  );
}

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

function Slider({ value, onChange, min, max, step }: SliderProps) {
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-mint/20 accent-brand"
      aria-label="Deposit amount"
    />
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink/60">{label}</span>
      <span className="font-semibold text-brand">{value}</span>
    </div>
  );
}

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
              <div className="flex gap-3">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="rounded-xl shadow-lg focus-visible:ring-mint focus-visible:ring-offset-brand" size="lg" variant="mint">
                    Apply Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
              {/* <TrustMicrocopy inverse className="max-w-md text-[11px]" /> */}
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">Product</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li>
                  <a href="#calculator" className="rounded-sm transition-colors hover:text-mint">
                    Calculator
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="rounded-sm transition-colors hover:text-mint">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#pricing-home" className="rounded-sm transition-colors hover:text-mint">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#faq" className="rounded-sm transition-colors hover:text-mint">
                    FAQs
                  </a>
                </li>
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
                <li>
                  <a href="#" className="rounded-sm transition-colors hover:text-mint">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="rounded-sm transition-colors hover:text-mint">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="rounded-sm transition-colors hover:text-mint">
                    Disclaimer
                  </a>
                </li>
                <li>
                  <a href="#" className="rounded-sm transition-colors hover:text-mint">
                    Credit Guide
                  </a>
                </li>
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

function ClosingCtaSection() {
  return (
    <section className="section-shell pb-20">
      <Card className="relative overflow-hidden rounded-[2rem] border-brand/20 bg-gradient-to-br from-brand to-brand-dark p-8 text-white shadow-[0_30px_80px_-40px_rgba(31,86,58,0.8)] md:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(121,200,155,0.28),transparent_42%)]" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
          <SkipLogo variant={1} className="h-10 rounded-full md:h-12" />
          <h2 className="section-heading mt-6 max-w-[16ch] text-white">
            Ready to skip to the owning bit.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            2% deposit
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/85">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-mint" />
              10-minute application
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-mint" />
              Conditional response in 48 hours
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-mint" />
              Australian licensed lender
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#apply"
              className={cn(
                buttonVariants({ variant: "mint", size: "lg" }),
                "rounded-full px-8 focus-visible:ring-mint focus-visible:ring-offset-brand",
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
          {/* <TrustMicrocopy inverse className="mt-4 text-center" /> */}
        </div>
      </Card>
    </section>
  );
}

function RooRunnerAutoPreviewSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      setVisible(window.scrollY >= window.innerHeight * 2);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <section id="roo-runner" className="section-shell pb-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge className="mb-3 rounded-full bg-brand/10 text-brand hover:bg-brand/10">Auto Preview</Badge>
        <h2 className="section-heading text-3xl md:text-5xl">Skip Roo Runner</h2>
        <p className="mx-auto mt-3 max-w-[50ch] text-sm leading-relaxed text-brand/70 md:text-base">
          As you scroll, Roo runs and jumps automatically. Tap play to open the full game.
        </p>
      </div>

      <div className="mt-6">
        <SkipRooRunnerScrollPreview />
      </div>

      <div className="mt-6 flex justify-center">
        <a
          href="/game"
          className={cn(
            buttonVariants({ variant: "brand", size: "lg" }),
            "rounded-full px-10",
          )}
        >
          Play
        </a>
      </div>
    </section>
  );
}

function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY >= window.innerHeight);
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
          "w-full rounded-full focus-visible:ring-mint focus-visible:ring-offset-brand",
        )}
      >
        Apply now
        <ArrowRight className="h-4 w-4" />
      </a>
      {/* <TrustMicrocopy inverse className="mt-2 text-center text-[10px] leading-tight" /> */}
    </div>
  );
}

export default function HomePage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-canvas pb-24 text-brand md:pb-0">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }} />
        <header className="fixed inset-x-0 top-0 z-30">
          <div className="mx-auto mt-6 flex w-[92%] max-w-6xl items-center justify-between rounded-full border border-white/30 bg-brand/85 px-6 py-3 text-white shadow-2xl backdrop-blur-md">
            <SkipLogo variant={1} className="h-8 rounded-full" />
            <nav className="hidden items-center gap-7 text-sm md:flex">
              <a href="#how-it-works" className="rounded-sm hover:text-mint">
                How it works
              </a>
              <a href="#benefits" className="rounded-sm hover:text-mint">
                Benefits
              </a>
              <a href="#faq" className="rounded-sm hover:text-mint">
                FAQ
              </a>
            </nav>
            <a
              href="#apply"
              className={cn(
                buttonVariants({ variant: "mint", size: "sm" }),
                "rounded-full focus-visible:ring-mint focus-visible:ring-offset-brand",
              )}
            >
              Start now
            </a>
          </div>
        </header>

      <Hero />
      <TrustProofSection />
      <DepositCalculator />
      <PricingShowcase
        id="pricing-home"
        heading="Skip ... to your own place"
        rates={HOME_PRICING_RATES}
      />
      <PricingShowcase
        id="pricing-investment"
        heading="Skip ... to an investment property"
        rates={INVESTMENT_PRICING_RATES}
      />
      
      <BankComparison />
      <FirstHomeBuyerConstraintSection />
      <SkipToSection />
      <HowItWorksSection />

      <section id="benefits" className="section-shell pb-20">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-[2rem] border-brand bg-brand p-8 text-white md:p-10">
            <p className="mb-2 text-sm uppercase tracking-[0.16em] text-mint/80">Borrowing power</p>
            <h3 className="font-display text-5xl leading-none md:text-6xl">$1,000,000</h3>
            <p className="mt-4 max-w-xl text-white/80">
              With a 2% deposit, the upfront hurdle drops dramatically so your timeline can match your income potential.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-sm text-white/70">Traditional deposit</p>
                <p className="text-3xl font-semibold">$200,000</p>
              </div>
              <div className="rounded-2xl border border-mint/40 bg-mint/20 p-4">
                <p className="text-sm text-white/80">Skip deposit</p>
                <p className="text-3xl font-semibold">$20,000</p>
              </div>
            </div>
          </Card>
          <Card className="rounded-[2rem] border-brand/15 bg-gradient-to-b from-white to-canvas p-8">
            <h3 className="font-display mb-5 text-2xl">Included with every loan</h3>
            <ul className="space-y-4">
              {INCLUDED_WITH_LOAN_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-brand/85">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-brand" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button id="apply" className="mt-8 rounded-full" variant="brand">
              Start my application
              <ArrowRight className="h-4 w-4" />
            </Button>
            {/* <TrustMicrocopy className="mt-3" /> */}
          </Card>
        </div>
      </section>

      <section className="section-shell pb-20">
        <Card className="rounded-[2rem] border-white bg-white p-8 shadow-[0_20px_60px_-32px_rgba(31,86,58,0.45)] md:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand">Customer story</p>
          <blockquote className="max-w-4xl text-2xl leading-relaxed md:text-3xl">
            We thought we were years away from owning. Skip got us in with a small deposit and the process felt as solid
            as any big bank.
          </blockquote>
          <p className="mt-4 text-brand/70">Alicia & Tom, Inner West NSW</p>
        </Card>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-6 pb-24 md:px-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand">FAQ</p>
        <h2 className="section-heading mb-8 max-w-[14ch]">Questions, answered.</h2>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-brand/15 bg-white p-6 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="cursor-pointer list-none rounded-md text-xl font-semibold">{item.question}</summary>
              <p className="mt-3 leading-relaxed text-brand/75">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <RooRunnerAutoPreviewSection />
      <ClosingCtaSection />
      <FooterSection />
      <MobileStickyCta />
      </main>
    </MotionConfig>
  );
}
