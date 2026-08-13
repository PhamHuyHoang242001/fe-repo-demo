// Tab: Chờ duyệt — review queue linking to the standalone version detail route.
//
// Always loads the FULL pending queue (scope='all'); no tabs. The BE forces submitted_by=me
// for non-approvers, so this stays safe for both roles. Creator / category / sort filters are
// applied client-side over the loaded page (the reviews API has no filter/sort params).
//
// A 403 from reviews() is shown as an inline banner — no crash.
// No import from src/pages/* or src/hooks/* (H4).

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { reviews } from '../api/skillApi';
import type { SkillVersion } from '../types';
import { StateBadge, SpinnerRow, ErrorBanner } from '../components/ReviewShared';
import ReviewQueueFilters, { DEFAULT_REVIEW_FILTERS, type ReviewFilters } from '../components/ReviewQueueFilters';
import { StaggerList, StaggerItem } from '../components/motion-primitives';
import { fadeInUp, springSnappy } from '../../../theme/motion';
import { HOVER_GLOW } from '../../../theme/surfaces';

// ---- Queue row ---------------------------------------------------------------

const QueueRow: React.FC<{ version: SkillVersion; onClick: () => void }> = ({ version, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ x: 4, transition: springSnappy }}
    whileTap={{ scale: 0.985 }}
    className={`w-full text-left flex items-center justify-between gap-4 rounded-2xl border border-ah-line bg-ah-card px-4 py-3.5 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ah-green/60 ${HOVER_GLOW}`}
  >
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-sm font-bold text-ah-ink truncate">{version.name}</span>
      <span className="text-[12px] text-ah-muted">
        {version.old_version == null ? 'mới' : `v${version.old_version} · chờ duyệt`} ·{' '}
        {version.submitted_by_email ?? `#${version.submitted_by}`} ·{' '}
        {new Date(version.created_at).toLocaleDateString('vi-VN')}
      </span>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <StateBadge state={version.state} />
      <svg className="h-4 w-4 text-ah-muted" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </motion.button>
);

// ---- Empty state (queue-specific) --------------------------------------------

const QueueEmptyState: React.FC<{ text: string }> = ({ text }) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    animate="show"
    className="flex flex-col items-center justify-center rounded-2xl bg-ah-mist py-16 text-center"
  >
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-ah-line bg-ah-card shadow-ah-float">
      <svg className="h-6 w-6 text-ah-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <p className="mt-4 text-sm font-bold text-ah-ink">Không có kết quả</p>
    <p className="mt-1.5 text-xs text-ah-muted">{text}</p>
  </motion.div>
);

// ---- Queue list (with client-side filters) ----------------------------------

interface QueueListProps {
  onSelectVersion: (id: number) => void;
  refreshTick: number;
}

const QueueList: React.FC<QueueListProps> = ({ onSelectVersion, refreshTick }) => {
  const [items, setItems] = useState<SkillVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReviewFilters>(DEFAULT_REVIEW_FILTERS);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setForbidden(false);
    setErrorMsg(null);

    // Load the full pending queue; BE forces submitted_by=me for non-approvers.
    reviews({ scope: 'all', limit: 100 })
      .then((res) => {
        if (!cancelled) {
          setItems(res.data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const apiError = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
        const status = apiError.response?.status ?? 0;
        if (status === 403) setForbidden(true);
        else setErrorMsg(apiError.response?.data?.message || apiError.message || 'Không thể tải danh sách.');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshTick]);

  // Distinct creators present in the loaded queue (ascending) — feeds the "Người tạo" filter.
  // Carries the resolved email per id so the dropdown labels show email; value stays the numeric id.
  const submitters = useMemo(() => {
    const byId = new Map<number, string | null>();
    for (const v of items) if (!byId.has(v.submitted_by)) byId.set(v.submitted_by, v.submitted_by_email ?? null);
    return Array.from(byId, ([id, email]) => ({ id, email })).sort((a, b) => a.id - b.id);
  }, [items]);

  // Apply creator/category filters, then sort — all client-side over the loaded page.
  const visible = useMemo(() => {
    const arr = items.filter(
      (v) =>
        (!filters.category || v.category === filters.category) &&
        (!filters.submittedBy || String(v.submitted_by) === filters.submittedBy),
    );
    arr.sort((a, b) => {
      if (filters.sort === 'name') return a.name.localeCompare(b.name, 'vi');
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return filters.sort === 'oldest' ? da - db : db - da;
    });
    return arr;
  }, [items, filters]);

  const showEmpty = !loading && !forbidden && !errorMsg && visible.length === 0;
  const emptyText = items.length === 0 ? 'Không có phiên bản nào đang chờ duyệt.' : 'Không có kết quả phù hợp bộ lọc.';

  return (
    <div className="flex flex-col gap-3">
      <ReviewQueueFilters filters={filters} submitters={submitters} onChange={setFilters} count={visible.length} />

      {loading && <SpinnerRow />}

      {!loading && forbidden && <ErrorBanner message="Bạn không có quyền xem nội dung này." />}
      {!loading && errorMsg && <ErrorBanner message={errorMsg} />}

      {showEmpty && <QueueEmptyState text={emptyText} />}

      {!loading && !forbidden && !errorMsg && visible.length > 0 && (
        <StaggerList className="flex flex-col gap-2">
          {visible.map((v) => (
            <StaggerItem key={v.id}>
              <QueueRow version={v} onClick={() => onSelectVersion(v.id)} />
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  );
};

// ---- Root: owns selection state + refetch tick ------------------------------

const ReviewQueue: React.FC = () => {
  const navigate = useNavigate();
  return (
    <QueueList
      onSelectVersion={(id) => navigate(`/asset-hub/skill/versions/${id}`, { state: { fromVersionList: true } })}
      refreshTick={0}
    />
  );
};

export default ReviewQueue;
