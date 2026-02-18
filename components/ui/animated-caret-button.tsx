"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type AnimatedCaretButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

// 3 arrows phase-shifted through a 2.8s cycle → wider gap between each
const STREAM_COUNT = 3;
const STREAM_DURATION_MS = 2800;

// Burst fires rapidly then stream resumes
const BURST_DURATION_MS = 500;
const BURST_STAGGER_MS = 200;

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

// CSS keyframes injected once via a style tag.
// acb-stream: arrows begin just left of the lane, glide right, and fade on both edges.
// acb-burst:  rapid one-shot rightward scatter on click.
const STYLES = `
  @keyframes acb-stream {
    0%   { transform: translateX(-12px); opacity: 0;    }
    20%  { opacity: 0.8;                                }
    34%  { opacity: 1;                                  }
    74%  { opacity: 1;                                  }
    90%  { opacity: 0.55;                               }
    100% { transform: translateX(60px); opacity: 0;     }
  }
  @keyframes acb-burst {
    0%   { transform: translateX(-6px); opacity: 0;     }
    16%  { opacity: 1;                                  }
    54%  { transform: translateX(30px); opacity: 1;     }
    100% { transform: translateX(76px); opacity: 0;     }
  }
`;

function AnimatedCaretButton({
  label,
  className,
  type = "button",
  onClick,
  style,
  disabled,
  ...props
}: AnimatedCaretButtonProps) {
  const [bursting, setBursting] = React.useState(false);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || disabled || bursting) return;
      setBursting(true);
      // Let all burst arrows finish, then resume streaming
      setTimeout(
        () => setBursting(false),
        BURST_DURATION_MS + BURST_STAGGER_MS * (STREAM_COUNT - 1) + 80,
      );
    },
    [disabled, onClick, bursting],
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
          "h-12 shrink-0 overflow-hidden rounded-full pl-6 pr-0 text-base font-semibold shadow-[0_16px_34px_-24px_rgba(24,67,45,0.9)]",
          className,
        )}
        {...props}
      >
        {/* Label */}
        <span className="shrink-0">{label}</span>

        {/*
          Arrow stream track — fixed 56 px wide, masked at both edges so arrows
          appear to emerge from behind the label and dissolve into the button rim.
          Negative animation-delay staggers arrows across the cycle (phase offset),
          so the loop is seamless from the very first frame.
        */}
        <span
          className="relative ml-1.5 inline-flex h-4 w-12 shrink-0 items-center"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, white 26%, white 74%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, white 26%, white 74%, transparent 100%)",
          }}
        >
          {Array.from({ length: STREAM_COUNT }).map((_, i) => (
            <SkipArrow
              key={i}
              className="absolute left-0 h-3.5 w-3.5 text-white/90"
              style={{
                animation: bursting
                  ? `acb-burst ${BURST_DURATION_MS}ms ease-out both`
                  : `acb-stream ${STREAM_DURATION_MS}ms linear infinite`,
                animationDelay: bursting
                  ? `${i * BURST_STAGGER_MS}ms`
                  : `${-((i * STREAM_DURATION_MS) / STREAM_COUNT)}ms`,
              }}
            />
          ))}
        </span>
      </Button>
    </>
  );
}

export { AnimatedCaretButton };
