"use client";

import { type ButtonHTMLAttributes, type MouseEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

interface SkipWordmarkProps {
  className?: string;
}

function SkipWordmark({ className }: SkipWordmarkProps) {
  return (
    <svg
      viewBox="176 160 515 276"
      aria-hidden="true"
      className={cn("h-[82%] w-auto", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        <path d="M518.88,250.5h-40.66c-1.51,0-2.97,1.22-3.25,2.73l-11.07,58.12-12.62,66.25c-.29,1.51.7,2.73,2.21,2.73h40.66c1.51,0,2.97-1.22,3.25-2.73l12.56-65.95,11.13-58.43c.29-1.51-.7-2.73-2.21-2.73Z" />
        <path d="M669,279.75c-2.64-10.2-7.57-18-14.79-23.4-7.23-5.4-16.16-8.1-26.81-8.1-6.75,0-12.98.98-18.67,2.92-5.7,1.95-10.87,4.69-15.51,8.21-4.19,3.18-7.88,6.81-11.08,10.9-.65.83-1.63,1.36-2.6,1.36h-1.14l3.5-18.42c.29-1.51-.7-2.73-2.21-2.73h-39.09c-1.51,0-2.97,1.22-3.25,2.73l-33.49,176.5c-.29,1.51.7,2.73,2.21,2.73h40.66c1.51,0,2.97-1.22,3.25-2.73l12.89-68.08h1.16c.96,0,1.73.51,2.07,1.33,1.56,3.65,3.64,6.88,6.26,9.7,2.92,3.15,6.7,5.63,11.3,7.43,4.61,1.8,10.06,2.7,16.36,2.7,10.95,0,21.23-2.77,30.83-8.33,9.61-5.55,17.73-13.39,24.38-23.51,6.65-10.13,11.27-22.01,13.86-35.66,2.57-13.5,2.53-25.35-.11-35.55ZM618.81,331.28c-3.1,4.5-7,7.99-11.66,10.46-4.67,2.48-9.71,3.71-15.11,3.71s-9.93-1.24-13.58-3.71c-3.66-2.47-6.22-5.96-7.69-10.46-1.47-4.5-1.62-9.82-.45-15.98,1.14-6,3.3-11.29,6.5-15.86,3.19-4.58,7.09-8.1,11.68-10.58,4.59-2.48,9.59-3.71,14.99-3.71s9.96,1.24,13.7,3.71c3.73,2.47,6.29,6,7.67,10.58,1.38,4.58,1.5,9.87.36,15.86-1.17,6.15-3.31,11.48-6.41,15.98Z" />
        <path d="M541.14,234.73c-.87,4.56,4.77,7.13,9.51,4.33l58.29-32.53c3.81-2.26,4.54-6.67,1.45-8.8l-45.64-33.9c-3.75-2.58-10.12.02-10.96,4.47l-2.45,12.84-3.19,16.74c-.06-.05-.1-.11-.16-.15l-45.64-33.9c-3.75-2.58-10.12.02-10.96,4.47l-2.45,12.84-7.11,37.35-3.09,16.24c-.87,4.56,4.77,7.13,9.51,4.33l58.25-32.51-2.27,11.94-3.09,16.24Z" />
        <path d="M286.79,315.24c-7.09-7.38-20.42-12.9-40.01-16.55-6.13-1.24-10.88-2.48-14.24-3.74-7.13-2.67-7.89-5.02-7.79-8.78.09-3.44,4.46-9.45,20.49-8.66,7.39.36,13.15,2.56,17.04,5.85,3.32,2.82,4.28,6.75,4.58,10.96.09,1.28,1.08,2.18,2.36,2.16l27.86.11c1.6-.03,3-1.46,3.08-3.09.64-11.93-2.8-22.65-10.16-30.74-7.98-8.76-21.4-13.86-40.28-15.3-11.41-.87-21.76.15-31.02,3.05-9.27,2.91-16.92,7.44-22.95,13.59-6.03,6.15-9.98,13.47-11.83,21.93-2.65,12.1-.34,21.58,6.94,28.44,7.27,6.86,19.81,12.12,37.61,15.79,6.86,1.29,12.04,2.61,15.54,3.95,3.5,1.34,5.75,2.79,6.75,4.32,1,1.54,1.26,3.44.76,5.71-.63,2.87-2.52,5.23-5.68,7.06-3.16,1.83-7.66,2.53-13.51,2.08-7.9-.6-13.79-2.74-17.68-6.42-3.36-3.19-5.14-7.12-5.33-11.81-.05-1.29-1.02-2.41-2.3-2.42h-32.81c-1.58,0-3,1.46-3.15,3.07-.74,7.93.56,15.14,3.91,21.62,3.76,7.29,9.97,13.22,18.64,17.8,8.67,4.58,19.29,7.35,31.88,8.31,12.44.95,23.42.06,32.94-2.68,9.52-2.73,17.23-7.18,23.12-13.35,5.89-6.16,9.81-13.71,11.76-22.63,2.72-12.4.53-22.3-6.56-29.68Z" />
        <path d="M456.65,250.5h-44.72c-.79,0-1.61.34-2.24.94l-44.62,42.01c-.63.6-1.45.94-2.24.94h-1.91l16.83-89.06c.29-1.51-.7-2.73-2.21-2.73h-40.66c-1.51,0-2.97,1.22-3.25,2.73l-32.68,172.28c-.29,1.51.7,2.73,2.21,2.73h40.66c1.51,0,2.97-1.22,3.25-2.73l9.64-50.6h1.7c.91,0,1.67.45,2.04,1.21l13.79,28.5c4.56,9.9,10.1,16.69,16.6,20.36,6.5,3.67,14.48,5.51,23.93,5.51,5.33,0,14.36-1.04,22.26-5.88,1.14-.7,1.93-1.84,2.17-3.15l6.05-31.97c.36-1.88-1.79-2.92-3.52-2.15-.81.36-4.45,1.76-8.04,2.25-.92.11-1.87.17-2.84.17-3.45,0-6.56-1.01-9.32-3.04-2.77-2.02-5.11-5.06-7.04-9.11l-11.58-21.12,56.95-53.56c1.88-1.77,1.15-4.53-1.2-4.53Z" />
      </g>
    </svg>
  );
}

type SkipLogoPressButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  wordmarkClassName?: string;
  disableSkipAnimation?: boolean;
  /** Total animation duration in ms (default 900). */
  animationDuration?: number;
};

export function SkipLogoPressButton({
  className,
  wordmarkClassName,
  disableSkipAnimation = false,
  animationDuration = 900,
  type = "button",
  disabled,
  onClick,
  ...props
}: SkipLogoPressButtonProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isRunning, setIsRunning] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [phase, setPhase] = useState<"idle" | "intro" | "hop" | "shatter" | "outro">("idle");
  const timers = useRef<number[]>([]);
  const animScale = animationDuration / 900;

  useEffect(() => {
    return () => {
      timers.current.forEach((timerId) => window.clearTimeout(timerId));
      timers.current = [];
    };
  }, []);

  const runAnimation = () => {
    if (isRunning) return;

    if (prefersReducedMotion || disableSkipAnimation) {
      return;
    }

    setIsRunning(true);
    setIsOverlayVisible(true);
    setPhase("intro");

    timers.current.push(
      window.setTimeout(() => setPhase("hop"), 140 * animScale),
      window.setTimeout(() => setPhase("shatter"), 480 * animScale),
      window.setTimeout(() => {
        setPhase("outro");
      }, 720 * animScale),
      window.setTimeout(() => {
        setIsOverlayVisible(false);
        setPhase("idle");
        setIsRunning(false);
      }, animationDuration),
    );
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    runAnimation();
  };

  const shouldShowRoo = phase === "hop" || phase === "shatter" || phase === "outro";
  const shouldShowShatter = phase === "shatter" || phase === "outro";
  const overlayIsOn = phase === "intro" || phase === "hop" || phase === "shatter";

  return (
    <>
      <button
        type={type}
        className={cn(
          "group relative inline-flex h-12 touch-manipulation select-none rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/80 focus-visible:ring-offset-2",
          className,
        )}
        disabled={disabled || isRunning}
        onClick={handleClick}
        {...props}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 translate-y-[0.24em] rounded-full bg-brand-dark transition-all duration-150 ease-out group-active:translate-y-0 group-active:opacity-0"
        />
        <span className="relative inline-flex h-full items-center rounded-full border border-brand-dark/20 bg-mint px-[0.3em] text-brand-dark transition-transform duration-150 ease-out group-hover:brightness-[1.02] group-active:translate-y-[0.24em]">
          <SkipWordmark className={wordmarkClassName} />
        </span>
      </button>

      {typeof document !== "undefined" && isOverlayVisible
        ? createPortal(
            <div className={cn("skip-overlay", overlayIsOn && "skip-overlay-on")} aria-hidden="true" style={{ "--skip-anim-scale": animScale } as React.CSSProperties}>
              <div className="skip-stage">
                <div className={cn("skip-block", shouldShowShatter && "skip-block-shatter")}>
                  <span className="skip-block-label">Years saving for a deposit</span>
                  <span className={cn("skip-crack skip-crack-1", shouldShowShatter && "skip-crack-on")} />
                  <span className={cn("skip-crack skip-crack-2", shouldShowShatter && "skip-crack-on")} />
                  <span className={cn("skip-crack skip-crack-3", shouldShowShatter && "skip-crack-on")} />
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={cn("skip-roo", shouldShowRoo && "skip-roo-hop")}
                  src="/brand/skip-roo.png"
                  alt=""
                  role="presentation"
                  draggable={false}
                />
              </div>
            </div>,
            document.body,
          )
        : null}

      <style jsx global>{`
        .skip-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          background: rgba(25, 30, 28, 0.02);
          opacity: 0;
          pointer-events: none;
          transition: opacity calc(160ms * var(--skip-anim-scale, 1)) ease, background-color calc(160ms * var(--skip-anim-scale, 1)) ease;
        }

        .skip-overlay-on {
          opacity: 1;
          background: rgba(18, 24, 22, 0.56);
          pointer-events: auto;
        }

        .skip-stage {
          position: relative;
          width: min(700px, 92vw);
          height: min(310px, 44vh);
          display: grid;
          place-items: center;
        }

        .skip-block {
          position: relative;
          padding: 26px 52px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.17);
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.34);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          opacity: 1;
          transform: translateY(0) scale(1);
          transition:
            transform calc(230ms * var(--skip-anim-scale, 1)) cubic-bezier(0.22, 1, 0.36, 1),
            opacity calc(230ms * var(--skip-anim-scale, 1)) cubic-bezier(0.22, 1, 0.36, 1),
            filter calc(230ms * var(--skip-anim-scale, 1)) cubic-bezier(0.22, 1, 0.36, 1);
          overflow: hidden;
        }

        .skip-block-shatter {
          transform: translateY(4px) scale(0.96);
          opacity: 0;
          filter: blur(6px);
        }

        .skip-block-label {
          display: inline-block;
          color: rgba(255, 255, 255, 0.96);
          font: 700 clamp(16px, 2.4vw, 24px) / 1.1 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }

        .skip-crack {
          position: absolute;
          top: -12%;
          bottom: -12%;
          width: 2px;
          opacity: 0;
          background: rgba(255, 255, 255, 0);
          transition: opacity calc(120ms * var(--skip-anim-scale, 1)) ease, background-color calc(120ms * var(--skip-anim-scale, 1)) ease;
        }

        .skip-crack-1 {
          left: 34%;
          transform: rotate(12deg);
        }

        .skip-crack-2 {
          left: 55%;
          transform: rotate(-10deg);
        }

        .skip-crack-3 {
          left: 71%;
          transform: rotate(18deg);
        }

        .skip-crack-on {
          opacity: 1;
          background: rgba(255, 255, 255, 0.22);
        }

        .skip-roo {
          position: absolute;
          left: 50%;
          top: 50%;
          height: min(260px, 50vh);
          width: auto;
          object-fit: contain;
          transform: translate(-50%, -50%) translateX(-360px);
          opacity: 0;
          filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.35));
        }

        .skip-roo-hop {
          opacity: 1;
          animation: skip-hop-arc calc(680ms * var(--skip-anim-scale, 1)) cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes skip-hop-arc {
          0% {
            transform: translate(-50%, -50%) translateX(-360px) translateY(40px);
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          42% {
            transform: translate(-50%, -50%) translateX(-20px) translateY(-120px);
          }

          75% {
            transform: translate(-50%, -50%) translateX(240px) translateY(20px);
          }

          100% {
            transform: translate(-50%, -50%) translateX(340px) translateY(20px);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .skip-overlay,
          .skip-block,
          .skip-roo-hop,
          .skip-crack {
            transition: none;
            animation: none;
          }
        }
      `}</style>
    </>
  );
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mediaQueryList = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setValue = () => setPrefersReducedMotion(mediaQueryList.matches);

    setValue();

    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", setValue);
      return () => mediaQueryList.removeEventListener("change", setValue);
    }

    mediaQueryList.addListener(setValue);
    return () => mediaQueryList.removeListener(setValue);
  }, []);

  return prefersReducedMotion;
}
