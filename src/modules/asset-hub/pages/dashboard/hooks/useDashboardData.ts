// Fetches everything the dashboard needs in TWO requests: the hub stats endpoint (which reports
// both workspaces in one array) plus the latest feed. Same {data, loading, error, refetch} shape as
// useSkillPermissions so the page renders loading/error/success uniformly. A single rejection fails
// the whole batch (retryable).

import { useState, useEffect } from 'react';
import { hubStats } from '../../../api/catalogApi';
import type { WorkspaceStatRow } from '../../../types/catalog';
import { latest } from '../api/dashboardApi';
import type { DashboardData } from '../types';

const EMPTY_STATS = { total: 0, pending: 0, approved: 0, rejected: 0, published: 0 };

// The array is keyed by `type`; a workspace missing from the response reads as all-zero rather
// than crashing the dashboard.
function pickStats(rows: WorkspaceStatRow[], type: WorkspaceStatRow['type']) {
  const row = rows.find((r) => r.type === type);
  if (!row) return EMPTY_STATS;
  return {
    total: row.total,
    pending: row.pending,
    approved: row.approved,
    rejected: row.rejected,
    published: row.published,
  };
}

interface UseDashboardDataResult {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardData(): UseDashboardDataResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([hubStats(), latest()])
      .then(([rows, feed]) => {
        if (cancelled) return;
        setData({
          skillStats: pickStats(rows, 'skill'),
          promptStats: pickStats(rows, 'prompt'),
          latest: feed,
        });
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg =
          (err as any)?.response?.data?.message ||
          (err as Error)?.message ||
          'Không thể tải dữ liệu tổng quan. Vui lòng thử lại.';
        setError(msg);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  const refetch = () => setTick((n) => n + 1);

  return { data, loading, error, refetch };
}
