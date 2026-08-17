// ReviewScreen — loads diff for a pending version; renders metadata + DiffView + action bar.
// C3/C4: 403 on diff() shown as a permission banner — no crash.
// base===null → DiffView renders "first version" preview.
// Action bar (Approve/Reject) only rendered when canApprove=true.
// Visual: full-frame frosted panels, antd Buttons, framer-motion entrances.

import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { diff as fetchDiff, approve } from './api/promptApi';
import type { PromptDiff } from './types';
import DiffView from './components/DiffView';
import RejectModal from './components/RejectModal';
import { StateBadge, MetaRow, SpinnerRow, ErrorBanner } from './components/ReviewShared';
import { Reveal, StaggerList, StaggerItem } from './components/motion-primitives';
import { CARD_BASE, SURFACE_GLASS } from '../../theme/surfaces';
import { fadeInUp, hoverPress } from '../../theme/motion';

interface ReviewScreenProps {
  versionId: number;
  canApprove: boolean;
  onBack: () => void;
  onActionComplete: () => void;
}

type ScreenState = 'loading' | 'error' | 'forbidden' | 'ready';

// ---- Back button ---------------------------------------------------------------
const BackBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.button {...hoverPress} onClick={onClick}
    className="rounded-xl p-1.5 text-ah-muted transition-colors hover:bg-ah-pale hover:text-ah-ink"
    aria-label="Quay lại">
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
  </motion.button>
);

// ---- Metadata panel (staggered rows) ------------------------------------------
const MetaPanel: React.FC<{ meta: PromptDiff['metadata'] }> = ({ meta }) => (
  <motion.div variants={fadeInUp} initial="hidden" animate="show" className={`${CARD_BASE} px-5 py-4`}>
    <StaggerList>
      <div className="flex flex-col gap-2.5">
        {meta.code && (
          <StaggerItem><MetaRow label="Code" value={<span className="font-mono text-[13px]">{meta.code}</span>} /></StaggerItem>
        )}
        <StaggerItem><MetaRow label="Category" value={meta.category} /></StaggerItem>
        {meta.tags.length > 0 && (
          <StaggerItem>
            <MetaRow label="Tags" value={
              <div className="flex flex-wrap gap-1">
                {meta.tags.map((t) => (
                  <span key={t} className="rounded-full border border-ah-line bg-ah-card px-2 py-0.5 text-[11px] text-ah-muted">{t}</span>
                ))}
              </div>
            } />
          </StaggerItem>
        )}
        <StaggerItem><MetaRow label="Submitted by" value={meta.submitted_by_email ?? `#${meta.submitted_by}`} /></StaggerItem>
        <StaggerItem><MetaRow label="Submitted at" value={new Date(meta.submitted_at).toLocaleString('vi-VN')} /></StaggerItem>
        {meta.changelog_note && (
          <StaggerItem><MetaRow label="Changelog" value={<span className="italic">{meta.changelog_note}</span>} /></StaggerItem>
        )}
      </div>
    </StaggerList>
  </motion.div>
);

// ---- Action bar (approve/reject antd Buttons) ---------------------------------
interface ActionBarProps {
  approving: boolean;
  approveError: string | null;
  onApprove: () => void;
  onReject: () => void;
}
const ActionBar: React.FC<ActionBarProps> = ({ approving, approveError, onApprove, onReject }) => (
  <motion.div variants={fadeInUp} initial="hidden" animate="show" className={`${SURFACE_GLASS} px-5 py-4`}>
    {approveError && (
      <div className="mb-3 rounded-xl border border-ah-red bg-ah-red-l px-3 py-2.5 text-sm text-ah-red">{approveError}</div>
    )}
    <div className="flex gap-3">
      <Button type="primary" size="large" loading={approving} disabled={approving} onClick={onApprove}>
        {approving ? 'Đang duyệt…' : 'Duyệt'}
      </Button>
      <Button danger size="large" disabled={approving} onClick={onReject}>Từ chối</Button>
    </div>
  </motion.div>
);

// ---- Main component -----------------------------------------------------------

const ReviewScreen: React.FC<ReviewScreenProps> = ({ versionId, canApprove, onBack, onActionComplete }) => {
  const [state, setState] = useState<ScreenState>('loading');
  const [diffData, setDiffData] = useState<PromptDiff | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [approving, setApproving] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setState('loading'); setDiffData(null); setErrorMsg('');
    fetchDiff(versionId)
      .then((data) => { if (!cancelled) { setDiffData(data); setState('ready'); } })
      .catch((err: unknown) => {
        if (cancelled) return;
        const status = (err as any)?.response?.status ?? 0;
        if (status === 403) setState('forbidden');
        else { setErrorMsg((err as any)?.response?.data?.message || (err as Error)?.message || 'Không thể tải diff.'); setState('error'); }
      });
    return () => { cancelled = true; };
  }, [versionId]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleApprove = async () => {
    setApproveError(null); setApproving(true);
    try {
      await approve(versionId);
      showToast('Đã duyệt phiên bản thành công.');
      setTimeout(() => { onActionComplete(); onBack(); }, 1200);
    } catch (err: unknown) {
      const status = (err as any)?.response?.status ?? 0;
      setApproveError(status === 403 ? 'Bạn không có quyền duyệt phiên bản này.' : (err as any)?.response?.data?.message || 'Có lỗi xảy ra khi duyệt.');
    } finally { setApproving(false); }
  };

  const handleRejectSuccess = () => {
    setShowRejectModal(false);
    showToast('Đã từ chối phiên bản.');
    setTimeout(() => { onActionComplete(); onBack(); }, 1200);
  };

  if (state === 'loading') return <SpinnerRow label="Đang tải diff…" />;
  if (state === 'forbidden') return <ErrorBanner message="Bạn không có quyền xem nội dung này." onBack={onBack} />;
  if (state === 'error') return <ErrorBanner message={errorMsg} onBack={onBack} />;

  const meta = diffData!.metadata;
  // Pending version_no is a placeholder sharing the live approved number — never show it bare.
  // First-ever pending → "mới"; a pending update → "v{old_version} · chờ duyệt". Approved shows the
  // finalized number. Matches the version-management + queue labels.
  const versionLabel =
    meta.state === 'pending'
      ? meta.old_version == null
        ? 'mới'
        : `v${meta.old_version} · chờ duyệt`
      : `v${meta.version_no}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Toast — animated in/out */}
      <AnimatePresence>
        {toast && (
          <motion.div key="toast"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-5 right-5 z-40 rounded-2xl border border-ah-green bg-ah-green-l px-4 py-2.5 text-sm font-semibold text-ah-green shadow-ah-glow"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back + title */}
      <Reveal>
        <div className="flex items-center gap-3">
          <BackBtn onClick={onBack} />
          <h2 className="text-base font-bold text-ah-ink">{meta.name} — {versionLabel}</h2>
          <StateBadge state={meta.state} />
        </div>
      </Reveal>

      <MetaPanel meta={meta} />
      <DiffView base={diffData!.base} incoming={diffData!.incoming} />

      {canApprove && (
        <ActionBar
          approving={approving}
          approveError={approveError}
          onApprove={handleApprove}
          onReject={() => setShowRejectModal(true)}
        />
      )}

      {showRejectModal && (
        <RejectModal versionId={versionId} onClose={() => setShowRejectModal(false)} onSuccess={handleRejectSuccess} />
      )}
    </div>
  );
};

export default ReviewScreen;
