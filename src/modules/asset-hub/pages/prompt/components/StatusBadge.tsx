// Package-level visibility badge (active / inactive) for the detail hero.
// Distinct from ReviewShared.StateBadge, which covers VERSION states
// (pending/approved/rejected). Rendered on the gradient hero → light-on-dark variant.
// Full-border, rounded-full, animated pulse dot for "active" state.

import React from 'react';
import { motion } from 'framer-motion';
import { hoverPress } from '../../../theme/motion';

interface StatusBadgeProps {
  status: 'active' | 'inactive';
}

const META: Record<StatusBadgeProps['status'], { label: string; cls: string; dot: string; pulse: boolean }> = {
  active: {
    label: 'Đang hiển thị',
    cls: 'bg-white/15 text-white ring-1 ring-white/30 border border-white/20',
    dot: 'bg-ah-green-l',
    pulse: true,
  },
  inactive: {
    label: 'Đã ẩn',
    cls: 'bg-white/10 text-white/75 ring-1 ring-white/20 border border-white/15',
    dot: 'bg-white/50',
    pulse: false,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const m = META[status];
  return (
    <motion.span
      {...hoverPress}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm ${m.cls}`}
    >
      {/* Dot — pulsing ring for active state */}
      <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
        {m.pulse && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ah-green-l opacity-60" />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${m.dot}`} />
      </span>
      {m.label}
    </motion.span>
  );
};
