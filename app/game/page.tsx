"use client";

import Link from "next/link";

import { SkipRooRunnerGame } from "@/components/ui/skip-roo-runner-game";

export default function GamePage() {
  return (
    <main className="min-h-screen bg-canvas px-4 py-10 md:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl text-ink md:text-4xl">Skip Roo Runner</h1>
            <p className="mt-1 text-sm text-ink/75">Jump over the big lending hurdles and keep your run alive.</p>
          </div>
          <Link href="/" className="text-sm font-semibold text-brand underline underline-offset-4">
            Back to options
          </Link>
        </div>

        <SkipRooRunnerGame keyboardScope="global" />
      </div>
    </main>
  );
}
