# Component Style Guide

## Purpose
This file defines baseline UI conventions for the marketing site so new sections remain consistent, accessible, and conversion-focused.

## Tokens and Utilities
- Use `section-shell` for standard content width and horizontal padding.
- Use `section-y` for regular section spacing and `section-y-lg` for large feature sections.
- Use `section-heading` for major section titles.
- Use `measure-copy` for long body text blocks.
- Use `skeleton` for temporary loading placeholders.

## CTA Patterns
- Primary CTA style: `Button` with `variant="brand"` or `variant="mint"`.
- Every primary CTA block should include trust microcopy:
  - `ACL XXXXXX`
  - `48 hours typical response`
  - `Privacy-first data handling`
- On mobile, keep the sticky bottom apply CTA visible (`MobileStickyCta`).

## Accessibility
- Keep semantic heading order (`h1` once, section titles as `h2`, nested titles as `h3`).
- Ensure interactive elements are keyboard reachable and show visible focus.
- Respect reduced-motion users:
  - Wrap page motion in `MotionConfig reducedMotion="user"`.
  - Avoid essential information conveyed by animation alone.

## Motion
- Default easing: `MOTION_EASE = [0.22, 1, 0.36, 1]`.
- Use subtle movement for emphasis only; avoid constant motion loops for critical content.

## Footer IA
- Keep footer grouped into:
  - Product links
  - Compliance details
  - Legal and contact

## Metadata
- Update `app/layout.tsx` metadata whenever headline positioning changes:
  - `title`, `description`
  - Open Graph and Twitter image references
  - Canonical URL

## Code Organization
- Keep repeated content in top-level constants.
- Prefer small reusable UI helpers (for example `TrustMicrocopy`) instead of duplicate markup.
- Avoid dead/commented JSX in page components.
