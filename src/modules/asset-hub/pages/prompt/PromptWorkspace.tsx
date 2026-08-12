// Prompt Package workspace — tabbed shell with animated pill tab bar.
//
// Tab visibility (role gating):
//   "Danh sách"      — always visible (view open to all authenticated users)
//   "My Prompt"       — visible when canUpload (the caller's own prompts, all statuses)
//   "Chờ phê duyệt"  — visible when canApprove only (all pending versions)
// Upload is NOT a tab — it's a header button (canUpload) → /asset-hub/prompt/upload.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { usePromptPermissions } from './hooks/usePromptPermissions';
import { list as listPrompts, reviews as listReviews, myPrompts as listMyPrompts } from './api/promptApi';
import PublishedList from './tabs/PublishedList';
import ReviewQueue from './tabs/ReviewQueue';
import MyPrompts from './tabs/MyPrompts';
import PromptTabBar, { type TabKey } from './components/PromptTabBar';
import { fadeInUp, springSnappy } from '../../theme/motion';
import { SURFACE_HERO } from '../../theme/surfaces';

// ---- Panel transition variants -----------------------------------------------

const panelVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } },
};

// ---- Sub-components ----------------------------------------------------------

const LoadingState: React.FC = () => (
  <div className="flex h-full items-center justify-center gap-3">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-ah-line border-t-ah-green" />
    <span className="text-sm text-ah-muted">Đang tải quyền hạn…</span>
  </div>
);

const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="flex h-full flex-col items-center justify-center gap-3">
    <p className="text-sm text-ah-red">{message}</p>
    <button
      onClick={onRetry}
      className="rounded-xl bg-ah-green px-5 py-2 text-sm font-bold text-white shadow transition-colors hover:bg-ah-green-d"
    >
      Thử lại
    </button>
  </div>
);

// ---- Main component ----------------------------------------------------------

const PromptPackage: React.FC = () => {
  const navigate = useNavigate();
  const { data: perms, loading, error, refetch } = usePromptPermissions();
  const [activeTab, setActiveTab] = useState<TabKey>('list');
  const [counts, setCounts] = useState<{ list?: number; mine?: number; review?: number }>({});

  const canUpload = perms?.canUpload ?? false;
  const canApprove = perms?.canApprove ?? false;

  // Lightweight tab-count badges: read meta.total with limit=1 (tiny payload).
  // Failures swallowed — badge simply omitted.
  useEffect(() => {
    if (loading || error) return;
    let cancelled = false;
    listPrompts({ limit: 1 })
      .then((r) => !cancelled && setCounts((c) => ({ ...c, list: r.meta.total })))
      .catch(() => {});
    if (canUpload) {
      // my-items is bucketed by latest-version state; use the approved bucket for the badge count.
      listMyPrompts({ status: 'approved', limit: 1 })
        .then((r) => !cancelled && setCounts((c) => ({ ...c, mine: r.meta.total })))
        .catch(() => {});
    }
    if (canApprove) {
      listReviews({ scope: 'all', limit: 1 })
        .then((r) => !cancelled && setCounts((c) => ({ ...c, review: r.meta.total })))
        .catch(() => {});
    }
    return () => { cancelled = true; };
  }, [loading, error, canApprove, canUpload]);

  const header = (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className="mb-5 flex items-start justify-between gap-4"
    >
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ah-muted">
          Tài sản ứng dụng › Prompt
        </div>
        <h1 className="mt-1.5 text-[22px] font-extrabold leading-tight tracking-tight text-ah-green-d">
          Prompt Package
        </h1>
        <p className="mt-1 text-[13px] leading-relaxed text-ah-muted">
          Duyệt, chia sẻ và quản lý các gói prompt dùng chung trong tổ chức.
        </p>
      </div>
      {canUpload && (
        <motion.button
          type="button"
          onClick={() => navigate('/asset-hub/prompt/upload')}
          whileHover={{ y: -2, transition: springSnappy }}
          whileTap={{ scale: 0.97 }}
          className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-ah-float transition-shadow hover:shadow-ah-glow ${SURFACE_HERO}`}
        >
          + Upload prompt
        </motion.button>
      )}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        {header}
        <div className="flex flex-1 rounded-2xl border border-ah-line bg-ah-card shadow-ah-float">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col">
        {header}
        <div className="flex flex-1 rounded-2xl border border-ah-line bg-ah-card shadow-ah-float">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  // perms guaranteed non-null when !loading && !error
  const tabs = [
    { key: 'list' as TabKey, label: 'Danh sách', count: counts.list, panel: <PublishedList /> },
    ...(canUpload ? [{ key: 'mine' as TabKey, label: 'My Prompt', count: counts.mine, panel: <MyPrompts /> }] : []),
    ...(canApprove
      ? [{ key: 'review' as TabKey, label: 'Chờ phê duyệt', count: counts.review, panel: <ReviewQueue /> }]
      : []),
  ];

  // Reset to 'list' if active tab no longer visible after perms load.
  const visibleKeys = tabs.map((t) => t.key);
  const resolvedActive = visibleKeys.includes(activeTab) ? activeTab : 'list';
  const activePanel = tabs.find((t) => t.key === resolvedActive)?.panel;

  return (
    <div className="flex h-full flex-col">
      {header}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.08 }}
        className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-ah-line bg-ah-card shadow-ah-float"
      >
        <PromptTabBar
          tabs={tabs.map(({ key, label, count }) => ({ key, label, count }))}
          active={resolvedActive}
          onChange={setActiveTab}
        />
        <div className="flex-1 overflow-auto p-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={resolvedActive}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {activePanel}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PromptPackage;
