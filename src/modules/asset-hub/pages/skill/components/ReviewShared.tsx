// Shared micro-components for the review queue and review screen.
// Extracted to keep ReviewQueue + ReviewScreen under 200 lines each.

import React from 'react';

// ---- State badge -------------------------------------------------------

const STATE_BADGE_STYLES: Record<string, string> = {
  pending: 'bg-ah-amber-l text-ah-amber border-ah-amber',
  approved: 'bg-ah-green-l text-ah-green border-ah-green',
  rejected: 'bg-ah-red-l text-ah-red border-ah-red',
};

export const StateBadge: React.FC<{ state: string }> = ({ state }) => {
  const cls = STATE_BADGE_STYLES[state] ?? 'bg-ah-pale text-ah-muted border-ah-line';
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {state}
    </span>
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
  <div className="flex h-32 items-center justify-center gap-3">
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-ah-line border-t-ah-green" />
    <span className="text-sm text-ah-muted">{label}</span>
  </div>
);

// ---- Error / forbidden row (inline banner) ------------------------------

interface FeedbackBannerProps { message: string; onBack?: () => void }
export const ErrorBanner: React.FC<FeedbackBannerProps> = ({ message, onBack }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-10">
    <p className="text-sm text-ah-red">{message}</p>
    {onBack && (
      <button
        onClick={onBack}
        className="rounded-lg border border-ah-line px-4 py-2 text-sm font-semibold text-ah-ink hover:bg-ah-pale transition-colors"
      >
        ← Quay lại
      </button>
    )}
  </div>
);
