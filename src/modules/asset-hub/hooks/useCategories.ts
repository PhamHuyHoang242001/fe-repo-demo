import { useEffect, useMemo, useState } from 'react';
import { listCategories } from '../api/categoryApi';
import type { AssetHubCategory } from '../types/category';
import type { AssetHubCategoryType } from '../types/category';

interface UseCategoriesOptions {
  includeInactive?: boolean;
}

interface CacheEntry {
  data: AssetHubCategory[];
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<AssetHubCategory[]>>();

function cacheKey(type: AssetHubCategoryType, includeInactive?: boolean): string {
  return `${type}:${includeInactive ? 'all' : 'active'}`;
}

async function fetchCategories(type: AssetHubCategoryType, includeInactive?: boolean): Promise<AssetHubCategory[]> {
  const key = cacheKey(type, includeInactive);
  const cached = cache.get(key);
  if (cached) return cached.data;

  const existing = inFlight.get(key);
  if (existing) return existing;

  const promise = listCategories({ type, include_inactive: includeInactive }).then((data) => {
    cache.set(key, { data, fetchedAt: Date.now() });
    inFlight.delete(key);
    return data;
  });

  inFlight.set(key, promise);
  return promise;
}

export interface UseCategoriesResult {
  data: AssetHubCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCategories(type: AssetHubCategoryType, options: UseCategoriesOptions = {}): UseCategoriesResult {
  const key = useMemo(() => cacheKey(type, options.includeInactive), [type, options.includeInactive]);
  const [data, setData] = useState<AssetHubCategory[]>(() => cache.get(key)?.data ?? []);
  const [loading, setLoading] = useState(!cache.has(key));
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const cached = cache.get(key);

    if (cached) {
      setData(cached.data);
      setLoading(false);
    } else {
      setLoading(true);
    }

    setError(null);

    fetchCategories(type, options.includeInactive)
      .then((items) => {
        if (cancelled) return;
        setData(items);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg =
          (err as any)?.response?.data?.message ||
          (err as Error)?.message ||
          'Không thể tải danh mục. Vui lòng thử lại.';
        setError(msg);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [key, tick, type, options.includeInactive]);

  const refetch = () => setTick((n) => n + 1);

  return { data, loading, error, refetch };
}

