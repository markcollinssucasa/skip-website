"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Landmark,
  Lock,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";

import { SkipLogo } from "@/components/brand/skip-logo";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Calculator", href: "#calculator" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Stories", href: "#stories" },
  { label: "FAQ", href: "#faq" },
];

const HERO_SIGNALS = [
  { value: "2%", label: "Deposit to start" },
  { value: "48 hrs", label: "Typical response" },
  { value: "$850M+", label: "Settled nationally" },
];

const VALUE_CARDS = [
  {
    icon: Landmark,
    title: "Bank-grade lending process",
    copy: "Structured credit checks, regulated documentation, and full legal protections from start to settlement.",
  },
  {
    icon: Clock3,
    title: "Built for speed without shortcuts",
    copy: "Digital-first workflow with specialist guidance, so serious buyers can move before the next price cycle.",
  },
  {
    icon: Lock,
    title: "Security and privacy first",
    copy: "Sensitive financial documents are handled with strict controls and clear audit trails at every step.",
  },
];

const JOURNEYS = [
  {
    title: "First home, faster",
    description: "Stop paying someone else's mortgage and redirect momentum into your own equity.",
    imageSrc: "/skip-owning-home.png",
    imageAlt: "Kangaroo relaxing in a newly owned home",
  },
  {
    title: "Upgrade when life changes",
    description: "More space, better location, and less waiting for the perfect moment that never arrives.",
    imageSrc: "/skip-larger-place.png",
    imageAlt: "Kangaroo in front of a larger house",
  },
  {
    title: "Enter with an investment strategy",
    description: "Deploy capital earlier and keep optionality while building your long-term property portfolio.",
    imageSrc: "/skip-investment-property.png",
    imageAlt: "Kangaroo overlooking an investment property at sunset",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Check your borrowing path",
    description: "Run your numbers quickly with a specialist-backed strategy for deposit, repayments, and timing.",
  },
  {
    number: "02",
    title: "Submit your application",
    description: "Complete your online application and upload documents securely in one guided flow.",
  },
  {
    number: "03",
    title: "Get decision-ready",
    description: "Receive outcome direction and confidently shop properties within your approved budget.",
  },
  {
    number: "04",
    title: "Settle and move",
    description: "Execute finance, complete settlement, and step into ownership with a clear next milestone.",
  },
];

const STORIES = [
  {
    quote:
      "We were planning to wait another four years. Skip changed our timeline and we purchased in six months.",
    name: "Mia & Jordan",
    location: "Melbourne VIC",
  },
  {
    quote:
      "Felt like a modern private-banking experience: clear, fast, and brutally practical about what mattered.",
    name: "Amir K.",
    location: "Sydney NSW",
  },
  {
    quote:
      "The numbers were transparent from day one. No theatre, no surprises, just a path that actually worked.",
    name: "Sophie L.",
    location: "Brisbane QLD",
  },
];

const FAQS = [
  {
    question: "Is this a regulated home loan?",
    answer:
      "Yes. Skip follows standard lending checks, legal documentation, and compliance controls expected of Australian home lending.",
  },
  {
    question: "Who is this best for?",
    answer:
      "Buyers with solid income who can service a mortgage but are blocked by the traditional 20% deposit hurdle.",
  },
  {
    question: "How quickly can I get started?",
    answer:
      "You can begin online in minutes. Most eligible applications receive specialist direction within a typical 48-hour window.",
  },
  {
    question: "Can I refinance later?",
    answer:
      "Yes. As equity builds, you can refinance to a lower rate profile, similar to other standard home loan pathways.",
  },
];

const MARQUEE_ITEMS = [
  "2% deposit structure",
  "Standard lending checks",
  "Transparent rates",
  "Specialist support",
  "48 hour typical response",
  "Privacy-first data handling",
];

type ProductMode = "ownerOccupied" | "investment";

const RATE_SET: Record<ProductMode, { rate: string; comparison: string; caption: string }> = {
  ownerOccupied: {
    rate: "6.30%",
    comparison: "6.63%",
    caption: "Owner Occupied · New purchase",
  },
  investment: {
    rate: "6.65%",
    comparison: "6.95%",
    caption: "Investment · New purchase",
  },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Option12Page() {
  const reduceMotion = useReducedMotion();
  const [price, setPrice] = useState(900000);
  const [monthlySave, setMonthlySave] = useState(3400);
  const [product, setProduct] = useState<ProductMode>("ownerOccupied");
  const [activeFaq, setActiveFaq] = useState(0);

  const numbers = useMemo(() => {
    const bankDeposit = price * 0.2;
    const skipDeposit = price * 0.02;
    const capitalGap = bankDeposit - skipDeposit;
    const monthsToBridge = Math.max(1, Math.round(capitalGap / monthlySave));
    const yearsToBridge = monthsToBridge / 12;

    return {
      bankDeposit,
      skipDeposit,
      capitalGap,
      monthsToBridge,
      yearsToBridge,
    };
  }, [monthlySave, price]);

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative overflow-x-clip bg-canvas text-ink">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="hero-orb hero-orb-a absolute left-[-14rem] top-20 h-[28rem] w-[28rem] rounded-full bg-mint/35 blur-3xl" />
          <div className="hero-orb hero-orb-b absolute right-[-16rem] top-[-4rem] h-[36rem] w-[36rem] rounded-full bg-brand/14 blur-3xl" />
          <div className="hero-orb hero-orb-c absolute right-[14%] top-[26rem] h-72 w-72 rounded-full bg-white/70 blur-3xl" />
        </div>

        <header className="sticky top-0 z-40 border-b border-brand/10 bg-canvas/75 backdrop-blur-xl">
          <div className="section-shell flex h-20 items-center justify-between gap-6">
            <Link href="/option12" className="text-[2rem] leading-none text-brand" aria-label="Skip option twelve home">
              <SkipLogo variant={4} priority />
            </Link>

            <nav className="hidden items-center gap-7 text-sm font-medium text-brand/75 lg:flex">
              {NAV_ITEMS.map((item) => (
                <a key={item.href} href={item.href} className="transition-colors hover:text-brand">
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="#calculator"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "hidden border-brand/20 bg-white/70 text-brand md:inline-flex",
                )}
              >
                Run numbers
              </a>
              <a href="#calculator" className={buttonVariants({ variant: "brand", size: "sm" })}>
                Start now
              </a>
            </div>
          </div>
        </header>

        <section className="section-shell section-y-lg relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.06fr_0.94fr]">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <p className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-white/75 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brand/80 shadow-refined">
                <Sparkles className="size-3.5" aria-hidden />
                2% Deposit Home Loans
              </p>

              <div className="space-y-5">
                <h1 className="font-display text-[2.9rem] leading-[0.96] tracking-[-0.03em] text-brand sm:text-[4.3rem] lg:text-[5.3rem]">
                  Move from waiting
                  <br />
                  to owning.
                </h1>
                <p className="measure-copy text-base text-brand/80 sm:text-lg">
                  Same lending discipline. Dramatically less upfront friction. Skip helps serious buyers enter sooner with
                  a clean, transparent path to settlement.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a href="#calculator" className={buttonVariants({ variant: "brand", size: "xl" })}>
                  Check eligibility
                  <ArrowRight className="size-4" aria-hidden />
                </a>
                <a
                  href="#stories"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "xl" }),
                    "border-brand/18 bg-white/75 text-brand hover:bg-white",
                  )}
                >
                  See real outcomes
                </a>
              </div>

              <p className="text-xs tracking-wide text-brand/70">
                ACL XXXXXX · 48 hours typical response · Privacy-first data handling
              </p>

              <ul className="grid gap-3 sm:grid-cols-3">
                {HERO_SIGNALS.map((item) => (
                  <li key={item.label} className="rounded-2xl border border-brand/12 bg-white/78 px-4 py-4 shadow-refined">
                    <p className="font-display text-3xl tracking-tight text-brand">{item.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-brand/65">{item.label}</p>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
              className="relative"
            >
              <div className="absolute -inset-2 rounded-[2.1rem] bg-gradient-to-br from-mint/35 via-white/75 to-brand/12 blur-sm" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-3 shadow-refined-lg backdrop-blur-md">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem]">
                  <Image
                    src="/hero-keys-kangaroo.png"
                    alt="Skip mascot holding keys outside a home"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1023px) 100vw, 42vw"
                  />
                  <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/58 via-black/10 to-transparent" />

                  <motion.div
                    initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.55 }}
                    className="absolute left-4 top-4 rounded-2xl border border-white/40 bg-black/36 px-4 py-3 text-white backdrop-blur-md"
                  >
                    <p className="text-[0.66rem] uppercase tracking-[0.15em] text-white/75">Upfront deposit</p>
                    <p className="font-display text-3xl leading-none">2%</p>
                  </motion.div>

                  <motion.div
                    initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ delay: 0.32, duration: 0.55 }}
                    className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-white backdrop-blur-lg"
                  >
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.12em] text-white/80">
                      <span>Typical response</span>
                      <span>48 hrs</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/25">
                      <div className="h-full w-3/4 rounded-full bg-mint animate-pulse" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative py-5">
          <div className="marquee-wrap overflow-hidden border-y border-brand/10 bg-brand text-white">
            <div className="marquee-track flex min-w-max items-center gap-8 px-8 py-3">
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
                <div key={`${item}-${idx}`} className="flex items-center gap-2 text-sm tracking-wide text-white/95">
                  <CheckCircle2 className="size-4 text-mint" aria-hidden />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="calculator" className="section-shell section-y">
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <Card className="overflow-hidden rounded-[2rem] border-brand/12 bg-white/80 shadow-refined-lg">
              <CardContent className="space-y-8 p-7 sm:p-9">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.14em] text-brand/65">Deposit strategy calculator</p>
                    <h2 className="font-display text-4xl leading-[0.95] tracking-tight text-brand sm:text-5xl">
                      See the
                      <br />
                      difference in real dollars.
                    </h2>
                  </div>
                  <div className="inline-flex rounded-full border border-brand/12 bg-brand/5 p-1 text-sm">
                    <button
                      type="button"
                      onClick={() => setProduct("ownerOccupied")}
                      className={cn(
                        "rounded-full px-4 py-1.5 transition-colors",
                        product === "ownerOccupied" ? "bg-brand text-white" : "text-brand/80",
                      )}
                    >
                      Owner Occupied
                    </button>
                    <button
                      type="button"
                      onClick={() => setProduct("investment")}
                      className={cn(
                        "rounded-full px-4 py-1.5 transition-colors",
                        product === "investment" ? "bg-brand text-white" : "text-brand/80",
                      )}
                    >
                      Investment
                    </button>
                  </div>
                </div>

                <div className="grid gap-6">
                  <label className="grid gap-2">
                    <div className="flex items-center justify-between text-sm text-brand/75">
                      <span>Target property price</span>
                      <span className="font-semibold text-brand">{formatCurrency(price)}</span>
                    </div>
                    <input
                      type="range"
                      min={450000}
                      max={2000000}
                      step={10000}
                      value={price}
                      onChange={(event) => setPrice(Number(event.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-brand/15 accent-brand"
                    />
                  </label>

                  <label className="grid gap-2">
                    <div className="flex items-center justify-between text-sm text-brand/75">
                      <span>How much you can save monthly</span>
                      <span className="font-semibold text-brand">{formatCurrency(monthlySave)}</span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={12000}
                      step={100}
                      value={monthlySave}
                      onChange={(event) => setMonthlySave(Number(event.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-brand/15 accent-brand"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-brand/12 bg-brand/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-brand/65">Traditional 20%</p>
                    <p className="mt-2 font-display text-3xl text-brand">{formatCurrency(numbers.bankDeposit)}</p>
                  </div>
                  <div className="rounded-2xl border border-brand/12 bg-mint/15 p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-brand/65">Skip 2%</p>
                    <p className="mt-2 font-display text-3xl text-brand">{formatCurrency(numbers.skipDeposit)}</p>
                  </div>
                  <div className="rounded-2xl border border-brand/12 bg-brand p-4 text-white">
                    <p className="text-xs uppercase tracking-[0.12em] text-white/70">Capital freed up</p>
                    <p className="mt-2 font-display text-3xl">{formatCurrency(numbers.capitalGap)}</p>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-brand/12 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-brand/75">Estimated wait to bridge the deposit gap</p>
                    <p className="font-display text-2xl text-brand">{numbers.yearsToBridge.toFixed(1)} years</p>
                  </div>
                  <div className="h-2 rounded-full bg-brand/10">
                    <div
                      className="h-full rounded-full bg-brand transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (numbers.yearsToBridge / 10) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-sm text-brand/65">
                    At your current savings pace, that is roughly {numbers.monthsToBridge} months of waiting that Skip can
                    potentially remove from the timeline.
                  </p>
                </div>

                <div className="rounded-2xl border border-brand/10 bg-brand-dark px-5 py-4 text-white">
                  <p className="text-xs uppercase tracking-[0.13em] text-white/70">{RATE_SET[product].caption}</p>
                  <div className="mt-2 flex flex-wrap items-end gap-4">
                    <p className="font-display text-4xl leading-none">{RATE_SET[product].rate}</p>
                    <p className="pb-1 text-sm text-white/78">comparison {RATE_SET[product].comparison}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-5">
              {VALUE_CARDS.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                >
                  <Card className="h-full rounded-[1.6rem] border-brand/12 bg-white/80 shadow-refined">
                    <CardContent className="space-y-4 p-6">
                      <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-brand text-white">
                        <item.icon className="size-5" aria-hidden />
                      </span>
                      <h3 className="font-display text-[1.75rem] leading-[0.98] tracking-tight text-brand">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-brand/75">{item.copy}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <Card className="rounded-[1.6rem] border-brand/15 bg-gradient-to-br from-brand to-brand-dark text-white shadow-refined-lg">
                <CardContent className="space-y-4 p-6">
                  <p className="text-xs uppercase tracking-[0.13em] text-white/70">Conversion lens</p>
                  <h3 className="font-display text-3xl leading-[0.95]">The page leads with confidence, not complexity.</h3>
                  <p className="text-sm text-white/85">
                    Strong headline clarity, immediate payoff math, visible trust markers, and repeated action points are
                    arranged to reduce hesitation at each scroll depth.
                  </p>
                  <a href="#calculator" className={cn(buttonVariants({ variant: "mint", size: "lg" }), "w-full sm:w-auto")}>
                    Start your application
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="section-shell section-y" id="how-it-works">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.15em] text-brand/60">Designed around momentum</p>
              <h2 className="font-display text-4xl tracking-tight text-brand sm:text-5xl">A cleaner path to keys.</h2>
            </div>
            <p className="max-w-xl text-sm text-brand/72">
              Conversion-focused sequencing: clarity first, numbers second, process confidence third, then social proof and
              immediate CTA.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {PROCESS_STEPS.map((step, index) => (
              <motion.div
                key={step.number}
                initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="h-full rounded-[1.35rem] border-brand/12 bg-white/80 shadow-refined">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-display text-4xl text-brand/30">{step.number}</span>
                      <TrendingUp className="size-5 text-brand/35" aria-hidden />
                    </div>
                    <h3 className="font-display text-3xl leading-[0.96] tracking-tight text-brand">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand/72">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="stories" className="section-shell section-y">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-brand/60">Image-first conversion stories</p>
              <h2 className="font-display text-4xl tracking-tight text-brand sm:text-5xl">Choose your ownership move.</h2>
            </div>
            <p className="max-w-xl text-sm text-brand/72">
              Image treatment is intentional: lifestyle framing first, offer context second, CTA always visible on card exit.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {JOURNEYS.map((item, index) => (
              <motion.article
                key={item.title}
                initial={reduceMotion ? undefined : { opacity: 0, y: 22 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.58, delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-[1.8rem] border border-brand/12 bg-white/80 shadow-refined-lg"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    className="object-cover object-center transition duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 1023px) 100vw, 33vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 space-y-3 text-white">
                    <h3 className="font-display text-3xl leading-[0.92]">{item.title}</h3>
                    <p className="text-sm text-white/86">{item.description}</p>
                    <a
                      href="#calculator"
                      className={cn(
                        buttonVariants({ variant: "mint", size: "sm" }),
                        "w-full justify-center rounded-full bg-mint text-brand sm:w-auto",
                      )}
                    >
                      Explore this path
                      <ArrowRight className="size-4" aria-hidden />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section-shell section-y">
          <div className="grid gap-5 lg:grid-cols-3">
            {STORIES.map((story, index) => (
              <motion.div
                key={story.name}
                initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <Card className="h-full rounded-[1.4rem] border-brand/12 bg-white/80 shadow-refined">
                  <CardContent className="flex h-full flex-col gap-4 p-6">
                    <div className="flex gap-1 text-mint">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <span key={starIdx} aria-hidden>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-base leading-relaxed text-brand/80">"{story.quote}"</p>
                    <div className="mt-auto border-t border-brand/10 pt-4">
                      <p className="font-semibold text-brand">{story.name}</p>
                      <p className="text-sm text-brand/60">{story.location}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="faq" className="section-shell section-y">
          <Card className="rounded-[2rem] border-brand/12 bg-white/80 shadow-refined-lg">
            <CardContent className="p-7 sm:p-10">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.14em] text-brand/62">FAQ</p>
                  <h2 className="font-display text-4xl tracking-tight text-brand sm:text-5xl">
                    Answers without friction.
                  </h2>
                </div>
                <p className="max-w-md text-sm text-brand/70">
                  Clear responses for risk, timeline, and process confidence. The goal is simple: remove hesitation before
                  it starts.
                </p>
              </div>

              <div className="grid gap-3">
                {FAQS.map((faq, index) => {
                  const open = activeFaq === index;
                  return (
                    <article key={faq.question} className="overflow-hidden rounded-2xl border border-brand/12 bg-white">
                      <button
                        type="button"
                        onClick={() => setActiveFaq(open ? -1 : index)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        aria-expanded={open}
                      >
                        <span className="font-medium text-brand">{faq.question}</span>
                        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="size-4 text-brand/65" aria-hidden />
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                            animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
                            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <p className="px-5 pb-5 text-sm leading-relaxed text-brand/74">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </article>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="section-shell pb-28 pt-12 md:pb-16">
          <div className="rounded-[2rem] border border-brand/15 bg-brand px-6 py-10 text-white shadow-refined-lg sm:px-10">
            <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div className="space-y-4">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.14em]">
                  <Users className="size-3.5" aria-hidden />
                  Ready when you are
                </p>
                <h2 className="font-display text-[2.5rem] leading-[0.92] tracking-tight sm:text-[3.3rem]">
                  Build your ownership plan
                  <br />
                  this week.
                </h2>
                <p className="max-w-lg text-sm text-white/82">
                  If the goal is momentum, your next step is simple: run your scenario and get a clear lending path.
                </p>
              </div>

              <div className="space-y-4">
                <a href="#calculator" className={cn(buttonVariants({ variant: "mint", size: "xl" }), "w-full sm:w-auto")}>
                  Start with your numbers
                  <ArrowRight className="size-4" aria-hidden />
                </a>
                <p className="text-xs tracking-wide text-white/72">
                  ACL XXXXXX · 48 hours typical response · Privacy-first data handling
                </p>
              </div>
            </div>
          </div>
        </footer>

        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-brand/12 bg-white/92 p-3 backdrop-blur-xl md:hidden">
          <a href="#calculator" className={cn(buttonVariants({ variant: "brand", size: "lg" }), "w-full")}>
            Start your 2% application
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </div>
      </main>

      <style jsx>{`
        .hero-orb {
          animation: floatY 14s ease-in-out infinite;
        }
        .hero-orb-b {
          animation-duration: 19s;
          animation-delay: -4s;
        }
        .hero-orb-c {
          animation-duration: 16s;
          animation-delay: -7s;
        }
        .marquee-wrap .marquee-track {
          animation: ticker 28s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-orb,
          .marquee-wrap .marquee-track {
            animation: none !important;
          }
        }
        @keyframes floatY {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-18px);
          }
        }
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </MotionConfig>
  );
}
