"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ExpandingCaretButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

const STREAM_COUNT = 1;
const STREAM_DURATION_MS = 2000;

// When launched: tile arrows across the full button width with no gaps.
// 14 px spacing × 220 arrows = 3080 px — covers 200vw on most screens.
const TILE_COUNT = 220;
const TILE_SPACING = 14; // px between arrow left positions (touching arrows)

const EXPAND_DURATION_MS = 1000;

const STYLES = `
  @keyframes ecb-stream {
    0%   { opacity: 0;   }
    30%  { opacity: 1;   }
    70%  { opacity: 1;   }
    100% { opacity: 0;   }
  }
`;

function SkipArrow({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="480 155 135 90" aria-hidden="true" className={className} style={style}>
      <path
        fill="currentColor"
        d="M541.14,234.73c-.87,4.56,4.77,7.13,9.51,4.33l58.29-32.53c3.81-2.26,4.54-6.67,1.45-8.8l-45.64-33.9c-3.75-2.58-10.12.02-10.96,4.47l-2.45,12.84-3.19,16.74c-.06-.05-.1-.11-.16-.15l-45.64-33.9c-3.75-2.58-10.12.02-10.96,4.47l-2.45,12.84-7.11,37.35-3.09,16.24c-.87,4.56,4.77,7.13,9.51,4.33l58.25-32.51-2.27,11.94-3.09,16.24Z"
      />
    </svg>
  );
}

function ExpandingCaretButton({
  label,
  className,
  type = "button",
  onClick,
  style,
  disabled,
  ...props
}: ExpandingCaretButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  // Capture the natural width once on mount so we have a concrete pixel value to
  // animate FROM (CSS can't tween from `auto`).
  const [initialWidth, setInitialWidth] = React.useState<number | null>(null);
  const [launched, setLaunched] = React.useState(false);
  const [launchViewportPosition, setLaunchViewportPosition] = React.useState<{
    left: number;
    top: number;
  } | null>(null);

  React.useLayoutEffect(() => {
    if (buttonRef.current) {
      setInitialWidth(buttonRef.current.offsetWidth);
    }
  }, []);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || disabled || launched) return;
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        setLaunchViewportPosition({ left: rect.left, top: rect.top });
      }
      setLaunched(true);
    },
    [disabled, onClick, launched],
  );

  return (
    <>
      <style>{STYLES}</style>
      {/*
        Wrapper reserves the original layout footprint once the button escapes to
        fixed positioning on launch, so surrounding elements don't reflow.
      */}
      <div
        className="relative inline-flex shrink-0"
        style={
          launched && initialWidth != null
            ? { width: `${initialWidth}px`, height: "3rem" }
            : undefined
        }
      >
        <Button
          ref={buttonRef}
          type={type}
          variant="brand"
          size="lg"
          disabled={disabled}
          onClick={handleClick}
          style={{
            // On launch: use viewport-fixed positioning and max z-index so the
            // expansion sits above all page content.
            // Width transitions from the measured pixel value to 200vw.
            ...style,
            ...(launched
              ? {
                  position: "fixed",
                  left: launchViewportPosition?.left ?? 0,
                  top: launchViewportPosition?.top ?? 0,
                  zIndex: 2147483647,
                }
              : {}),
            width: launched ? "200vw" : initialWidth != null ? `${initialWidth}px` : undefined,
            transition: launched
              ? `width ${EXPAND_DURATION_MS}ms cubic-bezier(0.4, 0, 1, 0.6)`
              : "none",
          }}
          className={cn(
            "h-12 shrink-0 overflow-hidden rounded-full pl-6 pr-0 text-base font-semibold shadow-[0_16px_34px_-24px_rgba(24,67,45,0.9)]",
            className,
          )}
          {...props}
        >
          <span className="shrink-0">{label}</span>

          {/*
            Arrow track.
            Idle: fixed 48 px lane with edge masks (same as AnimatedCaretButton).
            Launched: flex-1 fills the growing button. Arrows are tiled at fixed
            left positions spanning 3000 px so they repeat across the full width.
            A left-edge fade masks the label join; the button's overflow-hidden
            clips the right side naturally.
          */}
          <span
            className={cn("relative inline-flex h-4", launched ? "flex-1 0%" : "items-center justify-center")}
            style={
              launched
                ? {
                    flex: "1 1 0%",
                    minWidth: 0,
                    marginLeft: "0.375rem",
                  }
                : {
                    width: "2rem",
                    marginLeft: "0.375rem",
                    flexShrink: 0,
                  }
            }
          >
            {launched
              ? Array.from({ length: TILE_COUNT }).map((_, i) => (
                  <SkipArrow
                    key={i}
                    className="absolute left-0 h-3.5 w-3.5 text-white/90"
                    style={{
                      left: `${i * TILE_SPACING}px`,
                    }}
                  />
                ))
              : Array.from({ length: STREAM_COUNT }).map((_, i) => (
                  <SkipArrow
                    key={i}
                    className="absolute left-0 h-3.5 w-3.5 text-white/90"
                    style={{
                      animation: `ecb-stream ${STREAM_DURATION_MS}ms linear infinite`,
                      animationDelay: `${-((i * STREAM_DURATION_MS) / STREAM_COUNT)}ms`,
                    }}
                  />
                ))}
          </span>
        </Button>
      </div>
    </>
  );
}

export { ExpandingCaretButton };
