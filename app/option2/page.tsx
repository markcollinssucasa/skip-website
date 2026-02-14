import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeDollarSign, CheckCircle2, ChevronRight, Clock3, ShieldCheck } from "lucide-react";

import { SkipLogo } from "@/components/brand/skip-logo";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Rates", href: "#rates" },
  { label: "FAQs", href: "#faqs" },
];

const HERO_STATS = [
  { value: "2%", label: "Deposit to start" },
  { value: "48 hrs", label: "Typical pre-approval" },
  { value: "10x less", label: "Upfront cash vs banks" },
];

const RATE_CARDS = [
  {
    label: "Owner Occupied",
    productRate: "6.30%",
    comparisonRate: "6.63%",
  },
  {
    label: "Investment Property",
    productRate: "6.65%",
    comparisonRate: "6.95%",
  },
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

const STEPS = [
  {
    title: "Check your numbers",
    description: "Answer a few questions and see your borrowing range in minutes.",
  },
  {
    title: "Apply online",
    description: "Submit a short application and securely upload supporting documents.",
  },
  {
    title: "Get pre-approved",
    description: "A lending specialist reviews your file with a typical 48-hour turnaround.",
  },
  {
    title: "Settle and move in",
    description: "Complete finance, collect your keys, and start your next chapter.",
  },
];

const BENEFITS = [
  "Bank-grade privacy and document security",
  "Transparent rates with no hidden surprises",
  "Dedicated support from application to settlement",
  "Built for owner-occupiers and investors",
];

const FAQS = [
  {
    question: "Is this a regulated home loan?",
    answer:
      "Yes. Skip follows Australian lending standards and responsible lending requirements, including full documentation checks.",
  },
  {
    question: "Who is this best for?",
    answer:
      "It is designed for buyers who can service a loan but want to avoid waiting years to save a traditional 20% deposit.",
  },
  {
    question: "How quickly can I apply?",
    answer:
      "You can start online in minutes. Most eligible applications receive pre-approval feedback within around 48 hours.",
  },
];

export default function Option2Page() {
  return (
    <div className="relative overflow-x-clip bg-canvas text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(52rem 34rem at 14% -6%, color-mix(in srgb, var(--mint) 48%, white), transparent 68%), radial-gradient(45rem 28rem at 102% 8%, color-mix(in srgb, var(--brand) 18%, white), transparent 64%), linear-gradient(180deg, #f8fcf8 0%, #f1f8f2 28%, #f3f8f3 100%)",
        }}
      />

      <header className="sticky top-0 z-30 border-b border-brand/10 bg-white/85 backdrop-blur-xl">
        <div className="section-shell flex h-20 items-center justify-between gap-6">
          <Link href="/option2" aria-label="Skip option two home" className="text-[2.2rem] leading-none text-brand">
            <SkipLogo variant={1} priority />
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-brand transition-colors hover:text-brand-dark"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#apply"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden border-brand/25 text-brand md:inline-flex")}
            >
              Check eligibility
            </a>
            <a href="#apply" className={buttonVariants({ variant: "brand", size: "sm" })}>
              Apply now
            </a>
          </div>
        </div>
      </header>

      <main className="pb-24 md:pb-0">
        <section className="section-shell section-y-lg">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <Badge variant="mint" className="rounded-full border-brand/15 px-4 py-1.5 text-[0.72rem] uppercase tracking-[0.14em]">
                2% Deposit Home Loans
              </Badge>
              <div className="space-y-4">
                <h1 className="font-display text-5xl leading-[0.96] tracking-[-0.03em] text-brand md:text-7xl lg:text-8xl">
                  Own sooner.
                  <br />
                  Move smarter.
                </h1>
                <p className="measure-copy text-base text-brand/80 md:text-lg">
                  Skip gives you the security of a standard lending process with a dramatically lower upfront deposit.
                  Same destination, faster path.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3" id="apply">
                <a href="#rates" className={buttonVariants({ variant: "brand", size: "xl" })}>
                  Explore rates
                  <ArrowRight className="size-4" aria-hidden />
                </a>
                <a
                  href="#how-it-works"
                  className={cn(buttonVariants({ variant: "outline", size: "xl" }), "border-brand/20 bg-white/70 text-brand hover:bg-white")}
                >
                  See how it works
                </a>
              </div>
              <p className="text-xs tracking-wide text-brand/70">ACL XXXXXX · 48 hours typical response · Privacy-first data handling</p>
              <ul className="grid gap-3 sm:grid-cols-3">
                {HERO_STATS.map((item) => (
                  <li
                    key={item.label}
                    className="rounded-3xl border border-brand/12 bg-white/80 px-5 py-4 shadow-[0_16px_42px_-32px_rgba(31,86,58,0.58)]"
                  >
                    <p className="font-display text-3xl tracking-tight text-brand">{item.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-brand/65">{item.label}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -left-10 -top-10 hidden rounded-2xl bg-brand px-4 py-3 text-white shadow-refined md:block">
                <p className="text-xs uppercase tracking-[0.12em] text-mint">Typical pre-approval</p>
                <p className="font-display text-2xl">48 hours</p>
              </div>
              <div className="absolute -bottom-7 -right-6 hidden rounded-2xl bg-mint px-4 py-3 text-brand shadow-refined md:block">
                <p className="text-xs uppercase tracking-[0.12em]">Min. deposit</p>
                <p className="font-display text-2xl">2%</p>
              </div>
              <div className="relative overflow-hidden rounded-[2.25rem] border border-brand/10 bg-white p-4 shadow-[0_42px_90px_-46px_rgba(31,86,58,0.8)]">
                <div
                  className="absolute inset-x-0 top-0 h-28"
                  style={{
                    background:
                      "linear-gradient(180deg, color-mix(in srgb, var(--mint) 55%, white) 0%, color-mix(in srgb, var(--mint) 20%, transparent) 76%, transparent 100%)",
                  }}
                />
                <Image
                  src="/hero-kangaroo.png"
                  alt="Skip mascot in front of a home"
                  width={770}
                  height={924}
                  priority
                  className="relative z-10 mx-auto h-auto w-full rounded-[1.5rem] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="rates" className="section-shell pb-8">
          <div className="overflow-hidden rounded-[2rem] bg-brand text-white shadow-[0_38px_75px_-45px_rgba(24,67,45,0.85)]">
            <div className="grid gap-6 p-7 md:p-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
              <div className="space-y-3">
                <Badge className="w-fit border-white/25 bg-white/10 text-[0.72rem] uppercase tracking-[0.14em] text-white">
                  Current rates
                </Badge>
                <h2 className="font-display text-4xl tracking-tight md:text-5xl">Clear pricing. No confusion.</h2>
                <p className="max-w-md text-sm text-white/80 md:text-base">
                  Compare product and comparison rates side by side, with transparent terms from day one.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {RATE_CARDS.map((rate) => (
                  <Card key={rate.label} className="rounded-2xl border-white/20 bg-white/10 text-white shadow-none backdrop-blur-sm">
                    <CardContent className="space-y-4 p-6">
                      <p className="text-sm uppercase tracking-[0.12em] text-mint">{rate.label}</p>
                      <div>
                        <p className="font-display text-5xl leading-none">{rate.productRate}</p>
                        <p className="text-xs text-white/70">Product rate</p>
                      </div>
                      <div>
                        <p className="font-display text-3xl leading-none">{rate.comparisonRate}</p>
                        <p className="text-xs text-white/70">Comparison rate</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell section-y">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
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
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {PATHWAYS.map((item) => (
              <Card key={item.title} className="group overflow-hidden rounded-[1.6rem] border-brand/12 bg-white shadow-refined">
                <CardContent className="p-0">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      width={640}
                      height={420}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-3 p-5">
                    <h3 className="font-display text-3xl leading-[1.02] tracking-tight text-brand">{item.title}</h3>
                    <p className="text-sm text-brand/75">{item.description}</p>
                    <a href="#apply" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                      Learn more
                      <ArrowRight className="size-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="section-shell section-y">
          <div className="rounded-[2rem] border border-brand/10 bg-white p-6 md:p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <Badge variant="mint" className="mb-3 w-fit border-brand/15">
                  How it works
                </Badge>
                <h2 className="font-display text-4xl tracking-tight text-brand md:text-5xl">From application to keys.</h2>
              </div>
            </div>
            <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {STEPS.map((step, index) => (
                <li key={step.title} className="rounded-2xl border border-brand/10 bg-canvas/75 p-5">
                  <p className="font-display text-4xl text-brand/30">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-lg font-semibold text-brand">{step.title}</h3>
                  <p className="mt-2 text-sm text-brand/75">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section-shell section-y">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] bg-brand p-7 text-white md:p-9">
              <h2 className="font-display text-4xl tracking-tight md:text-5xl">Why people switch to Skip.</h2>
              <ul className="mt-6 space-y-3">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 text-mint" aria-hidden />
                    <span className="text-sm text-white/88 md:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <ShieldCheck className="mb-2 size-5 text-mint" />
                  <p className="text-xs uppercase tracking-[0.12em] text-white/70">Security</p>
                  <p className="mt-1 text-sm text-white">Bank-grade controls and encrypted doc handling.</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <Clock3 className="mb-2 size-5 text-mint" />
                  <p className="text-xs uppercase tracking-[0.12em] text-white/70">Speed</p>
                  <p className="mt-1 text-sm text-white">Faster path from application to pre-approval.</p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-brand/10 bg-white p-7 md:p-9">
              <BadgeDollarSign className="mb-4 size-6 text-brand" />
              <h3 className="font-display text-3xl leading-tight tracking-tight text-brand md:text-4xl">
                &ldquo;Skip helped us buy years earlier than we expected.&rdquo;
              </h3>
              <p className="mt-4 text-sm text-brand/75 md:text-base">
                We thought we needed a full 20% saved to make a move. With Skip we kept our plans on track, stayed in
                control of repayments, and bought in the suburb we actually wanted.
              </p>
              <p className="mt-4 text-sm font-semibold text-brand">Sarah and Dan, Melbourne</p>
              <div className="mt-7 rounded-2xl bg-canvas p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-brand/60">Quick comparison</p>
                <dl className="mt-2 space-y-2 text-sm text-brand/80">
                  <div className="flex items-center justify-between gap-4 border-b border-brand/10 pb-2">
                    <dt>Traditional deposit</dt>
                    <dd className="font-semibold">20%</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-brand/10 pb-2">
                    <dt>Skip minimum deposit</dt>
                    <dd className="font-semibold">2%</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Time to start</dt>
                    <dd className="font-semibold">Now</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section id="faqs" className="section-shell section-y pt-0">
          <div className="rounded-[2rem] border border-brand/12 bg-white p-6 md:p-8">
            <h2 className="font-display text-4xl tracking-tight text-brand md:text-5xl">Common questions</h2>
            <div className="mt-6 divide-y divide-brand/10">
              {FAQS.map((faq) => (
                <details key={faq.question} className="group py-4">
                  <summary className="flex list-none items-center justify-between gap-4 text-left text-base font-semibold text-brand marker:content-none">
                    {faq.question}
                    <ChevronRight className="size-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 max-w-3xl text-sm text-brand/75 md:text-base">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden border-y border-brand/12 bg-mint/35">
          <div className="whitespace-nowrap py-4 text-center text-sm font-semibold uppercase tracking-[0.16em] text-brand/85">
            <span className="mx-4">Skip lending</span>
            <span className="mx-4">2% deposit</span>
            <span className="mx-4">transparent rates</span>
            <span className="mx-4">local support</span>
            <span className="mx-4">security first</span>
            <span className="mx-4">skip waiting</span>
          </div>
        </section>
      </main>

      <footer className="bg-brand text-white">
        <div className="section-shell py-12">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="text-[2.3rem] leading-none text-white">
                <SkipLogo variant={4} />
              </div>
              <p className="mt-4 max-w-md text-sm text-white/75">
                A modern path to home ownership with a lower deposit, clear lending terms, and support all the way to
                settlement.
              </p>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[0.14em] text-mint">Product</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>
                  <a href="#how-it-works" className="hover:text-white">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#rates" className="hover:text-white">
                    Rates
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="hover:text-white">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[0.14em] text-mint">Compliance</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>ACL XXXXXX</li>
                <li>Responsible lending framework</li>
                <li>Privacy-first data handling</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/20 pt-4 text-xs text-white/60">
            © {new Date().getFullYear()} Skip. All rights reserved.
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand/15 bg-white/95 p-3 backdrop-blur md:hidden">
        <div className="section-shell !px-0">
          <a href="#apply" className={cn(buttonVariants({ variant: "brand" }), "h-11 w-full rounded-full text-sm font-semibold")}>
            Start your application
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}
