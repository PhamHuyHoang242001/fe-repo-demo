// Tab: Danh sách — published skill packages (status=active, has active_version).
// Paginated via skillApi.list() with page-based append + deterministic BE sort (id DESC).
// Infinite scroll: IntersectionObserver sentinel triggers next page load.
//
// Pagination design (M1):
//   - Page-based append: keep local page counter, increment on "load more".
//   - hasMore = total items fetched < meta.total (exact count from BE).
//   - Double-fetch guard: loading flag prevents concurrent requests.
//   - On filter change: reset items + page to 1 (replaced, not appended).
//
// Imports only from within the module (H4 — no src/pages/* or src/hooks/*).

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { list as listSkills } from '../api/skillApi';
import type { SkillListItem } from '../types';
import FilterBar from '../components/FilterBar';
import SkillCard from '../components/SkillCard';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const PAGE_LIMIT = 12;

interface FiltersState {
  search: string;
  category: string;
  tags: string[];
}

// ---- Sub-components ------------------------------------------------------------

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-8">
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-ah-line border-t-ah-green" />
    <span className="ml-2 text-sm text-ah-muted">Đang tải…</span>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <p className="text-sm font-semibold text-ah-muted">Không tìm thấy skill nào.</p>
    <p className="mt-1 text-xs text-ah-muted">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.</p>
  </div>
);

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3">
    <p className="text-sm text-ah-red">{message}</p>
    <button
      onClick={onRetry}
      className="rounded-lg bg-ah-green px-4 py-1.5 text-sm font-semibold text-white hover:bg-ah-green-d transition-colors"
    >
      Thử lại
    </button>
  </div>
);

// ---- Main component ------------------------------------------------------------

const PublishedList: React.FC = () => {
  const [items, setItems] = useState<SkillListItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FiltersState>({ search: '', category: '', tags: [] });

  // Stable ref to latest filters for use inside loadMore callback.
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // Derived: has more items to load?
  const hasMore = items.length < total;

  const fetchPage = useCallback(async (nextPage: number, currentFilters: FiltersState, replace: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const { search, category, tags } = currentFilters;
      const res = await listSkills({
        page: nextPage,
        limit: PAGE_LIMIT,
        ...(search ? { search } : {}),
        ...(category ? { category } : {}),
        ...(tags.length ? { tags } : {}),
      });
      setTotal(res.meta.total);
      setItems((prev) => (replace ? res.data : [...prev, ...res.data]));
      setPage(nextPage);
    } catch (err: unknown) {
      const msg =
        (err as any)?.response?.data?.message ||
        (err as Error)?.message ||
        'Không thể tải danh sách skill.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + filter-triggered reset
  useEffect(() => {
    setItems([]);
    setTotal(0);
    fetchPage(1, filters, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Load next page (called by infinite-scroll sentinel)
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchPage(page + 1, filtersRef.current, false);
  }, [loading, hasMore, page, fetchPage]);

  const sentinelRef = useInfiniteScroll({ hasMore, loading, onLoadMore: loadMore });

  const handleFilterChange = useCallback((f: FiltersState) => {
    setFilters(f);
  }, []);

  const handleRetry = useCallback(() => {
    fetchPage(1, filtersRef.current, true);
  }, [fetchPage]);

  return (
    <div className="flex flex-col gap-4">
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Error state */}
      {error && <ErrorBanner message={error} onRetry={handleRetry} />}

      {/* Empty state (after initial load completes with no results) */}
      {!loading && !error && items.length === 0 && <EmptyState />}

      {/* Card grid */}
      {items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}

      {/* Loading spinner (initial + next-page) */}
      {loading && <LoadingSpinner />}

      {/* Infinite-scroll sentinel — invisible element at the bottom */}
      <div ref={sentinelRef} className="h-1" aria-hidden="true" />

      {/* End of list indicator */}
      {!hasMore && !loading && items.length > 0 && (
        <p className="py-4 text-center text-xs text-ah-muted">Đã hiển thị tất cả {total} skill.</p>
      )}
    </div>
  );
};

export default PublishedList;
