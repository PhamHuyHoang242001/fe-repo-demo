// Composite Tailwind class recipes for the asset-hub "modern bold" skill UI.
// CANONICAL tokens live in `tailwind.config.js` (colors ah-*, shadow ah-glow*/ah-float,
// bg-ah-hero, animation ah-shimmer). This file COMPOSES those into reusable class strings so
// hero/glass/card/field recipes are spelled once and reused identically across screens. No hex here.
//
// Border policy: panels use a FULL frame (all four sides + rounded), never a half `border-b`.

import type { CSSProperties } from 'react';

/** Brand / hero band: forest gradient + light text. Pair with `animate-ah-shimmer` overlay if wanted. */
export const SURFACE_HERO = 'bg-ah-hero text-white';

/** Frosted panel: translucent card + blur + FULL hairline frame + soft float shadow. */
export const SURFACE_GLASS =
  'bg-ah-card/75 backdrop-blur-xl border border-ah-line rounded-2xl shadow-ah-float';

/** Resting card — full frame, soft float. Bold treatments live on hover (see HOVER_GLOW). */
export const CARD_BASE = 'rounded-2xl border border-ah-line bg-ah-card shadow-ah-float';

/** Elevated/feature card — full frame + a faint inner top-light ring for depth. */
export const CARD_ELEVATED =
  'rounded-2xl border border-ah-line bg-ah-card shadow-ah-glow ring-1 ring-inset ring-white/50';

/** Hover recipe for interactive cards: green frame + glow. Motion (lift) handled by framer-motion. */
export const HOVER_GLOW =
  'transition-colors duration-200 hover:border-ah-green/60 hover:shadow-ah-glow';

/** Gradient-border overlay for interactive cards. Absolutely-positioned ring painted with the
 *  brand gradient, revealed on parent `group` hover. Uses the mask-composite trick: a full-size
 *  gradient layer minus a content-box layer leaves only the `p-[1.5px]` frame visible.
 *  Host must be `group relative overflow-hidden rounded-2xl`; overlay inherits that radius.
 *  The mask itself must be applied via GRADIENT_BORDER_MASK (inline style) — see its note. */
export const GRADIENT_BORDER_HOVER =
  'pointer-events-none absolute inset-0 z-10 rounded-2xl p-[1.5px] opacity-0 ' +
  'bg-ah-border-glow transition-opacity duration-200 group-hover:opacity-100';

/** Inline mask for GRADIENT_BORDER_HOVER — MUST stay inline, not Tailwind utilities.
 *  The Tailwind `mask` shorthand utility is emitted after the `mask-composite` utility and,
 *  being a shorthand, resets composite back to `add` → the two layers union and the gradient
 *  fills the whole card. Declaring the shorthand first and the composite longhand last within
 *  one inline block keeps `exclude` winning, so only the border ring shows. */
export const GRADIENT_BORDER_MASK: CSSProperties = {
  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  WebkitMaskComposite: 'xor',
  maskComposite: 'exclude',
};

/** Shared field recipe for any remaining Tailwind-native input/select (antd controls are themed
 *  globally via ConfigProvider). Full frame, generous radius, green focus ring. */
export const FIELD_BASE =
  'h-10 rounded-xl border border-ah-line bg-ah-card px-3 text-sm text-ah-ink transition-shadow ' +
  'placeholder:text-ah-muted focus:border-ah-green focus:outline-none focus:ring-2 focus:ring-ah-green/25';
