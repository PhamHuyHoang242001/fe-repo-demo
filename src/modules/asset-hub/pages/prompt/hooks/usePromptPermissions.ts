// Local hook for fetching and caching the caller's prompt permissions.
// Built inside the module to avoid cross-importing legacy src/hooks/*.
// Distinguishes two failure modes so callers render appropriately:
//   - network error  → `error` is set, `data` is null (retry makes sense)
//   - empty perms    → `error` is null, `data` is {canUpload:false, canApprove:false}

import { useState, useEffect } from 'react';
import type { MyPromptPermissions } from '../types';
import { myPermissions } from '../api/promptApi';

interface UsePromptPermissionsResult {
  data: MyPromptPermissions | null;
  loading: boolean;
  /** Set on network/HTTP failure. Null means the fetch succeeded (even if perms are false). */
  error: string | null;
  /** Re-trigger the fetch (e.g. after a permissions change). */
  refetch: () => void;
}

export function usePromptPermissions(): UsePromptPermissionsResult {
  const [data, setData] = useState<MyPromptPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // incrementing this counter forces a re-fetch without adding complex deps
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    myPermissions()
      .then((perms) => {
        if (!cancelled) {
          setData(perms);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          // Extract a human-readable message; fall back to generic.
          const msg =
            (err as any)?.response?.data?.message ||
            (err as Error)?.message ||
            'Không thể tải quyền hạn. Vui lòng thử lại.';
          setError(msg);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  const refetch = () => setTick((n) => n + 1);

  return { data, loading, error, refetch };
}
