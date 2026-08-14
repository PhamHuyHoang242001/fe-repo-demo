// Fetches everything the dashboard needs in ONE parallel batch: skill stats + prompt stats +
// the latest feed. Same {data, loading, error, refetch} shape as useSkillPermissions so the
// page renders loading/error/success uniformly. A single rejection fails the whole batch (retryable).

import { useState, useEffect } from 'react';
import { stats as skillStats } from '../../skill/api/skillApi';
import { stats as promptStats } from '../../prompt/api/promptApi';
import { latest } from '../api/dashboardApi';
import type { DashboardData } from '../types';

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

    Promise.all([skillStats(), promptStats(), latest()])
      .then(([skill, prompt, feed]) => {
        if (cancelled) return;
        setData({ skillStats: skill, promptStats: prompt, latest: feed });
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
