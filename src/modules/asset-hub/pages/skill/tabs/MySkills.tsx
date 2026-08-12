// Tab: My Skill — the caller's own skills (created_by) across ALL statuses.
// One card per package showing the representative version's identity + a version-state badge and
// the package active/inactive status. Click → detail. No import from src/pages/* or src/hooks/*.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mySkills } from '../api/skillApi';
import type { MySkillItem } from '../types';
import { StateBadge, SpinnerRow, ErrorBanner } from '../components/ReviewShared';
import { StaggerList, StaggerItem } from '../components/motion-primitives';
import { fadeInUp, springSnappy } from '../../../theme/motion';
import { CARD_BASE, HOVER_GLOW } from '../../../theme/surfaces';

const CATEGORY_LABELS: Record<string, string> = {
  general: 'Tổng hợp', 'data-analysis': 'Phân tích', automation: 'Tự động',
  integration: 'Tích hợp', reporting: 'Báo cáo', other: 'Khác',
};

// ---- MyCard ------------------------------------------------------------------

const MyCard: React.FC<{ item: MySkillItem; onClick: () => void }> = ({ item, onClick }) => {
  const v = item.version;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 30, mass: 0.9 } },
      }}
      whileHover={{ y: -4, transition: springSnappy }}
      whileTap={{ scale: 0.985 }}
      className={`flex w-full flex-col gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ah-green ${CARD_BASE} ${HOVER_GLOW}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 flex-1 truncate text-sm font-bold text-ah-ink">
          {v?.name ?? `Skill #${item.id}`}
        </span>
        {item.latest_state && <StateBadge state={item.latest_state} />}
      </div>
      {v && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-ah-green-l px-2 py-0.5 text-[10px] font-bold text-ah-green-d">
              v{v.version_no}
            </span>
            <span className="rounded-lg bg-ah-pale px-2 py-0.5 text-[10px] font-medium text-ah-muted">
              {CATEGORY_LABELS[v.category] ?? v.category}
            </span>
            {item.status === 'inactive' && (
              <span className="rounded-lg bg-ah-pale px-2 py-0.5 text-[10px] font-medium text-ah-muted">Đã ẩn</span>
            )}
          </div>
          <p className="line-clamp-2 text-xs leading-relaxed text-ah-muted">{v.short_description}</p>
        </>
      )}
    </motion.button>
  );
};

// ---- Empty state -------------------------------------------------------------

const EmptyState: React.FC = () => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    animate="show"
    className="flex flex-col items-center justify-center rounded-2xl bg-ah-mist py-20 text-center"
  >
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-ah-line bg-ah-card shadow-ah-float">
      <svg className="h-7 w-7 text-ah-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </div>
    <p className="mt-5 text-sm font-bold text-ah-ink">Bạn chưa tạo skill nào</p>
    <p className="mt-1.5 text-xs text-ah-muted">Upload skill đầu tiên của bạn để bắt đầu.</p>
  </motion.div>
);

// ---- Main component ----------------------------------------------------------

const MySkills: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MySkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErrorMsg(null);
    mySkills({ limit: 50 })
      .then((res) => {
        if (!cancelled) { setItems(res.data); setLoading(false); }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setErrorMsg((err as any)?.response?.data?.message || (err as Error)?.message || 'Không thể tải danh sách.');
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <SpinnerRow />;
  if (errorMsg) return <ErrorBanner message={errorMsg} />;
  if (!items.length) return <EmptyState />;

  return (
    <StaggerList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <StaggerItem key={item.id}>
          <MyCard item={item} onClick={() => navigate(`/asset-hub/skill/${item.id}`)} />
        </StaggerItem>
      ))}
    </StaggerList>
  );
};

export default MySkills;
