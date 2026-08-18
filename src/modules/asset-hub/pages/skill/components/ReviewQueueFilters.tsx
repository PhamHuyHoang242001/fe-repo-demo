// Filter bar for the review queue: creator (submitted_by), category, sort.
// Client-side only — filters/reorders the already-loaded pending queue; the reviews API
// has no filter/sort params (mirrors the published-list sort convention).
//
// Controls are antd Select (themed to ah-* via ConfigProvider); the bar is a full-frame
// frosted panel that fades in on mount.

import React from 'react';
import { motion } from 'framer-motion';
import { SURFACE_GLASS } from '../../../theme/surfaces';
import { fadeInUp } from '../../../theme/motion';
import { Select } from 'antd';
import CategorySelect from '../../../components/CategorySelect';

export type ReviewSortKey = 'newest' | 'oldest' | 'name';

export interface ReviewFilters {
  submittedBy: string; // '' = all; else String(submitted_by)
  categoryId: number | null; // null = all; else category id
  sort: ReviewSortKey;
}

export const DEFAULT_REVIEW_FILTERS: ReviewFilters = { submittedBy: '', categoryId: null, sort: 'newest' };

const SORT_OPTIONS: { value: ReviewSortKey; label: string }[] = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'name', label: 'Tên A→Z' },
];

interface Props {
  filters: ReviewFilters;
  /** Distinct submitters present in the loaded queue — feeds the "Người tạo" filter.
   *  value = numeric id (filter key); label = resolved email (falls back to #id). */
  submitters: Array<{ id: number; email: string | null }>;
  onChange: (next: ReviewFilters) => void;
  count?: number;
}

const ReviewQueueFilters: React.FC<Props> = ({ filters, submitters, onChange, count }) => {
  const set = (patch: Partial<ReviewFilters>) => onChange({ ...filters, ...patch });

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className={`flex flex-wrap items-center gap-2.5 px-4 py-3 ${SURFACE_GLASS}`}
    >
      {/* Người tạo — label shows the submitter email (falls back to #id); value is the numeric id */}
      <Select
        value={filters.submittedBy}
        onChange={(v) => set({ submittedBy: v })}
        className="min-w-[168px]"
        size="large"
        aria-label="Người tạo"
        options={[
          { value: '', label: 'Tất cả người tạo' },
          ...submitters.map((s) => ({ value: String(s.id), label: s.email ?? `#${s.id}` })),
        ]}
        placeholder="Tất cả người tạo"
      />

      {/* Danh mục */}
      <CategorySelect
        type="skill"
        value={filters.categoryId}
        onChange={(v) => set({ categoryId: v })}
        className="min-w-[168px]"
        ariaLabel="Danh mục"
        placeholder="Tất cả danh mục"
      />

      {/* Sắp xếp */}
      <Select<ReviewSortKey>
        value={filters.sort}
        onChange={(v) => set({ sort: v })}
        className="min-w-[148px]"
        size="large"
        aria-label="Sắp xếp"
        options={SORT_OPTIONS}
      />

      {typeof count === 'number' && (
        <span className="ml-auto shrink-0 text-xs text-ah-muted">
          <span className="font-semibold text-ah-ink tabular-nums">{count}</span> skill
        </span>
      )}
    </motion.div>
  );
};

export default ReviewQueueFilters;
