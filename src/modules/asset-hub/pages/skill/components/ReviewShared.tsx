// Shared micro-components for the review queue and review screen.
// Extracted to keep ReviewQueue + ReviewScreen under 200 lines each.
// Visual uplift: full-border badges, framer-motion entrance, animated spinner, framed error banner.

import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, hoverPress } from '../../../theme/motion';
import { CARD_BASE } from '../../../theme/surfaces';

// ---- State badge -------------------------------------------------------
// Single source of truth for skill-version status chips (queue, review screen,
// versions table). Vietnamese label + status dot, all on ah-* tokens.

interface StateMeta { label: string; cls: string; dot: string; pulse?: boolean }

const STATE_META: Record<string, StateMeta> = {
  pending: {
    label: 'Chờ duyệt',
    cls: 'bg-ah-amber-l text-ah-amber border-ah-amber/40',
    dot: 'bg-ah-amber',
    pulse: true,
  },
  approved: {
    label: 'Đã duyệt',
    cls: 'bg-ah-green-l text-ah-green-d border-ah-green/40',
    dot: 'bg-ah-green',
    pulse: false,
  },
  rejected: {
    label: 'Từ chối',
    cls: 'bg-ah-red-l text-ah-red border-ah-red/40',
    dot: 'bg-ah-red',
    pulse: false,
  },
};

export const StateBadge: React.FC<{ state: string }> = ({ state }) => {
  const meta = STATE_META[state] ?? {
    label: state,
    cls: 'bg-ah-pale text-ah-muted border-ah-line',
    dot: 'bg-ah-muted',
    pulse: false,
  };

  return (
    <motion.span
      {...hoverPress}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${meta.cls}`}
    >
      <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
        {meta.pulse && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${meta.dot}`} />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      </span>
      {meta.label}
    </motion.span>
  );
};

// ---- Metadata row -------------------------------------------------------

interface MetaRowProps { label: string; value: React.ReactNode }
export const MetaRow: React.FC<MetaRowProps> = ({ label, value }) => (
  <div className="flex gap-2 text-sm">
    <span className="w-32 shrink-0 font-semibold text-ah-muted">{label}</span>
    <span className="text-ah-ink">{value}</span>
  </div>
);

// ---- Spinner row (loading state) ----------------------------------------

export const SpinnerRow: React.FC<{ label?: string }> = ({ label = 'Đang tải…' }) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    animate="show"
    className="flex h-40 flex-col items-center justify-center gap-3"
  >
    {/* Double-ring spinner — outer ring + inner spinning segment */}
    <span className="relative flex h-8 w-8 items-center justify-center">
      <span className="absolute inset-0 rounded-full border-2 border-ah-line" />
      <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-ah-green" />
    </span>
    <span className="text-sm font-medium text-ah-muted">{label}</span>
  </motion.div>
);

// ---- Error / forbidden row (framed banner) ------------------------------

interface FeedbackBannerProps { message: string; onBack?: () => void }
export const ErrorBanner: React.FC<FeedbackBannerProps> = ({ message, onBack }) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    animate="show"
    className={`flex flex-col items-center justify-center gap-4 px-6 py-10 ${CARD_BASE} border-ah-red/30 bg-ah-red-l/30`}
  >
    {/* Icon */}
    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ah-red/30 bg-ah-red-l text-ah-red text-lg font-bold">
      !
    </span>
    <p className="text-sm font-medium text-ah-red">{message}</p>
    {onBack && (
      <motion.button
        {...hoverPress}
        onClick={onBack}
        className="rounded-xl border border-ah-line bg-ah-card px-5 py-2 text-sm font-semibold text-ah-ink shadow-ah-float transition-colors hover:border-ah-green/50 hover:text-ah-green-d"
      >
        ← Quay lại
      </motion.button>
    )}
  </motion.div>
);
