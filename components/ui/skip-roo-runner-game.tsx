"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type GameStatus = "ready" | "running" | "over";
type KeyboardScope = "global" | "focus";

interface Obstacle {
  id: number;
  x: number;
  width: number;
  height: number;
  label: string;
}

interface RunnerMetrics {
  x: number;
  width: number;
  height: number;
  groundOffset: number;
}

interface SkipRooRunnerGameProps {
  className?: string;
  keyboardScope?: KeyboardScope;
  variant?: "card" | "full-bleed";
}

const BASE_SPEED = 220;
const SPEED_RAMP = 6;
const GRAVITY = -2000;
const JUMP_VELOCITY = 900;
const SCORE_RATE = 12;

const OBSTACLE_LABELS = [
  "20% deposit",
  "years of waiting",
  "FHB retrictions",
  "big bank rules",
  "Renting",
];

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const nextSpawnIn = (speed: number) => {
  const distance = randomBetween(360, 560);
  return distance / speed;
};

const getRunnerMetrics = (arenaWidth: number): RunnerMetrics => {
  if (arenaWidth < 560) {
    return {
      x: 52,
      width: 44,
      height: 66,
      groundOffset: 34,
    };
  }

  return {
    x: 74,
    width: 54,
    height: 82,
    groundOffset: 42,
  };
};

const createObstacle = (x: number, id: number, label: string, arenaWidth: number): Obstacle => {
  const mobile = arenaWidth < 560;
  const minWidth = mobile ? 84 : 92;
  const maxWidth = mobile ? 132 : 150;
  const charWidth = mobile ? 5.8 : 6.4;
  const basePadding = mobile ? 18 : 24;

  const width = Math.max(minWidth, Math.min(maxWidth, Math.ceil(label.length * charWidth + basePadding)));
  const height = Math.round(randomBetween(mobile ? 30 : 34, mobile ? 40 : 46));

  return {
    id,
    x,
    width,
    height,
    label,
  };
};

const isJumpCode = (code: string) => code === "Space" || code === "ArrowUp" || code === "KeyW";
const isJumpKey = (key: string) => key === " " || key === "ArrowUp" || key.toLowerCase() === "w";

export function SkipRooRunnerGame({
  className,
  keyboardScope = "global",
  variant = "card",
}: SkipRooRunnerGameProps) {
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const nextObstacleIdRef = useRef(1);
  const nextLabelIndexRef = useRef(0);

  const statusRef = useRef<GameStatus>("ready");
  const velocityRef = useRef(0);
  const runnerYRef = useRef(0);
  const scoreRef = useRef(0);
  const speedRef = useRef(BASE_SPEED);
  const spawnRef = useRef(1);
  const obstaclesRef = useRef<Obstacle[]>([]);

  const [status, setStatus] = useState<GameStatus>("ready");
  const [arenaWidth, setArenaWidth] = useState(960);
  const [runnerY, setRunnerY] = useState(0);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const bestScoreRef = useRef(bestScore);
  const fullBleed = variant === "full-bleed";

  const resetGame = useCallback((nextStatus: GameStatus = "ready") => {
    statusRef.current = nextStatus;
    velocityRef.current = 0;
    runnerYRef.current = 0;
    scoreRef.current = 0;
    speedRef.current = BASE_SPEED;
    obstaclesRef.current = [];
    spawnRef.current = randomBetween(1.1, 1.6);
    lastFrameRef.current = null;
    nextLabelIndexRef.current = 0;

    setStatus(nextStatus);
    setRunnerY(0);
    setScore(0);
    setObstacles([]);
  }, []);

  const jump = useCallback(() => {
    if (statusRef.current === "over") {
      resetGame("running");
      velocityRef.current = JUMP_VELOCITY;
      return;
    }

    if (statusRef.current === "ready") {
      statusRef.current = "running";
      setStatus("running");
    }

    if (runnerYRef.current <= 1) {
      velocityRef.current = JUMP_VELOCITY;
    }
  }, [resetGame]);

  useEffect(() => {
    bestScoreRef.current = bestScore;
  }, [bestScore]);

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
    if (keyboardScope !== "global") {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (isJumpCode(event.code)) {
        event.preventDefault();
        jump();
        return;
      }

      if (event.code === "KeyR") {
        event.preventDefault();
        resetGame("ready");
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [jump, keyboardScope, resetGame]);

  useEffect(() => {
    if (status !== "running") {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
      return;
    }

    const runnerMetrics = getRunnerMetrics(arenaWidth);

    const hasCollision = (nextObstacles: Obstacle[], nextRunnerY: number) => {
      const runnerInset = Math.max(6, Math.round(runnerMetrics.width * 0.16));
      const runnerLeft = runnerMetrics.x + runnerInset;
      const runnerRight = runnerMetrics.x + runnerMetrics.width - runnerInset;
      const runnerBottom = nextRunnerY + 6;

      return nextObstacles.some((obstacle) => {
        const obstacleInset = Math.max(6, Math.round(obstacle.width * 0.08));
        const obstacleLeft = obstacle.x + obstacleInset;
        const obstacleRight = obstacle.x + obstacle.width - obstacleInset;

        return (
          runnerRight > obstacleLeft &&
          runnerLeft < obstacleRight &&
          runnerBottom < obstacle.height - 8
        );
      });
    };

    const frame = (timestamp: number) => {
      const previous = lastFrameRef.current ?? timestamp;
      const delta = Math.min((timestamp - previous) / 1000, 0.05);
      lastFrameRef.current = timestamp;

      velocityRef.current += GRAVITY * delta;
      runnerYRef.current = Math.max(0, runnerYRef.current + velocityRef.current * delta);

      if (runnerYRef.current === 0 && velocityRef.current < 0) {
        velocityRef.current = 0;
      }

      scoreRef.current += delta * SCORE_RATE;
      speedRef.current += delta * SPEED_RAMP;
      spawnRef.current -= delta;

      const movedObstacles = obstaclesRef.current
        .map((obstacle) => ({
          ...obstacle,
          x: obstacle.x - speedRef.current * delta,
        }))
        .filter((obstacle) => obstacle.x + obstacle.width > -8);

      if (spawnRef.current <= 0) {
        const label = OBSTACLE_LABELS[nextLabelIndexRef.current % OBSTACLE_LABELS.length];
        movedObstacles.push(
          createObstacle(
            arenaWidth + randomBetween(16, 60),
            nextObstacleIdRef.current,
            label,
            arenaWidth,
          ),
        );
        nextObstacleIdRef.current += 1;
        nextLabelIndexRef.current += 1;
        spawnRef.current = nextSpawnIn(speedRef.current);
      }

      obstaclesRef.current = movedObstacles;

      if (hasCollision(movedObstacles, runnerYRef.current)) {
        statusRef.current = "over";
        setStatus("over");

        const finalScore = Math.floor(scoreRef.current);
        if (finalScore > bestScoreRef.current) {
          bestScoreRef.current = finalScore;
          setBestScore(finalScore);
        }
      }

      setRunnerY(runnerYRef.current);
      setObstacles(movedObstacles);
      setScore(Math.floor(scoreRef.current));

      if (statusRef.current === "running") {
        rafRef.current = window.requestAnimationFrame(frame);
      }
    };

    rafRef.current = window.requestAnimationFrame(frame);
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
    };
  }, [arenaWidth, status]);

  const runnerMetrics = getRunnerMetrics(arenaWidth);

  return (
    <section
      className={cn(
        fullBleed ? "w-full" : "rounded-3xl border border-brand/20 bg-white p-4 shadow-refined md:p-6",
        className,
      )}
    >
      <div
        className={cn(
          "mb-3 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-ink/80 md:mb-4 md:text-sm",
          fullBleed && "mx-auto w-full max-w-7xl px-5 md:px-8",
        )}
      >
        <p className="max-w-[42ch] text-ink/70">
          {keyboardScope === "global"
            ? "Tap, click, or press Space to jump."
            : "Tap or click to jump. On desktop, click the game first then press Space."}
        </p>
        <div className="flex items-center gap-3 md:gap-4">
          <span>
            Score: <strong className="font-semibold text-ink">{score}</strong>
          </span>
          <span>
            Best: <strong className="font-semibold text-ink">{bestScore}</strong>
          </span>
          <button
            type="button"
            onClick={() => resetGame("ready")}
            className="rounded-full border border-brand/25 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-brand transition hover:bg-brand hover:text-white md:px-3 md:py-1.5 md:text-xs"
          >
            Reset (R)
          </button>
        </div>
      </div>

      <div
        ref={arenaRef}
        role="button"
        tabIndex={0}
        aria-label="Skip Roo jump game area"
        onPointerDown={(event) => {
          event.currentTarget.focus();
          jump();
        }}
        onKeyDown={(event) => {
          if (isJumpKey(event.key)) {
            event.preventDefault();
            jump();
            return;
          }

          if (event.key.toLowerCase() === "r") {
            event.preventDefault();
            resetGame("ready");
          }
        }}
        className={cn(
          "relative h-[210px] w-full touch-manipulation select-none overflow-hidden sm:h-[250px] md:h-[300px]",
          fullBleed
            ? "border-y border-brand/10 bg-[#f8fbf8]"
            : "rounded-2xl border-2 border-ink/45 bg-[#f8fbf8]",
        )}
      >
        <div
          className="pointer-events-none absolute left-0 h-px w-[200%] bg-repeat-x opacity-50"
          style={{
            bottom: Math.max(6, runnerMetrics.groundOffset - 36),
            backgroundImage:
              "linear-gradient(90deg, transparent 0 12px, #355b47 12px 22px, transparent 22px 42px)",
            transform: `translateX(-${(score * 4) % 420}px)`,
          }}
        />
        <div
          className="absolute left-0 right-0 h-[2px] bg-ink/75"
          style={{ bottom: runnerMetrics.groundOffset }}
        />

        {obstacles.map((obstacle) => (
          <div
            key={obstacle.id}
            className="absolute flex items-center justify-center whitespace-nowrap rounded-sm border border-brand/30 bg-white px-2 text-[10px] font-semibold leading-tight tracking-[0.01em] text-brand shadow-[0_2px_6px_rgba(0,0,0,0.1)]"
            style={{
              left: obstacle.x,
              width: obstacle.width,
              height: obstacle.height,
              bottom: runnerMetrics.groundOffset,
            }}
          >
            {obstacle.label}
          </div>
        ))}

        <div
          className="absolute will-change-transform"
          style={{
            left: runnerMetrics.x,
            width: runnerMetrics.width,
            height: runnerMetrics.height,
            bottom: runnerMetrics.groundOffset + runnerY,
          }}
        >
          <Image
            src="/brand/skip-roo.png"
            alt="Skip Roo jumping runner"
            fill
            sizes="(max-width: 560px) 44px, 54px"
            className="object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
            priority
          />
        </div>

        {status !== "running" && (
          <div className="pointer-events-none absolute inset-x-0 top-4 px-3 text-center sm:top-6">
            <p className="text-xs font-semibold text-ink/80 sm:text-sm">
              {status === "ready" ? "Jump to start" : "Game over - jump to restart"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
