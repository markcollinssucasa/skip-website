import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Landmark,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { SkipLogo } from "@/components/brand/skip-logo";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const HERO_STATS = [
  { label: "Starting deposit", value: "2%" },
  { label: "Typical response", value: "48 hours" },
  { label: "Settlements delivered", value: "$850M+" },
];

const RATE_CARDS = [
  {
    label: "Owner Occupied · New purchase",
    effectiveRate: "6.30%",
    comparisonRate: "6.63% comparison rate",
  },
  {
    label: "Owner Occupied · Refinance",
    effectiveRate: "6.12%",
    comparisonRate: "6.44% comparison rate",
  },
  {
    label: "Investor · New purchase",
    effectiveRate: "6.65%",
    comparisonRate: "6.95% comparison rate",
  },
  {
    label: "Investor · Refinance",
    effectiveRate: "6.49%",
    comparisonRate: "6.82% comparison rate",
  },
];

const VALUE_PILLARS = [
  {
    icon: Landmark,
    title: "Bank-grade lending process",
    copy: "Structured credit assessment, clear milestones, and full legal protections.",
  },
  {
    icon: LockKeyhole,
    title: "Security and compliance first",
    copy: "Your application and documents are handled with strict privacy controls.",
  },
  {
    icon: TrendingUp,
    title: "Move faster with less friction",
    copy: "Get decision-ready quickly so you can shop with confidence.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Check eligibility",
    copy: "Run a quick fit check to see your borrowing path before you commit.",
  },
  {
    number: "02",
    title: "Submit application",
    copy: "Complete your online application in minutes with guided support.",
  },
  {
    number: "03",
    title: "Get assessed",
    copy: "A lending specialist validates your details and confirms your numbers.",
  },
  {
    number: "04",
    title: "Settle and move",
    copy: "Close on your property and track your next equity milestone.",
  },
];

const JOURNEYS = [
  {
    title: "Own your first home",
    copy: "Break the rent cycle and step into ownership with a smaller upfront hurdle.",
    image: "/skip-owning-home.png",
    imageAlt: "Kangaroo relaxing inside a new home",
  },
  {
    title: "Upgrade for more space",
    copy: "Move into the home your family needs without waiting years to save.",
    image: "/skip-larger-place.png",
    imageAlt: "Kangaroo looking at a larger house",
  },
  {
    title: "Build an investment strategy",
    copy: "Start or expand your portfolio with a funding model built for momentum.",
    image: "/skip-investment-property.png",
    imageAlt: "Kangaroo at an investment property",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We assumed we needed years more saving. Skip gave us a clear plan and we purchased within months.",
    author: "Mia & Jordan, Melbourne",
  },
  {
    quote:
      "The process felt like a modern bank experience, but far more transparent and human from day one.",
    author: "Amir, Sydney",
  },
  {
    quote:
      "Fast response times, realistic numbers, and no confusing surprises. Exactly what we needed.",
    author: "Sophie, Brisbane",
  },
];

const FAQS = [
  {
    question: "Is this a regulated home loan product?",
    answer:
      "Yes. Skip follows standard regulated lending checks, documentation, and legal settlement requirements.",
  },
  {
    question: "Who is this most useful for?",
    answer:
      "First-home buyers, upgraders, and borrowers with strong income who are blocked by large deposit expectations.",
  },
  {
    question: "How quickly can I get started?",
    answer:
      "You can start online right away. Most applicants receive initial direction within a typical 48-hour window.",
  },
  {
    question: "Can I speak to a specialist before applying?",
    answer:
      "Yes. You can speak with a lending specialist to review your position and next-best steps before submission.",
  },
];

export default function OptionOnePage() {
  return (
    <main className="relative overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-mint/25 blur-3xl" />
        <div className="absolute right-0 top-0 h-[28rem] w-[28rem] rounded-full bg-brand/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-brand/10 bg-canvas/85 backdrop-blur-xl">
        <div className="section-shell flex h-20 items-center justify-between">
          <Link href="/option1" className="inline-flex items-center gap-2 text-brand" aria-label="Skip home">
            <SkipLogo variant={4} className="h-7" priority />
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-ink/70 lg:flex">
            <a className="transition-colors hover:text-brand" href="#rates">
              Rates
            </a>
            <a className="transition-colors hover:text-brand" href="#why-skip">
              Why Skip
            </a>
            <a className="transition-colors hover:text-brand" href="#process">
              Process
            </a>
            <a className="transition-colors hover:text-brand" href="#faq">
              FAQs
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden md:inline-flex")} href="#faq">
              Speak to us
            </a>
            <a className={cn(buttonVariants({ variant: "mint", size: "sm" }), "gap-1.5")} href="#apply">
              Apply
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <section className="section-shell section-y-lg relative grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-end">
        <div className="space-y-8">
          <Badge variant="mint" className="w-fit px-4 py-1.5 text-[11px] uppercase tracking-[0.16em]">
            2% Deposit Home Loans · Australia
          </Badge>

          <div className="space-y-5">
            <h1 className="font-display text-5xl leading-[0.93] tracking-[-0.02em] text-brand md:text-6xl lg:text-7xl">
              Own sooner with a sharper lending experience.
            </h1>
            <p className="measure-copy text-lg leading-relaxed text-ink/68 md:text-xl">
              Skip combines a disciplined, bank-style process with a modern deposit model. Keep momentum, unlock your
              next property move, and do it with confidence.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a className={cn(buttonVariants({ variant: "brand", size: "xl" }), "group")} href="#apply">
              Start your application
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a className={cn(buttonVariants({ variant: "outline", size: "xl" }), "bg-white/70")} href="#rates">
              See current rates
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {HERO_STATS.map((stat) => (
              <Card key={stat.label} className="border-brand/10 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-ink/55">{stat.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-brand">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="shadow-refined-lg overflow-hidden rounded-4xl border-brand/15 bg-white/92 p-3">
          <div className="relative aspect-[5/6] overflow-hidden rounded-[1.7rem]">
            <Image
              src="/hero-kangaroo.png"
              alt="Skip customer success visual"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand/70 via-brand/10 to-transparent" />

            <div className="absolute left-4 right-4 top-4 flex items-center justify-between rounded-2xl border border-white/30 bg-white/20 px-3 py-2 text-white backdrop-blur-lg">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/80">Deposit benchmark</p>
                <p className="text-sm font-semibold">2% vs traditional 20%</p>
              </div>
              <Sparkles className="h-4 w-4 text-mint" />
            </div>

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/25 bg-brand/45 p-4 text-white backdrop-blur-lg">
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/80">Track record</p>
              <p className="mt-1 text-2xl font-semibold">$850M+ settled</p>
              <p className="text-sm text-white/80">Supporting Australian buyers across major cities.</p>
            </div>
          </div>

          <div className="grid gap-2.5 p-4 sm:grid-cols-3">
            {[
              "Dedicated lending specialist",
              "Transparent fee checkpoints",
              "Settlement support end-to-end",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-brand/10 bg-canvas/75 px-3 py-2">
                <div className="mb-1 inline-flex items-center gap-1.5 text-brand">
                  <Check className="h-3.5 w-3.5" />
                  <span className="text-[11px] uppercase tracking-[0.14em]">Included</span>
                </div>
                <p className="text-sm leading-snug text-ink/72">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="section-shell pb-10 md:pb-14">
        <Card className="overflow-hidden rounded-3xl border-brand/12 bg-white/75">
          <CardContent className="grid gap-4 p-6 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
            <div className="space-y-1 lg:col-span-1">
              <p className="text-xs uppercase tracking-[0.14em] text-ink/55">Trust signals</p>
              <p className="text-xl font-semibold text-brand">Licensed Australian lender</p>
            </div>
            <div className="rounded-2xl border border-brand/10 bg-canvas/70 p-4">
              <Clock3 className="mb-2 h-4 w-4 text-brand" />
              <p className="text-sm font-medium text-ink">48-hour typical response</p>
            </div>
            <div className="rounded-2xl border border-brand/10 bg-canvas/70 p-4">
              <ShieldCheck className="mb-2 h-4 w-4 text-brand" />
              <p className="text-sm font-medium text-ink">Privacy-first security controls</p>
            </div>
            <div className="rounded-2xl border border-brand/10 bg-canvas/70 p-4">
              <TrendingUp className="mb-2 h-4 w-4 text-brand" />
              <p className="text-sm font-medium text-ink">3,000+ families supported</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="rates" className="section-shell section-y border-y border-brand/8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <Badge variant="mint" className="w-fit px-4 py-1.5 text-[11px] uppercase tracking-[0.16em]">
              Rates snapshot
            </Badge>
            <h2 className="section-heading max-w-[12ch] text-brand">Simple products. Clear pricing.</h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-ink/65">
            Compare owner-occupied and investor options in one place. We show effective and comparison rates clearly,
            so decisions are easier.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {RATE_CARDS.map((rate) => (
            <Card key={rate.label} className="group rounded-3xl border-brand/12 bg-white transition-all hover:-translate-y-0.5 hover:border-brand/25">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-ink/55">{rate.label}</p>
                <p className="mt-4 text-4xl font-semibold leading-none tracking-tight text-brand">{rate.effectiveRate}</p>
                <p className="mt-2 text-sm text-ink/62">{rate.comparisonRate}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-4 text-xs text-ink/55">
          Rates are indicative and subject to borrower profile, loan details, and standard approval criteria.
        </p>
      </section>

      <section id="why-skip" className="section-shell section-y">
        <Card className="shadow-refined-lg overflow-hidden rounded-[2rem] border-0 bg-brand text-white">
          <CardContent className="grid gap-10 p-8 md:p-10 lg:grid-cols-[0.94fr_1.06fr]">
            <div className="space-y-5">
              <Badge variant="glass" className="w-fit border-white/20">
                Why borrowers choose Skip
              </Badge>
              <h2 className="section-heading max-w-[11ch] text-white">Built for speed, clarity, and control.</h2>
              <p className="text-base leading-relaxed text-white/80">
                A modern lending interface, human specialist guidance, and transparent checkpoints from first enquiry
                to settlement.
              </p>
              <a className={cn(buttonVariants({ variant: "mint", size: "lg" }), "w-fit")} href="#apply">
                Compare your options
              </a>
            </div>

            <div className="grid gap-3">
              {VALUE_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="rounded-2xl border border-white/16 bg-white/10 p-4 backdrop-blur-md md:p-5"
                  >
                    <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/14 text-mint">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-semibold">{pillar.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/82">{pillar.copy}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="process" className="section-shell section-y border-y border-brand/8">
        <div className="space-y-3">
          <Badge variant="mint" className="w-fit px-4 py-1.5 text-[11px] uppercase tracking-[0.16em]">
            How it works
          </Badge>
          <h2 className="section-heading max-w-[13ch] text-brand">Four steps from enquiry to keys.</h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step) => (
            <Card key={step.number} className="rounded-3xl border-brand/12 bg-white">
              <CardContent className="p-5">
                <div className="mb-4 inline-flex rounded-full border border-brand/20 bg-canvas px-3 py-1 text-xs font-semibold tracking-[0.12em] text-brand">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-brand">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{step.copy}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-shell section-y">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <Badge variant="mint" className="w-fit px-4 py-1.5 text-[11px] uppercase tracking-[0.16em]">
              Your next move
            </Badge>
            <h2 className="section-heading text-brand">Choose the journey you want to unlock.</h2>
          </div>
          <a className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand" href="#apply">
            Start with a quick fit check
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {JOURNEYS.map((journey) => (
            <Card key={journey.title} className="overflow-hidden rounded-3xl border-brand/12 bg-white">
              <div className="relative aspect-[4/3]">
                <Image src={journey.image} alt={journey.imageAlt} fill className="object-cover" />
              </div>
              <CardContent className="space-y-2 p-5">
                <h3 className="text-xl font-semibold text-brand">{journey.title}</h3>
                <p className="text-sm leading-relaxed text-ink/65">{journey.copy}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="faq" className="section-shell section-y border-t border-brand/8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <Badge variant="mint" className="w-fit px-4 py-1.5 text-[11px] uppercase tracking-[0.16em]">
              Customer confidence
            </Badge>
            <h2 className="section-heading max-w-[11ch] text-brand">Borrowers tell us the process feels clear.</h2>

            <div className="grid gap-3">
              {TESTIMONIALS.map((testimonial) => (
                <Card key={testimonial.author} className="rounded-2xl border-brand/12 bg-white">
                  <CardContent className="p-5">
                    <p className="text-sm leading-relaxed text-ink/75">&ldquo;{testimonial.quote}&rdquo;</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand/75">
                      {testimonial.author}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Badge variant="outline" className="w-fit border-brand/20 bg-white/70 px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-brand">
              FAQs
            </Badge>
            <h3 className="font-display text-4xl leading-tight tracking-tight text-brand md:text-5xl">
              Answers before you commit.
            </h3>

            <div className="space-y-3">
              {FAQS.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-brand/12 bg-white p-4 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-brand">
                    {item.question}
                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 pr-6 text-sm leading-relaxed text-ink/67">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="apply" className="section-shell pb-16 md:pb-20">
        <Card className="relative overflow-hidden rounded-[2rem] border-0 bg-gradient-to-r from-brand to-brand-mid text-white">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-mint/25 blur-3xl" />
          <CardContent className="relative flex flex-col gap-7 p-8 md:p-11 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Badge variant="glass" className="w-fit">
                Next step
              </Badge>
              <h2 className="section-heading max-w-[13ch] text-white">Ready to skip the long wait to ownership?</h2>
              <p className="max-w-2xl text-base leading-relaxed text-white/80">
                Start with an eligibility check and get practical guidance on your borrowing pathway.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a className={cn(buttonVariants({ variant: "mint", size: "xl" }), "whitespace-nowrap")} href="#">
                Apply now
              </a>
              <a className={cn(buttonVariants({ variant: "glass", size: "xl" }), "whitespace-nowrap")} href="#faq">
                Book a callback
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-brand/10 bg-white/75">
        <div className="section-shell grid gap-10 py-12 lg:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div className="space-y-3">
            <SkipLogo variant={4} className="h-8" />
            <p className="max-w-sm text-sm leading-relaxed text-ink/65">
              A modern Australian lender helping more people move from renting and waiting to owning and building
              equity.
            </p>
          </div>

          <div className="space-y-2 text-sm text-ink/70">
            <p className="font-semibold text-brand">Product</p>
            <p>Home loans</p>
            <p>Refinance</p>
            <p>Investment</p>
          </div>

          <div className="space-y-2 text-sm text-ink/70">
            <p className="font-semibold text-brand">Company</p>
            <p>How it works</p>
            <p>Security</p>
            <p>Support</p>
          </div>

          <div className="space-y-2 text-sm text-ink/70">
            <p className="font-semibold text-brand">Legal</p>
            <p>Privacy policy</p>
            <p>Terms</p>
            <p>Credit guide</p>
          </div>
        </div>

        <div className="section-shell border-t border-brand/10 py-5 text-xs text-ink/55">
          © {new Date().getFullYear()} Skip Financial. ACL XXXXXX. General information only; not personal credit
          advice.
        </div>
      </footer>
    </main>
  );
}
