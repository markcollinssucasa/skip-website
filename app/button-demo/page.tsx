import Link from "next/link";

import { AnimatedCaretButton } from "@/components/ui/animated-caret-button";
import { FillArrowButton } from "@/components/ui/fill-arrow-button";

export default function ButtonDemoPage() {
  return (
    <main className="min-h-screen bg-canvas px-6 py-16 text-ink">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <Link href="/" className="text-sm font-semibold text-brand underline underline-offset-4 hover:text-brand-dark">
          Back to index
        </Link>

        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand/60">Component Demo</p>
          <h1 className="font-display text-4xl tracking-[-0.02em] text-brand md:text-5xl">Animated paired-caret button</h1>
          <p className="max-w-[56ch] text-sm text-ink/75 md:text-base">
            By default there is one right caret. On click the button expands to the right and additional carets appear as it grows.
          </p>
        </header>

        <div className="rounded-3xl border border-brand/12 bg-white p-6 shadow-refined md:p-8">
          <div className="flex flex-wrap items-center gap-4">
            <AnimatedCaretButton label="Get pre-approved" />
            <AnimatedCaretButton label="See rates" className="bg-brand-dark hover:bg-brand" />
            <AnimatedCaretButton label="Disabled state" disabled className="cursor-not-allowed" />
          </div>
        </div>

        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand/60">Component Demo</p>
          <h1 className="font-display text-4xl tracking-[-0.02em] text-brand md:text-5xl">Fill arrow button</h1>
          <p className="max-w-[56ch] text-sm text-ink/75 md:text-base">
            On click the label fades out and the entire button fills with a continuous rightward arrow stream.
          </p>
        </header>

        <div className="rounded-3xl border border-brand/12 bg-white p-6 shadow-refined md:p-8">
          <div className="flex flex-wrap items-center gap-4">
            <FillArrowButton label="Get pre-approved" />
            <FillArrowButton label="See rates" className="bg-brand-dark hover:bg-brand" />
            <FillArrowButton label="Disabled state" disabled className="cursor-not-allowed" />
          </div>
        </div>
      </section>
    </main>
  );
}
