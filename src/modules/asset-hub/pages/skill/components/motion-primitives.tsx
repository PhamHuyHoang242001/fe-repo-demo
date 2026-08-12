// Reusable framer-motion building blocks for the skill UI. Keeps entrance/stagger/hover
// behaviour identical across every screen. Reduced-motion is honoured globally via the
// <MotionConfig reducedMotion="user"> set in AssetHubApp — no per-component guard needed.

import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem, hoverLift } from '../../../theme/motion';
import { CARD_BASE } from '../../../theme/surfaces';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

/** Fade + rise on mount. Drop-in wrapper for any block that should animate in. */
export const Reveal: React.FC<DivProps & { delay?: number }> = ({ delay = 0, children, ...rest }) => (
  <motion.div variants={fadeInUp} initial="hidden" animate="show" transition={{ delay }} {...(rest as any)}>
    {children}
  </motion.div>
);

/** Stagger parent — children wrapped in <StaggerItem> reveal one-by-one. */
export const StaggerList: React.FC<DivProps> = ({ children, ...rest }) => (
  <motion.div variants={staggerContainer} initial="hidden" animate="show" {...(rest as any)}>
    {children}
  </motion.div>
);

/** Child of <StaggerList>. */
export const StaggerItem: React.FC<DivProps> = ({ children, ...rest }) => (
  <motion.div variants={staggerItem} {...(rest as any)}>
    {children}
  </motion.div>
);

/** Interactive card: full-frame resting surface + hover lift/tap feedback. */
export const MotionCard: React.FC<DivProps & { interactive?: boolean }> = ({
  interactive = true,
  className = '',
  children,
  ...rest
}) => (
  <motion.div
    className={`${CARD_BASE} ${className}`}
    variants={staggerItem}
    {...(interactive ? hoverLift : {})}
    {...(rest as any)}
  >
    {children}
  </motion.div>
);
