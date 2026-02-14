import type { ElementType } from "react";

import { cn } from "@/lib/utils";

import { SkipLogo, type SkipLogoVariant } from "./skip-logo";
import { SkipLogoPressButton } from "./skip-logo-press-button";

type SkipToOwningBitLogoStyle = "press" | "classic";

interface SkipToOwningBitHeadingProps {
  as?: ElementType;
  logoVariant?: SkipLogoVariant;
  logoStyle?: SkipToOwningBitLogoStyle;
  className?: string;
  logoClassName?: string;
  textClassName?: string;
  lineOne?: string;
  lineTwo?: string;
  priorityLogo?: boolean;
}

export function SkipToOwningBitHeading({
  as: Component = "h1",
  logoVariant = 1,
  logoStyle = "press",
  className,
  logoClassName,
  textClassName,
  lineOne = "to the",
  lineTwo = "owning bit",
  priorityLogo = false,
}: SkipToOwningBitHeadingProps) {
  return (
    <Component className={cn("inline-flex items-center gap-x-[0.1em] whitespace-nowrap leading-none", className)}>
      {logoStyle === "classic" ? (
        <SkipLogo variant={logoVariant} className={cn("h-[1.7em]", logoClassName)} priority={priorityLogo} />
      ) : (
        <SkipLogoPressButton
          className={cn("h-[1.7em]", logoClassName)}
          aria-label="Skip"
        />
      )}
      <span className={cn("flex shrink-0 flex-col text-left text-[0.66em] leading-[0.84]", textClassName)}>
        <span className="font-display whitespace-nowrap">{lineOne}</span>
        <span className="font-display whitespace-nowrap">{lineTwo}</span>
      </span>
    </Component>
  );
}
