// Tab: My Version — flat 1-row-per-version list of the caller's own versions (replaces the old My Skill tab).
//
// Every caller — approver included — sees ONLY versions they created or personally submitted
// (BE-derived own-scope visibility). Multi-select code filter +
// state filter + pagination; newest first. A pending row opens the existing ReviewScreen inline
// (embedded like ReviewQueue — NO route). "mới" badge when is_first_pending; else old→new lineage.
// No import from src/pages/* or src/hooks/*.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, Pagination } from 'antd';
import { listVersions, listVersionCodes } from '../api/skillApi';
import type { VersionRow, VersionStateFilter, VersionCodeOption } from '../types';
import { useSkillPermissions } from '../hooks/useSkillPermissions';
import ReviewScreen from '../ReviewScreen';
import { StateBadge, SpinnerRow, ErrorBanner } from '../components/ReviewShared';
import { StaggerList, StaggerItem } from '../components/motion-primitives';
import { fadeInUp, springSnappy } from '../../../theme/motion';
import { HOVER_GLOW } from '../../../theme/surfaces';

const PAGE_SIZE = 20;
const STATE_OPTIONS: { label: string; value: VersionStateFilter }[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ duyệt', value: 'pending' },
  { label: 'Đã duyệt', value: 'approved' },
  { label: 'Bị từ chối', value: 'rejected' },
];

// Version label: "mới" for a first attempt (no approved predecessor); "v{old} → v{new}" for an
// approved lineage; "v{old} → mới" for an update still pending/rejected (version_no is a placeholder
// sharing the live number, so never shown bare).
function versionLabel(r: VersionRow): string {
  if (r.state === 'approved') return r.old_version != null ? `v${r.old_version} → v${r.version_no}` : `v${r.version_no}`;
  return r.old_version != null ? `v${r.old_version} → mới` : 'mới';
}

// ---- Row ----------------------------------------------------------------------

const VersionRowItem: React.FC<{ row: VersionRow; onOpen: () => void }> = ({ row, onOpen }) => {
  const clickable = row.state === 'pending';
  return (
    <motion.button
      type="button"
      onClick={clickable ? onOpen : undefined}
      whileHover={clickable ? { x: 4, transition: springSnappy } : undefined}
      whileTap={clickable ? { scale: 0.985 } : undefined}
      className={`w-full text-left flex items-center justify-between gap-4 rounded-2xl border border-ah-line bg-ah-card px-4 py-3.5 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ah-green/60 ${clickable ? HOVER_GLOW : 'cursor-default'}`}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-bold text-ah-ink">{row.package_name}</span>
          <span className="shrink-0 rounded-lg bg-ah-pale px-2 py-0.5 font-mono text-[10px] text-ah-muted">{row.code}</span>
        </div>
        <span className="text-[12px] text-ah-muted">
          {row.submitted_by_email ?? '—'} · {new Date(row.created_at).toLocaleDateString('vi-VN')}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {row.is_first_pending ? (
          <span className="rounded-full bg-ah-green-l px-2 py-0.5 text-[10px] font-bold text-ah-green-d">mới</span>
        ) : (
          <span className="rounded-full bg-ah-pale px-2 py-0.5 text-[10px] font-bold tabular-nums text-ah-muted">
            {versionLabel(row)}
          </span>
        )}
        <StateBadge state={row.state} />
      </div>
    </motion.button>
  );
};

// ---- List (filters + pagination) ----------------------------------------------

const VersionList: React.FC<{ onSelectVersion: (id: number) => void; refreshTick: number }> = ({
  onSelectVersion,
  refreshTick,
}) => {
  const [rows, setRows] = useState<VersionRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [stateFilter, setStateFilter] = useState<VersionStateFilter>('all');
  const [selectedPackageIds, setSelectedPackageIds] = useState<number[]>([]);
  const [codeOptions, setCodeOptions] = useState<VersionCodeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load filter options once (and on external refresh) under the same BE visibility as the rows.
  useEffect(() => {
    let cancelled = false;
    listVersionCodes()
      .then((res) => !cancelled && setCodeOptions(res.data))
      .catch(() => {});
    return () => { cancelled = true; };
  }, [refreshTick]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErrorMsg(null);
    listVersions({ page, pageSize: PAGE_SIZE, state: stateFilter, skill_package_id: selectedPackageIds, sort: 'newest' })
      .then((res) => {
        if (cancelled) return;
        setRows(res.data);
        setTotal(res.meta.total);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setErrorMsg((err as any)?.response?.data?.message || (err as Error)?.message || 'Không thể tải danh sách.');
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [page, stateFilter, selectedPackageIds, refreshTick]);

  const codeSelectOptions = useMemo(
    () => codeOptions.map((c) => ({ label: `${c.package_name} (${c.code})`, value: c.package_id })),
    [codeOptions],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          mode="multiple"
          allowClear
          size="large"
          placeholder="Lọc theo mã"
          value={selectedPackageIds}
          onChange={(v) => { setSelectedPackageIds(v); setPage(1); }}
          options={codeSelectOptions}
          className="min-w-[240px] flex-1"
          maxTagCount="responsive"
        />
        <Select
          size="large"
          value={stateFilter}
          onChange={(v) => { setStateFilter(v); setPage(1); }}
          options={STATE_OPTIONS}
          className="min-w-[150px]"
        />
      </div>

      {loading && <SpinnerRow />}
      {!loading && errorMsg && <ErrorBanner message={errorMsg} />}
      {!loading && !errorMsg && rows.length === 0 && (
        <motion.div variants={fadeInUp} initial="hidden" animate="show"
          className="flex flex-col items-center justify-center rounded-2xl bg-ah-mist py-16 text-center">
          <p className="text-sm font-bold text-ah-ink">Không có phiên bản nào</p>
          <p className="mt-1.5 text-xs text-ah-muted">Chưa có phiên bản phù hợp bộ lọc.</p>
        </motion.div>
      )}

      {!loading && !errorMsg && rows.length > 0 && (
        <>
          <StaggerList className="flex flex-col gap-2">
            {rows.map((r) => (
              <StaggerItem key={r.version_id}>
                <VersionRowItem row={r} onOpen={() => onSelectVersion(r.version_id)} />
              </StaggerItem>
            ))}
          </StaggerList>
          {total > PAGE_SIZE && (
            <div className="mt-2 flex justify-end">
              <Pagination current={page} pageSize={PAGE_SIZE} total={total} showSizeChanger={false}
                onChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ---- Root: owns selection + refetch tick (embeds ReviewScreen like ReviewQueue) ---------------

const VersionManagement: React.FC = () => {
  const { data: perms, loading: permsLoading } = useSkillPermissions();
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const canApprove = perms?.canApprove ?? false;
  const handleActionComplete = useCallback(() => setRefreshTick((n) => n + 1), []);

  if (permsLoading) return <SpinnerRow />;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedVersionId !== null ? (
        <motion.div key="review-screen"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, x: -16, transition: { duration: 0.15 } }}
        >
          <ReviewScreen versionId={selectedVersionId} canApprove={canApprove}
            onBack={() => setSelectedVersionId(null)} onActionComplete={handleActionComplete} />
        </motion.div>
      ) : (
        <motion.div key="version-list"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, x: 16, transition: { duration: 0.15 } }}
        >
          <VersionList onSelectVersion={setSelectedVersionId} refreshTick={refreshTick} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VersionManagement;
