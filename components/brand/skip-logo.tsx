import Image from "next/image";

import { cn } from "@/lib/utils";

export type SkipLogoVariant = 1 | 2 | 3 | 4;

interface SkipLogoProps {
  variant?: SkipLogoVariant;
  className?: string;
  priority?: boolean;
}

const LOGO_SRC: Record<SkipLogoVariant, string> = {
  1: "/brand/skip-logo-tm-1.svg",
  2: "/brand/skip-logo-tm-2.svg",
  3: "/brand/skip-logo-tm-3.svg",
  4: "/brand/skip-logo-tm-4.svg",
};

export function SkipLogo({ variant = 1, className, priority = false }: SkipLogoProps) {
  return (
    <Image
      src={LOGO_SRC[variant]}
      alt="Skip"
      width={842}
      height={595}
      priority={priority}
      className={cn("h-[1.18em] w-auto shrink-0 rounded-[0.24em] align-middle", className)}
    />
  );
}
