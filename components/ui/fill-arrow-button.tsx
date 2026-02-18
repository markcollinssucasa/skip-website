"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FillArrowButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

const MARQUEE_DURATION_S = 3;

const STYLES = `
  @keyframes fab-marquee {
    from { transform: translateX(-50%); }
    to   { transform: translateX(0%); }
  }
  @keyframes fab-exit-right {
    from { transform: translateX(0px); opacity: 1; }
    to   { transform: translateX(56px); opacity: 0; }
  }
`;

function SkipDoubleArrow({
  style,
  className,
}: {
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <svg
      viewBox="480 155 135 90"
      aria-hidden="true"
      style={style}
      className={className}
    >
      <path
        fill="currentColor"
        d="M541.14,234.73c-.87,4.56,4.77,7.13,9.51,4.33l58.29-32.53c3.81-2.26,4.54-6.67,1.45-8.8l-45.64-33.9c-3.75-2.58-10.12.02-10.96,4.47l-2.45,12.84-3.19,16.74c-.06-.05-.1-.11-.16-.15l-45.64-33.9c-3.75-2.58-10.12.02-10.96,4.47l-2.45,12.84-7.11,37.35-3.09,16.24c-.87,4.56,4.77,7.13,9.51,4.33l58.25-32.51-2.27,11.94-3.09,16.24Z"
      />
    </svg>
  );
}

// One repeating unit: evenly-spaced single arrows.
// paddingRight === gap so the seam between unit 1 and unit 2 is invisible.
const STREAM_GAP = 28;
const STREAM_ARROW_COUNT = 6;

function MarqueeUnit() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexShrink: 0,
        gap: STREAM_GAP,
        paddingRight: STREAM_GAP,
      }}
    >
      {Array.from({ length: STREAM_ARROW_COUNT }).map((_, i) => (
        <SkipDoubleArrow
          key={i}
          style={{
            width: 14,
            height: 14,
            flexShrink: 0,
            color: "rgba(255,255,255,0.82)",
          }}
        />
      ))}
    </span>
  );
}

function FillArrowButton({
  label,
  className,
  type = "button",
  onClick,
  style,
  disabled,
  ...props
}: FillArrowButtonProps) {
  const [active, setActive] = React.useState(false);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || disabled) return;
      setActive(true);
    },
    [disabled, onClick],
  );

  return (
    <>
      <style>{STYLES}</style>
      <Button
        type={type}
        variant="brand"
        size="lg"
        disabled={disabled}
        onClick={handleClick}
        style={style}
        className={cn(
          // layout
          "group relative h-12 shrink-0 overflow-hidden rounded-full px-7",
          // text
          "text-base font-semibold",
          // depth shadow
          "shadow-[0_14px_28px_-18px_rgba(24,67,45,0.85)]",
          // top highlight line
          "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/20",
          // hover / active micro-interactions
          "transition-[transform,box-shadow] duration-200 ease-out",
          "hover:scale-[1.02] hover:shadow-[0_20px_36px_-16px_rgba(24,67,45,0.9)]",
          "active:scale-[0.98] active:duration-75",
          className,
        )}
        {...props}
      >
        {/*
          Invisible spacer — mirrors the label+icon layout so the button
          keeps its natural width even when the overlay is absolute.
        */}
        <span className="invisible inline-flex select-none items-center gap-3.5">
          {label}
          <span style={{ width: 16, height: 16, flexShrink: 0 }} />
        </span>

        {/* ── Idle / hover state: label + arrow icon ── */}
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-between px-7"
          style={{
            animation: active
              ? "fab-exit-right 260ms cubic-bezier(0.4,0,1,1) forwards"
              : "none",
          }}
        >
          <span>{label}</span>

          {/*
            Arrow nudges right on hover with a springy cubic-bezier.
            opacity-65 → opacity-100 to subtly invite interaction.
          */}
          <span
            className={cn(
              "opacity-65 transition-[opacity,transform] duration-300 ease-out",
              "group-hover:translate-x-1 group-hover:opacity-100",
              "ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            )}
          >
            <SkipDoubleArrow style={{ width: 16, height: 16 }} />
          </span>
        </span>

        {/* ── Active state: arrows stream in from the left ── */}
        <span
          className="pointer-events-none absolute inset-0 flex items-center overflow-hidden"
          style={{
            opacity: active ? 1 : 0,
            // slight delay so it starts as the label clears the button
            transition: active ? "opacity 220ms 180ms" : "none",
            // strong left fade (arrows emerge from edge), soft right fade
            maskImage:
              "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.4) 12%, white 28%, white 80%, rgba(255,255,255,0.15) 93%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.4) 12%, white 28%, white 80%, rgba(255,255,255,0.15) 93%, transparent 100%)",
          }}
        >
          {/*
            Two identical units; outer width = 2× one unit.
            translateX(-50%) → translateX(0%): content moves right → arrows
            enter from the left edge in a continuous stream.
            linear keeps the stream at constant speed.
          */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              flexShrink: 0,
              animation: active
                ? `fab-marquee ${MARQUEE_DURATION_S}s linear infinite`
                : "none",
            }}
          >
            <MarqueeUnit />
            <MarqueeUnit />
          </span>
        </span>
      </Button>
    </>
  );
}

export { FillArrowButton };
