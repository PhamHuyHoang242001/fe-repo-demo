// ReviewScreen — loads diff for a pending version; renders metadata + DiffView + action bar.
// C3/C4: 403 on diff() shown as a permission banner — no crash.
// base===null → DiffView renders "first version" preview.
// Action bar (Approve/Reject) only rendered when canApprove=true.

import React, { useState, useEffect } from 'react';
import { diff as fetchDiff, approve } from './api/skillApi';
import type { SkillDiff } from './types';
import DiffView from './components/DiffView';
import RejectModal from './components/RejectModal';
import { StateBadge, MetaRow, SpinnerRow, ErrorBanner } from './components/ReviewShared';

interface ReviewScreenProps {
  versionId: number;
  canApprove: boolean;
  onBack: () => void;
  onActionComplete: () => void;
}

type ScreenState = 'loading' | 'error' | 'forbidden' | 'ready';

const ReviewScreen: React.FC<ReviewScreenProps> = ({
  versionId, canApprove, onBack, onActionComplete,
}) => {
  const [state, setState] = useState<ScreenState>('loading');
  const [diffData, setDiffData] = useState<SkillDiff | null>(null);
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
        if (status === 403) { setState('forbidden'); }
        else {
          setErrorMsg((err as any)?.response?.data?.message || (err as Error)?.message || 'Không thể tải diff.');
          setState('error');
        }
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

  return (
    <div className="flex flex-col gap-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-40 rounded-lg border border-ah-green bg-ah-green-l px-4 py-2.5 text-sm font-semibold text-ah-green shadow-md">
          {toast}
        </div>
      )}

      {/* Back + title */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="rounded-md p-1 text-ah-muted hover:bg-ah-pale hover:text-ah-ink transition-colors">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-base font-bold text-ah-ink">{meta.name} — v{meta.version_no}</h2>
        <StateBadge state={meta.state} />
      </div>

      {/* Metadata */}
      <div className="rounded-xl border border-ah-line bg-ah-pale px-5 py-4 flex flex-col gap-2">
        <MetaRow label="Category" value={meta.category} />
        {meta.tags.length > 0 && (
          <MetaRow label="Tags" value={
            <div className="flex flex-wrap gap-1">
              {meta.tags.map((t) => (
                <span key={t} className="rounded-full border border-ah-line bg-ah-card px-2 py-0.5 text-[11px] text-ah-muted">{t}</span>
              ))}
            </div>
          } />
        )}
        <MetaRow label="Submitted by" value={`#${meta.submitted_by}`} />
        <MetaRow label="Submitted at" value={new Date(meta.submitted_at).toLocaleString('vi-VN')} />
        {meta.changelog_note && <MetaRow label="Changelog" value={<span className="italic">{meta.changelog_note}</span>} />}
      </div>

      {/* Diff viewer */}
      <DiffView base={diffData!.base} incoming={diffData!.incoming} />

      {/* Action bar — approver only */}
      {canApprove && (
        <div className="flex flex-col gap-2 rounded-xl border border-ah-line bg-ah-pale px-5 py-4">
          {approveError && <div className="rounded-lg border border-ah-red bg-ah-red-l px-3 py-2 text-sm text-ah-red">{approveError}</div>}
          <div className="flex gap-3">
            <button onClick={handleApprove} disabled={approving}
              className="flex items-center gap-2 rounded-lg bg-ah-green px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ah-green-d disabled:cursor-not-allowed disabled:opacity-50">
              {approving && <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
              {approving ? 'Đang duyệt…' : 'Duyệt'}
            </button>
            <button onClick={() => setShowRejectModal(true)} disabled={approving}
              className="rounded-lg border border-ah-red px-5 py-2 text-sm font-semibold text-ah-red transition-colors hover:bg-ah-red-l disabled:cursor-not-allowed disabled:opacity-50">
              Từ chối
            </button>
          </div>
        </div>
      )}

      {showRejectModal && (
        <RejectModal versionId={versionId} onClose={() => setShowRejectModal(false)} onSuccess={handleRejectSuccess} />
      )}
    </div>
  );
};

export default ReviewScreen;
