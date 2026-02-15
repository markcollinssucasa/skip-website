"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  House,
  Lock,
  Menu,
  ShieldCheck,
  Star,
  TrendingDown,
  User,
  Users,
  X,
} from "lucide-react";

import { SkipLogo } from "@/components/brand/skip-logo";
import { SkipLogoPressButton } from "@/components/brand/skip-logo-press-button";
import { SkipToOwningBitHeading } from "@/components/brand/skip-to-owning-bit-heading";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  domAnimation,
  LazyMotion,
  m,
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

interface SharedOptionHeroImage {
  src: string;
  alt: string;
  objectPosition?: string;
}

export interface MainPageProps {
  heroImage: SharedOptionHeroImage;
}

type RateMode = "purchase" | "refinance";

interface RateRow {
  effective: string;
  comparison: string;
  subtitle: string;
}

interface RateCard {
  title: string;
  description: string;
  rates: Record<RateMode, RateRow>;
}

const RATE_CARDS: RateCard[] = [
  {
    title: "Owner Occupied",
    description: "For your home",
    rates: {
      purchase: { effective: "6.30", comparison: "6.63", subtitle: "New purchase" },
      refinance: { effective: "6.12", comparison: "6.44", subtitle: "Refinance" },
    },
  },
  {
    title: "Investment",
    description: "For portfolio growth",
    rates: {
      purchase: { effective: "6.65", comparison: "6.95", subtitle: "New purchase" },
      refinance: { effective: "6.49", comparison: "6.82", subtitle: "Refinance" },
    },
  },
];

const COMPARISON_ROWS = [
  { label: "Deposit required", bank: "20%", skip: "2%", highlight: true },
  { label: "On a $1M property", bank: "$200,000", skip: "$20,000", highlight: true },
  { label: "Time to save deposit", bank: "8-10 years", skip: "Start now", highlight: false },
  { label: "Loan process", bank: "Bank process", skip: "Bank process", highlight: false },
];

const SOCIAL_PROOF = [
  { icon: Star, value: "$850M+", label: "Settled nationally" },
  { icon: Users, value: "3,000+", label: "Families supported" },
  { icon: Clock, value: "48 hrs", label: "Typical response" },
];

const SKIP_TO_CARDS = [
  {
    title: "My own home",
    description: "Stop renting sooner with a smaller upfront hurdle.",
    imageSrc: "/skip-owning-home.png",
    imageAlt: "Kangaroo relaxing in a living room",
  },
  {
    title: "A larger place",
    description: "Upgrade when life changes, not years later.",
    imageSrc: "/skip-larger-place.png",
    imageAlt: "Kangaroo mowing a yard in front of a larger home",
  },
  {
    title: "An investment property",
    description: "Enter the market with less cash tied up in deposit.",
    imageSrc: "/skip-investment-property.png",
    imageAlt: "Kangaroo at sunset representing investment goals",
  },
];

const STORIES = [
  {
    quote:
      "We were planning to wait another four years. Skip changed our timeline and we purchased in six months.",
    name: "Mia & Jordan",
    location: "Melbourne VIC",
  },
  {
    quote:
      "Felt like a modern private-banking experience: clear, fast, and brutally practical about what mattered.",
    name: "Amir K.",
    location: "Sydney NSW",
  },
  {
    quote:
      "The numbers were transparent from day one. No theatre, no surprises, just a path that actually worked.",
    name: "Sophie L.",
    location: "Brisbane QLD",
  },
];

const FIRST_HOME_BUYER_ROWS = [
  {
    label: "Deposit",
    firstHomeBuyer: "5%",
    skip: "2%",
  },
  {
    label: "Property price",
    firstHomeBuyer: "Caps limit your choice",
    skip: "No caps",
  },
  {
    label: "Flexibility",
    firstHomeBuyer: "You may owe money if you sell",
    skip: "You can do what you want",
  },
  {
    label: "Available to",
    firstHomeBuyer: "Only first home buyers",
    skip: "Everyone",
  },
  {
    label: "Deposit rules",
    firstHomeBuyer: "Must use all your money",
    skip: "No restrictions",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Apply online",
    description: "Quick 10-minute guided application. Tell us about your goals.",
  },
  {
    number: "02",
    title: "Get pre-approved",
    description: "A specialist reviews your scenario within 48 hours.",
  },
  {
    number: "03",
    title: "Find your property",
    description: "Search with confidence knowing your funding path.",
  },
  {
    number: "04",
    title: "Settle and move in",
    description: "Complete settlement and collect your keys.",
  },
];

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Licensed Australian lender",
    description: "Compliance-led process with full regulatory oversight.",
  },
  {
    icon: Lock,
    title: "Bank-grade security",
    description: "End-to-end encryption for all application data.",
  },
  {
    icon: Building2,
    title: "Human support",
    description: "Australian based team from pre-approval through settlement.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is this a real home loan?",
    answer:
      "Yes. Skip home loans follow standard lending checks, documentation requirements, and legal protections. We are a licensed Australian lender.",
  },
  {
    question: "Who is this best for?",
    answer:
      "Buyers who can service a mortgage but are blocked by a traditional 20% deposit requirement. First-home buyers, upgraders, and investors.",
  },
  {
    question: "How quickly can I apply?",
    answer:
      "You can start online in minutes. A specialist then guides you through your full application with typical pre-approval in 48 hours.",
  },
  {
    question: "Can I use this for investment properties?",
    answer:
      "Yes. Investment pricing and eligibility are available depending on your profile and property details.",
  },
  {
    question: "What makes Skip different from a bank?",
    answer:
      "The lending process is the same — documentation, checks, compliance. The difference is we accept a 2% deposit instead of 20%, getting you into property sooner.",
  },
];

const REVIEW_CARDS = [
  {
    quote:
      "We thought we were years away from owning. Skip got us in far sooner than we imagined.",
    name: "Alicia & Tom",
    location: "Inner West NSW",
    rating: 5,
  },
  {
    quote:
      "The process felt structured and clear from start to finish. No surprises, no hidden fees.",
    name: "Nadia R.",
    location: "Brisbane QLD",
    rating: 5,
  },
  {
    quote:
      "Small deposit, solid support, and fast responses when timing mattered most.",
    name: "Chris P.",
    location: "Geelong VIC",
    rating: 5,
  },
];

/* ------------------------------------------------------------------ */
/*  Utility                                                            */
/* ------------------------------------------------------------------ */

function formatK(value: number) {
  return `${(value / 1000).toFixed(0)}k`;
}

function useScrollThreshold(getThreshold: () => number) {
  const [crossed, setCrossed] = useState(false);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const threshold = getThreshold();
      const next = window.scrollY > threshold;
      setCrossed((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [getThreshold]);

  return crossed;
}

function RenderBoundary({
  children,
  intrinsicSize = "1200px",
}: {
  children: React.ReactNode;
  intrinsicSize?: string;
}) {
  return (
    <div style={{ contentVisibility: "auto", containIntrinsicSize: intrinsicSize }}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated section wrapper                                           */
/* ------------------------------------------------------------------ */

function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: MOTION_EASE }}
      className={className}
    >
      {children}
    </m.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

interface NavDropdownItem {
  label: string;
  href: string;
  description?: string;
}

interface NavItem {
  label: string;
  href?: string;
  children?: NavDropdownItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home Loans",
    children: [
      { label: "Owner Occupied", href: "#rates", description: "Low deposit loans for your home" },
      { label: "Investment", href: "#rates", description: "Grow your property portfolio" },
      { label: "Refinance", href: "#rates", description: "Switch and save on your rate" },
      { label: "First Home Buyers", href: "#rates", description: "Skip the 20% deposit barrier" },
    ],
  },
  { label: "Rates", href: "#rates" },
  {
    label: "Resources",
    children: [
      { label: "Calculator", href: "#calculator", description: "See what your savings can buy" },
      { label: "How it works", href: "#how-it-works", description: "Four steps to your keys" },
      { label: "FAQ", href: "#faq", description: "Common questions answered" },
    ],
  },
  { label: "About", href: "#faq" },
];

function DesktopDropdown({
  items,
  scrolled,
}: {
  items: NavDropdownItem[];
  scrolled: boolean;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100",
      )}
    >
      <div
        className={cn(
          "w-64 overflow-hidden rounded-2xl border p-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)]",
          scrolled
            ? "border-brand/10 bg-white"
            : "border-white/15 bg-brand-dark/95 backdrop-blur-xl",
        )}
      >
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "block rounded-xl px-3.5 py-2.5 transition-colors",
              scrolled
                ? "hover:bg-mint/10"
                : "hover:bg-white/10",
            )}
          >
            <span
              className={cn(
                "block text-sm font-semibold",
                scrolled ? "text-brand" : "text-white",
              )}
            >
              {item.label}
            </span>
            {item.description && (
              <span
                className={cn(
                  "mt-0.5 block text-xs leading-relaxed",
                  scrolled ? "text-ink/50" : "text-white/55",
                )}
              >
                {item.description}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
  onCtaClick,
}: {
  open: boolean;
  onClose: () => void;
  onCtaClick?: (e: React.MouseEvent) => void;
}) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setTimeout(() => {
        setExpandedGroup(null);
      }, 300);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-brand-dark/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-[61] w-full max-w-sm transform bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Close button */}
        <div className="flex h-16 items-center justify-between border-b border-brand/8 px-5">
          <span className="text-sm font-semibold text-brand">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand/6 text-brand transition-colors hover:bg-brand/12"
            aria-label="Close menu"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedGroup === item.label;

              return (
                <li key={item.label}>
                  {hasChildren ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedGroup(isExpanded ? null : item.label)
                        }
                        className="flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-[0.95rem] font-semibold text-brand transition-colors hover:bg-mint/8"
                        aria-expanded={isExpanded}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-brand/40 transition-transform duration-200",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          "grid transition-all duration-200",
                          isExpanded
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <div className="overflow-hidden">
                          <ul className="space-y-0.5 pb-2 pl-3 pt-1">
                            {item.children!.map((child) => (
                              <li key={child.label}>
                                <a
                                  href={child.href}
                                  onClick={onClose}
                                  className="block rounded-lg px-3.5 py-2.5 transition-colors hover:bg-mint/8"
                                >
                                  <span className="block text-sm font-medium text-brand">
                                    {child.label}
                                  </span>
                                  {child.description && (
                                    <span className="mt-0.5 block text-xs text-ink/45">
                                      {child.description}
                                    </span>
                                  )}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : (
                    <a
                      href={item.href}
                      onClick={onClose}
                      className="block rounded-xl px-3.5 py-3 text-[0.95rem] font-semibold text-brand transition-colors hover:bg-mint/8"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-brand/8 px-5 py-5 space-y-3">
          <a
            href="#"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full rounded-full gap-2",
            )}
          >
            <User className="h-4 w-4" />
            Log in
          </a>
          <a
            href="https://apply.skiploans.com.au/"
            onClick={(e) => {
              onClose();
              onCtaClick?.(e);
            }}
            className={cn(
              buttonVariants({ variant: "brand", size: "lg" }),
              "w-full rounded-full",
            )}
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </>,
    document.body,
  );
}

function StickyHeader({ onCtaClick }: { onCtaClick?: (e: React.MouseEvent) => void }) {
  const scrolled = useScrollThreshold(useCallback(() => 40, []));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.08)] backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-[4.5rem] md:px-8">
          {/* Logo */}
          <SkipLogoPressButton
            className="h-8"
            aria-label="Skip home"
          />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 text-[0.82rem] font-medium lg:flex">
            {NAV_ITEMS.map((item) => {
              const hasChildren = item.children && item.children.length > 0;

              return hasChildren ? (
                <div key={item.label} className="group relative">
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3.5 py-2 transition-colors",
                      scrolled
                        ? "text-ink/70 hover:bg-brand/5 hover:text-brand"
                        : "text-white/80 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3 w-3 opacity-60 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  <DesktopDropdown items={item.children!} scrolled={scrolled} />
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 transition-colors",
                    scrolled
                      ? "text-ink/70 hover:bg-brand/5 hover:text-brand"
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="#"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.82rem] font-medium transition-colors",
                scrolled
                  ? "text-brand hover:bg-brand/5"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              <User className="h-3.5 w-3.5" />
              Log in
            </a>
            <a
              href="https://apply.skiploans.com.au/"
              onClick={onCtaClick}
              className={cn(
                buttonVariants({ variant: scrolled ? "brand" : "mint", size: "sm" }),
                "rounded-full px-5 text-[0.82rem]",
              )}
            >
              Get started
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </a>
          </div>

          {/* Mobile: login + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="#"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                scrolled
                  ? "text-brand hover:bg-brand/5"
                  : "text-white/80 hover:bg-white/10",
              )}
              aria-label="Log in"
            >
              <User className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                scrolled
                  ? "text-brand hover:bg-brand/5"
                  : "text-white/80 hover:bg-white/10",
              )}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onCtaClick={onCtaClick}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero({
  heroImage,
  onCtaClick,
}: {
  heroImage: SharedOptionHeroImage;
  onCtaClick?: (e: React.MouseEvent) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-brand"
    >
      {/* Background image */}
      <m.div
        style={shouldReduceMotion ? undefined : { scale }}
        className="absolute inset-0"
      >
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={75}
          className="object-cover"
          style={{ objectPosition: heroImage.objectPosition ?? "center 35%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b md:from-brand/20 md:via-brand/20 md:to-brand/90  from-brand/0 via-brand/40 to-brand/90" />
        <div className="absolute inset-0 bg-gradient-to-r md:from-brand/60 md:via-brand/20 md:to-brand/40 from-brand/20 via-brand/20 to-brand/20" />
      </m.div>

      {/* Content */}
      <m.div
        style={shouldReduceMotion ? undefined : { opacity }}
        className="relative z-10 w-full"
      >
        <div className="mx-auto max-w-7xl px-5 pb-8 pt-28 md:px-8 md:pb-16 md:pt-40 lg:pb-20">
          <div className="max-w-2xl space-y-4 md:space-y-6">
            <m.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: MOTION_EASE }}
            >
              <SkipToOwningBitHeading
                className="text-[2.8rem] leading-[0.95] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-7xl"
                logoVariant={1}
                logoClassName=""
                textClassName="text-white"
                lineTwo="owning bit."
                priorityLogo
              />
            </m.div>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: MOTION_EASE }}
              className="text-xl tracking-tight text-white/90 md:text-2xl"
            >
              2% Deposit Home Loans.
              <br className="hidden sm:block" />
                Same process. Same security. 10x less deposit.
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: MOTION_EASE }}
              className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center"
            >
              <m.a
                href="https://apply.skiploans.com.au/"
                onClick={onCtaClick}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { scale: 1.03, boxShadow: "0 20px 50px rgba(121,200,155,0.45)" }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                className={cn(
                  buttonVariants({ variant: "mint", size: "xl" }),
                  "group text-brand-dark font-semibold shadow-2xl",
                )}
              >
                Start your application
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </m.a>
              <m.a
                href="#calculator"
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { scale: 1.03, backgroundColor: "rgba(255,255,255,0.18)" }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                className={cn(
                  buttonVariants({ variant: "glass", size: "xl" }),
                  "border-2 shadow-xl",
                )}
              >
                See what you can afford
              </m.a>
            </m.div>
          </div>

          {/* Social proof bar — compact on mobile, cards on md+ */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: MOTION_EASE }}
            className="mt-8 md:mt-14"
          >
            {/* Mobile: single row of values (hidden on short viewports) */}
            <div className="hero-social-mobile flex items-center gap-3 rounded-2xl border border-white/15 bg-white/8 px-4 py-3 backdrop-blur-md md:hidden">
              {SOCIAL_PROOF.map((item, i) => (
                <div key={item.label} className="flex items-center gap-3">
                  {i > 0 && <span className="h-4 w-px bg-white/20" />}
                  <div className="text-center">
                    <p className="text-sm font-semibold leading-tight text-white">
                      {item.value}
                    </p>
                    <p className="text-[0.6rem] uppercase tracking-[0.1em] text-white/55">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: full cards */}
            <div className="hidden gap-3 md:flex">
              {SOCIAL_PROOF.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/8 px-4 py-3 backdrop-blur-md"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-mint/20">
                      <Icon className="h-4 w-4 text-mint" />
                    </span>
                    <div>
                      <p className="text-lg font-semibold leading-tight tracking-tight text-white">
                        {item.value}
                      </p>
                      <p className="text-[0.7rem] uppercase tracking-[0.12em] text-white/60">
                        {item.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </m.div>
        </div>
      </m.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Trust strip (below hero)                                           */
/* ------------------------------------------------------------------ */

function TrustStrip() {
  return (
    <section className="border-b border-brand/8 bg-white">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid divide-y divide-brand/8 md:grid-cols-3 md:divide-x md:divide-y-0">
          {TRUST_PILLARS.map((item) => {
            const Icon = item.icon;
            return (
              <AnimatedSection key={item.title}>
                <div className="flex items-start gap-4 py-7 md:px-6 md:py-9">
                  <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint/15 text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[0.92rem] font-semibold text-brand">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink/60">
                      {item.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Value proposition (Skip vs Banks)                                  */
/* ------------------------------------------------------------------ */

function ValuePropSection() {
  return (
    <section className="section-y-lg bg-canvas">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Left: copy */}
          <AnimatedSection>
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/55">
                Why Skip
              </p>
              <h2 className="font-display max-w-[16ch] text-4xl tracking-[-0.025em] text-brand md:text-5xl lg:text-6xl">
                Stop saving. Start owning.
              </h2>
              <p className="max-w-[52ch] text-base leading-relaxed text-ink/65 md:text-lg">
                If you can service a mortgage but can&rsquo;t reach a 20% deposit, Skip
                removes the biggest barrier between you and your home &mdash; while
                keeping every lending protection in place.
              </p>

              <div className="flex items-center gap-4 pt-2">
                <div className="rounded-2xl border border-brand/10 bg-white px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-ink/50">
                    Traditional
                  </p>
                  <p className="mt-1 font-display text-3xl tracking-tight text-ink/40 line-through decoration-red-400/60 decoration-2">
                    $200k
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-brand/40" />
                <div className="rounded-2xl border border-mint/40 bg-mint/12 px-5 py-4 shadow-[0_8px_30px_-12px_rgba(121,200,155,0.5)]">
                  <p className="text-xs uppercase tracking-[0.14em] text-brand/70">
                    With Skip
                  </p>
                  <p className="mt-1 font-display text-3xl tracking-tight text-brand">
                    $20k
                  </p>
                </div>
              </div>
              <p className="text-sm text-ink/50">
                Based on a $1M property. You save $180,000 upfront.
              </p>
            </div>
          </AnimatedSection>

          {/* Right: comparison table */}
          <AnimatedSection delay={0.15}>
            <Card className="overflow-hidden rounded-[1.75rem] border-brand/12 bg-white shadow-[0_24px_60px_-24px_rgba(31,86,58,0.2)]">
              <CardContent className="p-0">
                <div className="grid grid-cols-3 bg-gradient-to-br from-brand to-brand-dark px-6 py-5 text-white">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                    &nbsp;
                  </span>
                  <span className="text-center text-sm font-medium text-white/70">
                    Traditional
                  </span>
                  <span className="text-center text-sm font-semibold text-mint">
                    Skip
                  </span>
                </div>
                {COMPARISON_ROWS.map((row) => (
                  <div
                    key={row.label}
                    className={cn(
                      "grid grid-cols-3 items-center border-t border-brand/6 px-6 py-4",
                      row.highlight && "bg-mint/5",
                    )}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/50">
                      {row.label}
                    </p>
                    <p className="text-center text-sm text-ink/45">{row.bank}</p>
                    <p className="text-center text-sm font-semibold text-brand">
                      {row.skip}
                    </p>
                  </div>
                ))}
                <div className="border-t border-brand/8 bg-gradient-to-r from-mint/15 to-mint/5 px-6 py-4">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
                    <TrendingDown className="h-4 w-4" />
                    $180,000 less upfront on a $1M home.
                  </p>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  First Home Buyer Constraint                                        */
/* ------------------------------------------------------------------ */

function FirstHomeBuyerConstraintSection({ onCtaClick }: { onCtaClick?: (e: React.MouseEvent) => void }) {
  return (
    <section className="section-y relative overflow-hidden border-t border-brand/8 bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(121,200,155,0.14),transparent_42%)]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <AnimatedSection>
          <div className="mb-10 space-y-3 text-center md:mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/55">
              Compare
            </p>
            <h2 className="mx-auto max-w-[22ch] font-display text-4xl tracking-[-0.025em] text-brand md:text-5xl lg:text-6xl">
              Better than the First Home Buyer Scheme
            </h2>
            <p className="mx-auto max-w-[50ch] text-base leading-relaxed text-ink/60">
              Government schemes come with strings attached. Skip gives you
              freedom from day one.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedSection>
            <Card className="h-full rounded-[1.75rem] border-brand/8 bg-canvas/60">
              <CardContent className="p-0">
                <div className="flex items-center justify-between border-b border-brand/8 px-6 py-5">
                  <h3 className="font-display text-xl tracking-[-0.02em] text-ink md:text-2xl">
                    First Home Buyer Scheme
                  </h3>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-500/70">
                    <X className="h-5 w-5" />
                  </span>
                </div>
                <dl className="divide-y divide-brand/6">
                  {FIRST_HOME_BUYER_ROWS.map((row) => (
                    <div key={`fhb-${row.label}`} className="flex items-start gap-3 px-6 py-4">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                        <X className="h-3 w-3 text-red-500/70" />
                      </span>
                      <div className="space-y-1">
                        <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink/45">
                          {row.label}
                        </dt>
                        <dd className="text-[0.95rem] font-medium text-ink/70 md:text-base">
                          {row.firstHomeBuyer}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.12}>
            <Card className="h-full rounded-[1.75rem] border-mint/30 bg-gradient-to-b from-mint/15 to-mint/8 shadow-refined">
              <CardContent className="p-0">
                <div className="flex items-center justify-between border-b border-brand/12 px-6 py-5">
                  <h3 className="font-display text-xl tracking-[-0.02em] text-brand md:text-2xl">
                    Skip
                  </h3>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
                    <Check className="h-5 w-5" />
                  </span>
                </div>
                <dl className="divide-y divide-brand/8">
                  {FIRST_HOME_BUYER_ROWS.map((row) => (
                    <div key={`skip-${row.label}`} className="flex items-start gap-3 px-6 py-4">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint/30">
                        <Check className="h-3 w-3 text-brand" />
                      </span>
                      <div className="space-y-1">
                        <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand/55">
                          {row.label}
                        </dt>
                        <dd className="text-[0.95rem] font-semibold text-brand md:text-base">
                          {row.skip}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.2}>
          <div className="mt-8 text-center">
            <a
              href="https://apply.skiploans.com.au/"
              onClick={onCtaClick}
              className={cn(
                buttonVariants({ variant: "brand", size: "lg" }),
                "rounded-full px-8",
              )}
            >
              Skip the restrictions
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Rates section                                                      */
/* ------------------------------------------------------------------ */

function RatesSection({ onCtaClick }: { onCtaClick?: (e: React.MouseEvent) => void }) {
  const [mode, setMode] = useState<RateMode>("purchase");

  return (
    <section id="rates" className="section-y border-y border-brand/8 bg-white">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <AnimatedSection>
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/55">
                Pricing
              </p>
              <h2 className="font-display text-4xl tracking-[-0.025em] text-brand md:text-5xl lg:text-6xl">
                Transparent rates
              </h2>
              <p className="max-w-[52ch] text-base leading-relaxed text-ink/60">
                No hidden fees. No surprises. See exactly what you&rsquo;ll pay from
                day one.
              </p>
            </div>
            <div className="flex w-full max-w-[18rem] rounded-full border border-brand/15 bg-canvas p-1">
              <button
                type="button"
                onClick={() => setMode("purchase")}
                className={cn(
                  "w-1/2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all",
                  mode === "purchase"
                    ? "bg-brand text-white shadow-sm"
                    : "text-brand/60 hover:text-brand",
                )}
                aria-pressed={mode === "purchase"}
              >
                Purchase
              </button>
              <button
                type="button"
                onClick={() => setMode("refinance")}
                className={cn(
                  "w-1/2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all",
                  mode === "refinance"
                    ? "bg-brand text-white shadow-sm"
                    : "text-brand/60 hover:text-brand",
                )}
                aria-pressed={mode === "refinance"}
              >
                Refinance
              </button>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid gap-5 lg:grid-cols-2">
          {RATE_CARDS.map((card, i) => {
            const row = card.rates[mode];
            return (
              <AnimatedSection key={card.title} delay={i * 0.1}>
                <Card className="h-full rounded-[1.75rem] border-brand/10 bg-gradient-to-br from-white via-white to-mint/8 transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(31,86,58,0.15)]">
                  <CardContent className="space-y-6 p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand/50">
                          {row.subtitle}
                        </p>
                        <h3 className="mt-1.5 font-display text-2xl tracking-[-0.02em] text-brand md:text-3xl">
                          {card.title}
                        </h3>
                        <p className="mt-1 text-sm text-ink/55">{card.description}</p>
                      </div>
                      <span className="rounded-full bg-brand/6 px-3 py-1 text-xs font-semibold text-brand">
                        P&I
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-brand/10 bg-white px-4 py-4">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-ink/45">
                          Effective rate
                        </p>
                        <p className="mt-2 font-display text-4xl leading-none tracking-[-0.04em] text-brand md:text-5xl">
                          {row.effective}
                        </p>
                        <p className="mt-1 text-sm text-ink/55">% p.a.</p>
                      </div>
                      <div className="rounded-2xl border border-brand/10 bg-white px-4 py-4">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-ink/45">
                          Comparison rate
                        </p>
                        <p className="mt-2 font-display text-4xl leading-none tracking-[-0.04em] text-brand md:text-5xl">
                          {row.comparison}
                        </p>
                        <p className="mt-1 text-sm text-ink/55">% p.a.</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href="https://apply.skiploans.com.au/"
                        onClick={onCtaClick}
                        className={cn(
                          buttonVariants({ variant: "brand", size: "lg" }),
                          "rounded-full px-6",
                        )}
                      >
                        Apply now
                        <ChevronRight className="h-4 w-4" />
                      </a>
                      <a
                        href="#faq"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-brand/70 hover:text-brand"
                      >
                        Eligibility
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Calculator                                                         */
/* ------------------------------------------------------------------ */

function CalculatorSection({ onCtaClick }: { onCtaClick?: (e: React.MouseEvent) => void }) {
  const [deposit, setDeposit] = useState(20000);
  const propertyValue = deposit * 50;
  const stampDuty = propertyValue * 0.04;
  const totalUpfront = deposit + stampDuty;

  return (
    <section id="calculator" className="section-y-lg bg-canvas">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <AnimatedSection>
          <div className="mb-10 space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/55">
              Calculator
            </p>
            <h2 className="mx-auto max-w-[20ch] font-display text-4xl tracking-[-0.025em] text-brand md:text-5xl lg:text-6xl">
              See what your savings can buy
            </h2>
            <p className="mx-auto max-w-[50ch] text-base text-ink/55">
              Slide to adjust your deposit and see your estimated purchasing power instantly.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              {/* Deposit input */}
              <Card className="rounded-[1.75rem] border-brand/10 bg-white shadow-[0_8px_30px_-12px_rgba(31,86,58,0.1)]">
                <CardContent className="space-y-6 p-6 md:p-7">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/50">
                      Your deposit
                    </p>
                    <p className="mt-2 font-display text-5xl leading-none tracking-[-0.04em] text-brand md:text-6xl">
                      ${formatK(deposit)}
                    </p>
                  </div>
                  <div>
                    <input
                      type="range"
                      min={5000}
                      max={100000}
                      step={1000}
                      value={deposit}
                      onChange={(e) => setDeposit(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-brand/15 accent-brand"
                      aria-label="Deposit amount"
                    />
                    <div className="mt-2 flex justify-between text-xs text-ink/40">
                      <span>$5k</span>
                      <span>$100k</span>
                    </div>
                  </div>
                  <div className="space-y-3 border-t border-brand/8 pt-5">
                    <CalcRow label="Your deposit (2%)" value={`$${formatK(deposit)}`} />
                    <CalcRow
                      label="Est. stamp duty"
                      value={`$${formatK(stampDuty)}`}
                    />
                    <CalcRow
                      label="Est. total upfront"
                      value={`$${formatK(totalUpfront)}`}
                      bold
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Property value output */}
              <Card className="relative overflow-hidden rounded-[1.75rem] border-none bg-gradient-to-br from-brand via-brand-mid to-brand text-white shadow-[0_24px_60px_-24px_rgba(31,86,58,0.5)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(121,200,155,0.3),transparent_45%)]" />
                <CardContent className="relative flex h-full flex-col justify-between gap-6 p-6 md:p-8">
                  <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/75 backdrop-blur-sm">
                    <House className="h-3.5 w-3.5" />
                    Estimated property value
                  </p>
                  <div>
                    <p className="font-display text-6xl leading-none tracking-[-0.045em] md:text-7xl lg:text-8xl">
                      ${(propertyValue / 1000000).toFixed(2)}M
                    </p>
                    <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-white/65">
                      Based on a 2% deposit ratio. Final amount depends on your full
                      application profile and eligibility.
                    </p>
                  </div>
                  <a
                    href="https://apply.skiploans.com.au/"
                    onClick={onCtaClick}
                    className={cn(
                      buttonVariants({ variant: "mint", size: "lg" }),
                      "w-fit rounded-full px-7 text-brand-dark font-semibold",
                    )}
                  >
                    Get pre-approved
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function CalcRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-ink/50">{label}</span>
      <span className={cn("text-brand", bold ? "text-base font-bold" : "font-semibold")}>
        {value}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  How it works                                                       */
/* ------------------------------------------------------------------ */

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-y-lg border-t border-brand/8 bg-white">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <AnimatedSection>
          <div className="mb-12 max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/55">
              How it works
            </p>
            <h2 className="font-display text-4xl tracking-[-0.025em] text-brand md:text-5xl lg:text-6xl">
              Four steps to your keys
            </h2>
            <p className="text-base leading-relaxed text-ink/60 md:text-lg">
              The same rigorous lending process as a bank &mdash; but with a faster,
              more modern experience.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, i) => (
            <AnimatedSection key={step.number} delay={i * 0.08}>
              <Card className="group h-full rounded-2xl border-brand/8 bg-canvas/60 transition-all hover:border-mint/30 hover:shadow-[0_12px_30px_-12px_rgba(121,200,155,0.25)]">
                <CardContent className="space-y-3 p-5 md:p-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white transition-colors group-hover:bg-mint group-hover:text-brand">
                    <span className="font-display text-xl">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-brand">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-ink/55">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Skip to... (journey cards)                                         */
/* ------------------------------------------------------------------ */

function JourneySection() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="section-y bg-canvas">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <AnimatedSection>
          <div className="mb-10 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/55">
              Skip to&hellip;
            </p>
            <h2 className="font-display text-4xl tracking-[-0.025em] text-brand md:text-5xl lg:text-6xl">
              Your next chapter
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid gap-6 md:grid-cols-3">
          {SKIP_TO_CARDS.map((item, index) => (
            <AnimatedSection key={item.title} delay={0.1 + index * 0.1}>
              <div className="group relative overflow-hidden rounded-[2rem] bg-ink">
                <div className="relative h-[420px] overflow-hidden">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="font-display text-3xl tracking-tight text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
                  <a href="#apply" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-mint transition-colors hover:text-mint/80">
                    Learn more <ArrowRight className="size-3.5" />
                  </a>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
        
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Social proof / Reviews                                             */
/* ------------------------------------------------------------------ */

function ReviewsSection() {
  return (
    <section className="section-y border-y border-brand/8 bg-white">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <AnimatedSection>
          <div className="mb-10 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/55">
              Reviews
            </p>
            <h2 className="font-display text-4xl tracking-[-0.025em] text-brand md:text-5xl lg:text-6xl">
              Trusted by buyers across Australia
            </h2>
          </div>
        </AnimatedSection>

        {/* Featured testimonial */}
        <AnimatedSection delay={0.1}>
          <Card className="mb-6 overflow-hidden rounded-[1.75rem] border-none bg-gradient-to-br from-brand via-brand-mid to-brand-dark text-white shadow-[0_24px_60px_-24px_rgba(31,86,58,0.5)]">
            <CardContent className="relative p-8 md:p-10 lg:p-12">
              <div className="absolute right-6 top-6 text-[8rem] leading-none text-white/5 md:right-10 md:top-8">
                &ldquo;
              </div>
              <div className="relative">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-mint text-mint"
                    />
                  ))}
                </div>
                <blockquote className="max-w-[30ch] font-display text-3xl leading-[1.05] tracking-[-0.02em] md:text-4xl lg:text-5xl">
                  We thought we were years away from owning. Skip got us in far
                  sooner.
                </blockquote>
                <p className="mt-5 text-sm text-white/70 md:text-base">
                  Alicia & Tom, Inner West NSW
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Review cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {REVIEW_CARDS.map((review, i) => (
            <AnimatedSection key={review.name} delay={0.15 + i * 0.08}>
              <Card className="h-full rounded-2xl border-brand/8 bg-canvas/60">
                <CardContent className="flex h-full flex-col justify-between gap-4 p-5 md:p-6">
                  <div>
                    <div className="mb-3 flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="h-3.5 w-3.5 fill-brand/80 text-brand/80"
                        />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-ink/70">
                      &ldquo;{review.quote}&rdquo;
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand">{review.name}</p>
                    <p className="text-xs text-ink/45">{review.location}</p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

function FAQSection({ onCtaClick }: { onCtaClick?: (e: React.MouseEvent) => void }) {
  return (
    <section id="faq" className="section-y bg-canvas">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <AnimatedSection>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/55">
                FAQ
              </p>
              <h2 className="font-display max-w-[12ch] text-4xl tracking-[-0.025em] text-brand md:text-5xl lg:text-6xl">
                Questions, answered.
              </h2>
              <p className="max-w-[48ch] text-base leading-relaxed text-ink/60 md:text-lg">
                Everything you need to know before applying. Still have questions?
                Our team is ready to help.
              </p>
              <a
                href="https://apply.skiploans.com.au/"
                onClick={onCtaClick}
                className="group mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand"
              >
                Talk to a specialist
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-brand/10 bg-white p-5 transition-colors open:border-brand/25 open:bg-white md:p-6"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[0.95rem] font-semibold text-brand md:text-base">
                    {item.question}
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mint/15 text-sm text-brand transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60 md:text-[0.92rem]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Final CTA                                                          */
/* ------------------------------------------------------------------ */

function FinalCTA({ onCtaClick }: { onCtaClick?: (e: React.MouseEvent) => void }) {
  return (
    <section id="apply" className="mx-auto max-w-7xl px-5 pb-14 md:px-8 md:pb-20">
      <AnimatedSection>
        <Card className="relative overflow-hidden rounded-[1.75rem] border-none bg-gradient-to-br from-brand via-brand-mid to-brand-dark text-white shadow-[0_32px_80px_-32px_rgba(31,86,58,0.65)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(121,200,155,0.35),transparent_45%)]" />
          <CardContent className="relative flex flex-col items-center gap-7 p-8 text-center md:p-12 lg:p-16">
            <SkipLogo variant={1} className="h-10 md:h-12" />
            <h2 className="max-w-[18ch] font-display text-3xl leading-[0.98] tracking-[-0.025em] md:text-5xl lg:text-6xl">
              Ready to skip to the owning bit?
            </h2>
            <p className="max-w-[50ch] text-base leading-relaxed text-white/75 md:text-lg">
              Start with a quick application and get clarity on your borrowing path.
              Our team guides every step.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/80">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-mint" />
                10-minute application
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-mint" />
                Response in 48 hours
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-mint" />
                Licensed Australian lender
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="https://apply.skiploans.com.au/"
                className={cn(
                  buttonVariants({ variant: "mint", size: "lg" }),
                  "rounded-full px-8 text-brand-dark font-semibold shadow-[0_12px_30px_-8px_rgba(121,200,155,0.5)]",
                )}
                onClick={onCtaClick}
              >
                Start my application
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#calculator"
                className={cn(
                  buttonVariants({ variant: "glass", size: "lg" }),
                  "rounded-full border-white/25 px-8",
                )}
              >
                Calculate first
              </a>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Marquee strip                                                      */
/* ------------------------------------------------------------------ */

function MarqueeStrip() {
  return (
    <section className="overflow-hidden border-y border-brand/10 bg-mint/20 py-3">
      <div className="marquee-track flex min-w-max items-center gap-10 text-xs font-semibold uppercase tracking-[0.2em] text-brand md:text-sm">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 whitespace-nowrap"
          >
            <Check className="h-3.5 w-3.5" />
            2% Deposit Home Loans
          </span>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-brand to-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-18">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <SkipLogo variant={1} className="h-9" />
            <p className="max-w-[46ch] text-sm leading-relaxed text-white/65">
              Skip Financial Pty Ltd ACN XXX XXX XXX. Australian Credit Licence
              XXXXXX. General information only. Consider your circumstances before
              proceeding.
            </p>
          </div>
          <FooterLinks
            title="Product"
            links={[
              { label: "Rates", href: "#rates" },
              { label: "Calculator", href: "#calculator" },
              { label: "How it works", href: "#how-it-works" },
              { label: "FAQ", href: "#faq" },
            ]}
          />
          <FooterLinks
            title="Compliance"
            links={[
              { label: "Responsible lending", href: "#" },
              { label: "Security controls", href: "#" },
              { label: "Privacy policy", href: "#" },
              { label: "Credit guide", href: "#" },
            ]}
          />
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
              Contact
            </p>
            <ul className="space-y-2 text-sm text-white/65">
              <li>support@skip.com.au</li>
              <li>1300 000 000</li>
              <li>Mon-Fri, 9am-5pm AEST</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/12 pt-5 text-xs text-white/45">
          <p>&copy; 2026 Skip Financial. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
        {title}
      </p>
      <ul className="space-y-2 text-sm text-white/65">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="transition-colors hover:text-mint">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile sticky CTA                                                  */
/* ------------------------------------------------------------------ */

function MobileStickyCTA({ onCtaClick }: { onCtaClick?: (e: React.MouseEvent) => void }) {
  const visible = useScrollThreshold(useCallback(() => window.innerHeight * 0.6, []));

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-brand/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] backdrop-blur-xl md:hidden">
      <a
        href="https://apply.skiploans.com.au/"
        onClick={onCtaClick}
        className={cn(
          buttonVariants({ variant: "mint", size: "lg" }),
          "w-full rounded-full text-brand-dark font-semibold",
        )}
      >
        Start your application
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Roo hop animation (no deposit block) for CTA buttons               */
/* ------------------------------------------------------------------ */

function useRooHopAnimation() {
  const [phase, setPhase] = useState<"idle" | "intro" | "hop" | "outro">("idle");
  const running = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((id) => clearTimeout(id)), []);

  const trigger = useCallback((onComplete?: () => void) => {
    if (running.current) return;
    running.current = true;
    setPhase("intro");
    timers.current = [
      window.setTimeout(() => setPhase("hop"), 140),
      window.setTimeout(() => setPhase("outro"), 620),
      window.setTimeout(() => {
        setPhase("idle");
        running.current = false;
        onComplete?.();
      }, 860),
    ];
  }, []);

  return { trigger, phase };
}

function RooHopOverlay({ phase }: { phase: "idle" | "intro" | "hop" | "outro" }) {
  const visible = phase !== "idle";
  const showRoo = phase === "hop" || phase === "outro";
  const overlayOn = phase === "intro" || phase === "hop";

  if (!visible || typeof document === "undefined") return null;

  return createPortal(
    <div className={cn("skip-overlay", overlayOn && "skip-overlay-on")} aria-hidden="true">
      <div className="skip-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={cn("skip-roo", showRoo && "skip-roo-hop")}
          src="/brand/skip-roo.png"
          alt=""
          role="presentation"
          draggable={false}
        />
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const APPLY_URL = "https://apply.skiploans.com.au/";

export function MainPage({ heroImage }: MainPageProps) {
  const { trigger: triggerRoo, phase: rooPhase } = useRooHopAnimation();

  /* Preload the application page so navigation feels instant */
  useEffect(() => {
    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = "https://apply.skiploans.com.au";
    document.head.appendChild(preconnect);

    const dnsPrefetch = document.createElement("link");
    dnsPrefetch.rel = "dns-prefetch";
    dnsPrefetch.href = "https://apply.skiploans.com.au";
    document.head.appendChild(dnsPrefetch);

    const prefetch = document.createElement("link");
    prefetch.rel = "prefetch";
    prefetch.href = APPLY_URL;
    prefetch.as = "document";
    document.head.appendChild(prefetch);

    return () => {
      document.head.removeChild(preconnect);
      document.head.removeChild(dnsPrefetch);
      document.head.removeChild(prefetch);
    };
  }, []);

  const handleCtaClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      triggerRoo(() => {
        window.location.href = APPLY_URL;
      });
    },
    [triggerRoo],
  );

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <main className="bg-canvas text-ink">
          <StickyHeader onCtaClick={handleCtaClick} />
          <Hero heroImage={heroImage} onCtaClick={handleCtaClick} />
          <TrustStrip />
          <ValuePropSection />

          <RenderBoundary intrinsicSize="1050px">
            <RatesSection onCtaClick={handleCtaClick} />
          </RenderBoundary>
          <RenderBoundary intrinsicSize="980px">
            <CalculatorSection onCtaClick={handleCtaClick} />
          </RenderBoundary>
          <RenderBoundary intrinsicSize="980px">
            <FirstHomeBuyerConstraintSection onCtaClick={handleCtaClick} />
          </RenderBoundary>
          <RenderBoundary intrinsicSize="860px">
            <HowItWorksSection />
          </RenderBoundary>
          <RenderBoundary intrinsicSize="980px">
            <JourneySection />
          </RenderBoundary>
          <RenderBoundary intrinsicSize="1120px">
            <ReviewsSection />
          </RenderBoundary>
          <RenderBoundary intrinsicSize="940px">
            <FAQSection onCtaClick={handleCtaClick} />
          </RenderBoundary>
          <RenderBoundary intrinsicSize="760px">
            <FinalCTA onCtaClick={handleCtaClick} />
          </RenderBoundary>
          <RenderBoundary intrinsicSize="90px">
            <MarqueeStrip />
          </RenderBoundary>
          <RenderBoundary intrinsicSize="520px">
            <Footer />
          </RenderBoundary>
          <MobileStickyCTA onCtaClick={handleCtaClick} />
          <RooHopOverlay phase={rooPhase} />

          <style jsx global>{`
            .marquee-track {
              animation: skip-marquee 30s linear infinite;
            }
            @keyframes skip-marquee {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }

            /* Hide mobile social proof on short viewports */
            @media (max-height: 780px) {
              .hero-social-mobile {
                display: none !important;
              }
            }

          `}</style>
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}
