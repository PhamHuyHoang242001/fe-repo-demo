// Tab: Chờ duyệt — review queue + embedded ReviewScreen.
// OVERWRITES Phase 3 placeholder (spec Phase 6).
//
// Scope gating:
//   canApprove=true  → scope toggle (Tất cả | Của tôi) shown; default='all'.
//   canApprove=false → scope forced 'mine'; no toggle. BE enforces this regardless.
//
// C3/C4: 403 from reviews() shown as inline banner — no crash.
// No import from src/pages/* or src/hooks/* (H4).

import React, { useState, useEffect, useCallback } from 'react';
import { reviews } from '../api/skillApi';
import type { SkillVersion } from '../types';
import { useSkillPermissions } from '../hooks/useSkillPermissions';
import ReviewScreen from '../ReviewScreen';
import { StateBadge, SpinnerRow, ErrorBanner } from '../components/ReviewShared';

type Scope = 'all' | 'mine';

// ---- Queue row ---------------------------------------------------------------

const QueueRow: React.FC<{ version: SkillVersion; onClick: () => void }> = ({ version, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left flex items-center justify-between gap-4 rounded-lg border border-ah-line bg-ah-card px-4 py-3 hover:border-ah-green hover:bg-ah-green-l transition-colors"
  >
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-sm font-semibold text-ah-ink truncate">{version.name}</span>
      <span className="text-[12px] text-ah-muted">
        v{version.version_no} · #{version.submitted_by} · {new Date(version.created_at).toLocaleDateString('vi-VN')}
      </span>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <StateBadge state={version.state} />
      <svg className="h-4 w-4 text-ah-muted" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    </div>
  </button>
);

// ---- Queue list (with scope toggle) ----------------------------------------

interface QueueListProps {
  canApprove: boolean;
  onSelectVersion: (id: number) => void;
  refreshTick: number;
}

const QueueList: React.FC<QueueListProps> = ({ canApprove, onSelectVersion, refreshTick }) => {
  const [scope, setScope] = useState<Scope>(canApprove ? 'all' : 'mine');
  const [items, setItems] = useState<SkillVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const effectiveScope: Scope = canApprove ? scope : 'mine';

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setForbidden(false); setErrorMsg(null);

    reviews({ scope: effectiveScope, limit: 50 })
      .then((res) => { if (!cancelled) { setItems(res.data); setLoading(false); } })
      .catch((err: unknown) => {
        if (cancelled) return;
        const status = (err as any)?.response?.status ?? 0;
        if (status === 403) setForbidden(true);
        else setErrorMsg((err as any)?.response?.data?.message || (err as Error)?.message || 'Không thể tải danh sách.');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [effectiveScope, refreshTick]);

  return (
    <div className="flex flex-col gap-3">
      {/* Scope toggle — approver only */}
      {canApprove && (
        <div className="flex gap-1 rounded-lg border border-ah-line bg-ah-pale p-1 self-start">
          {(['all', 'mine'] as Scope[]).map((s) => (
            <button key={s} onClick={() => setScope(s)}
              className={['px-3 py-1 rounded-md text-sm font-semibold transition-colors', scope === s ? 'bg-ah-green text-white shadow' : 'text-ah-muted hover:text-ah-ink'].join(' ')}>
              {s === 'all' ? 'Tất cả' : 'Của tôi'}
            </button>
          ))}
        </div>
      )}

      {loading && <SpinnerRow />}

      {!loading && forbidden && <ErrorBanner message="Bạn không có quyền xem nội dung này." />}
      {!loading && errorMsg && <ErrorBanner message={errorMsg} />}

      {!loading && !forbidden && !errorMsg && items.length === 0 && (
        <div className="flex h-32 items-center justify-center text-sm text-ah-muted">
          Không có phiên bản nào đang chờ duyệt.
        </div>
      )}

      {!loading && !forbidden && !errorMsg && items.map((v) => (
        <QueueRow key={v.id} version={v} onClick={() => onSelectVersion(v.id)} />
      ))}
    </div>
  );
};

// ---- Root: owns selection state + refetch tick ------------------------------

const ReviewQueue: React.FC = () => {
  const { data: perms, loading: permsLoading } = useSkillPermissions();
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const canApprove = perms?.canApprove ?? false;
  const handleActionComplete = useCallback(() => setRefreshTick((n) => n + 1), []);

  if (permsLoading) return <SpinnerRow />;

  if (selectedVersionId !== null) {
    return (
      <ReviewScreen
        versionId={selectedVersionId}
        canApprove={canApprove}
        onBack={() => setSelectedVersionId(null)}
        onActionComplete={handleActionComplete}
      />
    );
  }

  return (
    <QueueList canApprove={canApprove} onSelectVersion={setSelectedVersionId} refreshTick={refreshTick} />
  );
};

export default ReviewQueue;
