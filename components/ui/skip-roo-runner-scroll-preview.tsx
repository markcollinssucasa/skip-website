"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface PreviewObstacle {
  id: number;
  label: string;
  worldX: number;
  width: number;
  height: number;
}

interface SkipRooRunnerScrollPreviewProps {
  className?: string;
}

const OBSTACLE_LABELS = [
  "20% deposit",
  "years of waiting",
  "FHB retrictions",
  "big bank rules",
  "Renting",
];

const GRAVITY = -1700;
const JUMP_VELOCITY = 860;
const RUN_SPEED = 178;

const getObstacleWidth = (label: string, mobile: boolean) => {
  const minWidth = mobile ? 82 : 92;
  const maxWidth = mobile ? 130 : 150;
  const charWidth = mobile ? 5.7 : 6.4;
  const padding = mobile ? 16 : 24;
  return Math.max(minWidth, Math.min(maxWidth, Math.ceil(label.length * charWidth + padding)));
};

const buildObstacles = (arenaWidth: number): PreviewObstacle[] => {
  const mobile = arenaWidth < 560;
  const heights = mobile ? [30, 34, 38] : [34, 38, 42, 46];
  const obstacles: PreviewObstacle[] = [];
  let worldX = arenaWidth + (mobile ? 100 : 150);

  for (let i = 0; i < 90; i += 1) {
    const label = OBSTACLE_LABELS[i % OBSTACLE_LABELS.length];
    obstacles.push({
      id: i + 1,
      label,
      worldX,
      width: getObstacleWidth(label, mobile),
      height: heights[i % heights.length],
    });

    worldX += (mobile ? 190 : 230) + (i % 3) * (mobile ? 30 : 46);
  }

  return obstacles;
};

export function SkipRooRunnerScrollPreview({ className }: SkipRooRunnerScrollPreviewProps) {
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const lastJumpObstacleRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const runnerYRef = useRef(0);
  const worldDistanceRef = useRef(0);

  const [arenaWidth, setArenaWidth] = useState(960);
  const [worldDistance, setWorldDistance] = useState(0);
  const [runnerY, setRunnerY] = useState(0);

  const mobile = arenaWidth < 560;
  const runnerX = mobile ? 52 : 78;
  const runnerWidth = mobile ? 44 : 54;
  const runnerHeight = mobile ? 66 : 82;
  const groundOffset = mobile ? 66 : 92;
  const jumpVelocity = mobile ? 760 : JUMP_VELOCITY;
  const runSpeed = mobile ? RUN_SPEED * 0.84 : RUN_SPEED;

  const obstacles = useMemo(() => buildObstacles(arenaWidth), [arenaWidth]);

  const visibleObstacles = useMemo(() => {
    return obstacles
      .map((obstacle) => ({
        ...obstacle,
        x: obstacle.worldX - worldDistance,
      }))
      .filter((obstacle) => obstacle.x + obstacle.width > -24 && obstacle.x < arenaWidth + 24);
  }, [arenaWidth, obstacles, worldDistance]);

  useEffect(() => {
    const node = arenaRef.current;
    if (!node) {
      return;
    }

    const updateWidth = () => {
      setArenaWidth(node.clientWidth || 960);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const frame = (timestamp: number) => {
      const previous = lastFrameRef.current ?? timestamp;
      const delta = Math.min((timestamp - previous) / 1000, 0.05);
      lastFrameRef.current = timestamp;

      const trackEnd = obstacles[obstacles.length - 1]?.worldX ?? 0;
      let distance = worldDistanceRef.current + runSpeed * delta;

      if (distance > trackEnd + arenaWidth) {
        distance = 0;
        lastJumpObstacleRef.current = null;
      }

      worldDistanceRef.current = distance;

      const nextObstacle = obstacles.find((obstacle) => {
        const x = obstacle.worldX - distance;
        return x + obstacle.width >= runnerX - 6;
      });

      if (nextObstacle && runnerYRef.current <= 1 && velocityRef.current <= 0) {
        const runnerRefX = runnerX + runnerWidth * 0.35;
        const obstacleLeft = nextObstacle.worldX - distance;
        const timeToApex = jumpVelocity / Math.abs(GRAVITY);
        const apexTravel = runSpeed * timeToApex;
        const jumpTriggerAhead = Math.max(10, apexTravel - nextObstacle.width * 0.5);

        if (
          obstacleLeft - runnerRefX <= jumpTriggerAhead &&
          lastJumpObstacleRef.current !== nextObstacle.id
        ) {
          velocityRef.current = jumpVelocity;
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

      setWorldDistance(distance);
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
  }, [arenaWidth, jumpVelocity, obstacles, runSpeed, runnerWidth, runnerX]);

  return (
    <div
      ref={arenaRef}
      aria-label="Skip Roo auto runner preview"
      className={cn(
        "relative h-[220px] w-full overflow-hidden border-y border-brand/10 bg-[#f8fbf8] sm:h-[270px] md:h-[320px]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute left-0 h-px w-[200%] bg-repeat-x opacity-50"
        style={{
          bottom: Math.max(8, groundOffset - 32),
          backgroundImage:
            "linear-gradient(90deg, transparent 0 12px, #355b47 12px 22px, transparent 22px 42px)",
          transform: `translateX(-${(worldDistance * 0.7) % 420}px)`,
        }}
      />
      <div className="absolute left-0 right-0 h-[2px] bg-ink/75" style={{ bottom: groundOffset }} />

      {visibleObstacles.map((obstacle) => (
        <div
          key={obstacle.id}
          className="absolute flex items-center justify-center whitespace-nowrap rounded-sm border border-brand/30 bg-white px-2 text-[10px] font-semibold leading-tight tracking-[0.01em] text-brand shadow-[0_2px_6px_rgba(0,0,0,0.1)]"
          style={{
            left: obstacle.x,
            width: obstacle.width,
            height: obstacle.height,
            bottom: groundOffset,
          }}
        >
          {obstacle.label}
        </div>
      ))}

      <div
        className="absolute will-change-transform"
        style={{
          left: runnerX,
          width: runnerWidth,
          height: runnerHeight,
          bottom: groundOffset + runnerY,
        }}
      >
        <Image
          src="/brand/skip-roo.png"
          alt="Skip Roo auto jumping preview"
          fill
          sizes="(max-width: 560px) 44px, 54px"
          className="object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
        />
      </div>
    </div>
  );
}
