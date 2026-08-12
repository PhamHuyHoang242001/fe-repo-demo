// Shared framer-motion presets for the asset-hub module. One source of truth so every screen
// animates with the same rhythm/easing (medium-bold: expressive but not dizzying). Respects
// prefers-reduced-motion automatically via framer-motion's `MotionConfig reducedMotion="user"`
// (set once in AssetHubApp), so variants here don't need per-use guards.

import type { Variants, Transition, Easing } from 'framer-motion';

// Signature easing — a soft "back-out" curve shared with the antd theme.
export const AH_EASE: Easing = [0.22, 1, 0.36, 1];

export const springSoft: Transition = { type: 'spring', stiffness: 320, damping: 30, mass: 0.9 };
export const springSnappy: Transition = { type: 'spring', stiffness: 480, damping: 32 };

/** Page/section entrance: fade + rise. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: AH_EASE } },
};

/** Subtle fade only — for text blocks / prose. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35, ease: AH_EASE } },
};

/** Parent that reveals children one-by-one. Pair with `staggerItem`. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

/** Child of `staggerContainer` — rise + fade, springy settle. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: springSoft },
};

/** Scale-in for modals / popovers. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: springSnappy },
  exit: { opacity: 0, scale: 0.96, y: 6, transition: { duration: 0.16, ease: AH_EASE } },
};

/** Reusable hover/tap feedback for interactive cards & tiles. */
export const hoverLift = {
  whileHover: { y: -4, transition: springSnappy },
  whileTap: { scale: 0.985 },
};

/** Reusable hover/tap feedback for buttons/pills. */
export const hoverPress = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.96 },
};
