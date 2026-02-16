"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface ScrollObstacle {
  id: number;
  label: string;
  worldY: number;
  width: number;
  height: number;
}

const FALLBACK_LABELS = [
  "2% deposit",
  "Transparent rates",
  "Borrowing power",
  "4 steps to keys",
  "Buyer stories",
  "Ready to own",
];

const SECTION_LABEL_BY_ID: Record<string, string> = {
  top: "Start owning",
  rates: "Transparent rates",
  "roo-runner": "Play the game",
  calculator: "Borrowing power",
  "how-it-works": "4 steps to keys",
  faq: "Questions answered",
  apply: "Ready to own",
  "owning-bit-complete": "Owning bit",
};

const SECTION_LABEL_PATTERNS: Array<[RegExp, string]> = [
  [/constrained by your deposit/i, "Deposit barrier"],
  [/stop saving.*start owning/i, "Start owning"],
  [/transparent rates/i, "Transparent rates"],
  [/leap past .* hurdles/i, "Beat hurdles"],
  [/what your savings can buy/i, "Borrowing power"],
  [/four steps to your keys/i, "4 steps to keys"],
  [/your next chapter/i, "Next chapter"],
  [/trusted by buyers/i, "Buyer stories"],
  [/questions.*answered/i, "Questions answered"],
  [/ready to skip to the owning bit/i, "Ready to own"],
  [/you made it to the owning bit/i, "Owning bit"],
  [/2%\s*deposit/i, "2% deposit"],
];

const GRAVITY = -1900;
const JUMP_VELOCITY = 860;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const cleanText = (value: string) => value.replace(/\s+/g, " ").trim();

const shortenLabel = (value: string, mobile: boolean) => {
  const cleaned = cleanText(value).replace(/[^\w\s%&]/g, "");
  if (!cleaned) {
    return mobile ? "Next step" : "Next milestone";
  }

  const words = cleaned.split(" ").filter(Boolean);
  const maxWords = mobile ? 2 : 3;
  const maxChars = mobile ? 18 : 22;
  const compact = words.slice(0, maxWords).join(" ");

  if (compact.length <= maxChars) {
    return compact;
  }

  return `${compact.slice(0, maxChars - 3).trimEnd()}...`;
};

const buildFallbackObstacles = (mobile: boolean, laneHeight: number): ScrollObstacle[] => {
  const hurdles: ScrollObstacle[] = [];
  const baseWidth = mobile ? 74 : 88;
  const maxWidth = mobile ? 116 : 140;
  const charWidth = mobile ? 4.8 : 5.3;
  const heights = mobile ? [24, 27, 30] : [28, 31, 34];
  let worldY = laneHeight + (mobile ? 28 : 34);

  for (let i = 0; i < FALLBACK_LABELS.length; i += 1) {
    const label = FALLBACK_LABELS[i];
    const width = clamp(Math.ceil(baseWidth + label.length * charWidth), baseWidth, maxWidth);
    const height = heights[i % heights.length];

    hurdles.push({
      id: i + 1,
      label,
      worldY,
      width,
      height,
    });

    worldY += (mobile ? 176 : 220) + (i % 3) * (mobile ? 30 : 40);
  }

  return hurdles;
};

const buildSectionObstacles = (mobile: boolean, laneHeight: number): ScrollObstacle[] => {
  const main = document.querySelector("main");
  if (!main) {
    return buildFallbackObstacles(mobile, laneHeight);
  }

  const sections = Array.from(main.querySelectorAll("section")).filter(
    (section): section is HTMLElement => section instanceof HTMLElement && section.offsetHeight > 48,
  );

  if (sections.length === 0) {
    return buildFallbackObstacles(mobile, laneHeight);
  }

  const baseWidth = mobile ? 74 : 88;
  const maxWidth = mobile ? 116 : 140;
  const charWidth = mobile ? 4.8 : 5.3;
  const lead = laneHeight * (mobile ? 0.88 : 0.92);
  const minGap = mobile ? 146 : 182;
  let previousWorldY = -Infinity;

  return sections.map((section, index) => {
    const sectionId = section.id.trim().toLowerCase();
    const headingText =
      section.querySelector("h1, h2, h3")?.textContent ??
      section.querySelector("p, span")?.textContent ??
      "";
    const normalizedHeading = cleanText(headingText);
    const lowerHeading = normalizedHeading.toLowerCase();

    let label = SECTION_LABEL_BY_ID[sectionId] ?? "";
    if (!label) {
      label =
        SECTION_LABEL_PATTERNS.find(([pattern]) => pattern.test(lowerHeading))?.[1] ??
        shortenLabel(normalizedHeading, mobile);
    }

    const sectionRect = section.getBoundingClientRect();
    const sectionTop = Math.max(0, window.scrollY + sectionRect.top);
    const sectionHeight = Math.max(sectionRect.height, section.offsetHeight, 72);
    const sectionOffset = clamp(sectionHeight * 0.42, mobile ? 36 : 44, mobile ? 140 : 220);
    let worldY = sectionTop + sectionOffset + lead;

    if (worldY - previousWorldY < minGap) {
      worldY = previousWorldY + minGap;
    }
    previousWorldY = worldY;

    const width = clamp(Math.ceil(baseWidth + label.length * charWidth), baseWidth, maxWidth);
    const height = mobile ? 24 + (index % 2) * 3 : 28 + (index % 3) * 2;

    return {
      id: index + 1,
      label,
      worldY,
      width,
      height,
    };
  });
};

export function SkipRooRightScrollRunner() {
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const runnerYRef = useRef(0);
  const scrollProgressRef = useRef(0);
  const lastJumpObstacleRef = useRef<number | null>(null);

  const [runnerY, setRunnerY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [viewportHeight, setViewportHeight] = useState(860);
  const [obstacles, setObstacles] = useState<ScrollObstacle[]>([]);

  const mobile = viewportWidth < 768;
  const laneHeight = viewportHeight;
  const runnerWidth = mobile ? 40 : 52;
  const runnerHeight = mobile ? 58 : 76;
  const runnerGround = mobile
    ? Math.max(72, Math.round(laneHeight * 0.2))
    : Math.max(96, Math.round(laneHeight * 0.18));
  const jumpProgress = clamp(runnerY / (mobile ? 160 : 185), 0, 1);
  const jumpForward = Math.sin(jumpProgress * Math.PI) * (mobile ? 16 : 22);

  const visibleObstacles = useMemo(() => {
    return obstacles
      .map((obstacle) => ({
        ...obstacle,
        bottom: scrollProgress - obstacle.worldY,
      }))
      .filter((obstacle) => obstacle.bottom + obstacle.height > -42 && obstacle.bottom < laneHeight + 20);
  }, [laneHeight, obstacles, scrollProgress]);

  useEffect(() => {
    const updateViewport = () => {
      setViewportWidth(window.innerWidth || 1280);
      setViewportHeight(window.innerHeight || 860);
    };

    const updateScroll = () => {
      const viewportOffset = window.innerHeight * (mobile ? 0.88 : 0.92);
      const nextProgress = window.scrollY + viewportOffset;
      scrollProgressRef.current = nextProgress;
      setScrollProgress(nextProgress);
    };

    updateViewport();
    updateScroll();

    window.addEventListener("resize", updateViewport, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("scroll", updateScroll);
    };
  }, [mobile]);

  useEffect(() => {
    const rebuildObstacles = () => {
      const lane = window.innerHeight || viewportHeight;
      setObstacles(buildSectionObstacles(mobile, lane));
    };

    rebuildObstacles();
    const delayedRefreshId = window.setTimeout(rebuildObstacles, 260);
    window.addEventListener("resize", rebuildObstacles, { passive: true });

    const main = document.querySelector("main");
    let resizeObserver: ResizeObserver | null = null;
    if (main instanceof HTMLElement) {
      resizeObserver = new ResizeObserver(() => rebuildObstacles());
      resizeObserver.observe(main);
    }

    return () => {
      window.clearTimeout(delayedRefreshId);
      window.removeEventListener("resize", rebuildObstacles);
      resizeObserver?.disconnect();
    };
  }, [mobile, viewportHeight]);

  useEffect(() => {
    const frame = (timestamp: number) => {
      const previous = lastFrameRef.current ?? timestamp;
      const delta = Math.min((timestamp - previous) / 1000, 0.05);
      lastFrameRef.current = timestamp;

      const triggerStart = runnerGround - 24;
      const triggerEnd = runnerGround + 26;

      const nextObstacle = obstacles.find((obstacle) => {
        const bottom = scrollProgressRef.current - obstacle.worldY;
        const top = bottom + obstacle.height;
        return top >= triggerStart && bottom <= triggerEnd;
      });

      if (nextObstacle && runnerYRef.current <= 1 && velocityRef.current <= 0) {
        if (lastJumpObstacleRef.current !== nextObstacle.id) {
          velocityRef.current = mobile ? JUMP_VELOCITY * 0.93 : JUMP_VELOCITY;
          lastJumpObstacleRef.current = nextObstacle.id;
        }
      } else if (!nextObstacle) {
        lastJumpObstacleRef.current = null;
      }

      velocityRef.current += GRAVITY * delta;
      runnerYRef.current = Math.max(0, runnerYRef.current + velocityRef.current * delta);

      if (runnerYRef.current === 0 && velocityRef.current < 0) {
        velocityRef.current = 0;
      }

      setRunnerY(runnerYRef.current);
      rafRef.current = window.requestAnimationFrame(frame);
    };

    rafRef.current = window.requestAnimationFrame(frame);
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
    };
  }, [mobile, obstacles, runnerGround]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 right-2 z-30 md:right-6"
    >
      <div className={cn("relative h-full overflow-hidden", mobile ? "w-[114px]" : "w-[168px]")}>
        {visibleObstacles.map((obstacle) => (
          <div
            key={obstacle.id}
            className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center whitespace-nowrap rounded-none border border-brand/35 bg-transparent px-1.5 text-[9px] font-semibold text-brand"
            style={{
              bottom: obstacle.bottom,
              width: obstacle.width,
              height: obstacle.height,
            }}
          >
            {obstacle.label}
          </div>
        ))}

        <div
          className="absolute left-1/2 -translate-x-1/2 will-change-transform"
          style={{
            width: runnerWidth,
            height: runnerHeight,
            bottom: runnerGround + runnerY,
            left: `calc(50% + ${jumpForward}px)`,
          }}
        >
          <Image
            src="/brand/skip-roo.png"
            alt=""
            fill
            sizes="(max-width: 767px) 40px, 52px"
            className="object-contain drop-shadow-[0_3px_4px_rgba(0,0,0,0.2)]"
          />
        </div>
      </div>
    </div>
  );
}
