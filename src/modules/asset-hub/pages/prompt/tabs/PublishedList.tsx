// Tab: Danh sách — published prompt packages (status=active, has active_version).
// Paginated via promptApi.list() with page-based append + deterministic BE sort (id DESC).
// Infinite scroll: IntersectionObserver sentinel triggers next page load.
//
// Pagination design (M1):
//   - Page-based append: keep local page counter, increment on "load more".
//   - hasMore = total items fetched < meta.total (exact count from BE).
//   - Double-fetch guard: loading flag prevents concurrent requests.
//   - On filter change: reset items + page to 1 (replaced, not appended).
//
// Imports only from within the module (H4 — no src/pages/* or src/hooks/*).

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { list as listPrompts } from '../api/promptApi';
import type { PromptListItem } from '../types';
import PromptToolbar, { PromptFilters } from '../components/PromptToolbar';
import PromptCard from '../components/PromptCard';
import { PromptCardSkeletonBlock } from '../components/Skeleton';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { StaggerList, StaggerItem } from '../components/motion-primitives';
import { fadeInUp } from '../../../theme/motion';

const PAGE_LIMIT = 12;
type FiltersState = PromptFilters;

// ---- Sub-components ------------------------------------------------------------

const LoadingSpinner: React.FC = () => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    animate="show"
    className="flex items-center justify-center py-8 gap-2"
  >
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-ah-line border-t-ah-green" />
    <span className="text-sm text-ah-muted">Đang tải…</span>
  </motion.div>
);

const EmptyState: React.FC = () => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    animate="show"
    className="flex flex-col items-center justify-center rounded-2xl bg-ah-mist py-20 text-center"
  >
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-ah-line bg-ah-card shadow-ah-float">
      <svg className="h-7 w-7 text-ah-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-5.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" />
      </svg>
    </div>
    <p className="mt-5 text-sm font-bold text-ah-ink">Không tìm thấy prompt nào</p>
    <p className="mt-1.5 text-xs text-ah-muted">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.</p>
  </motion.div>
);

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry }) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    animate="show"
    className="flex flex-col items-center justify-center rounded-2xl border border-ah-red-l bg-ah-mist py-12 gap-3"
  >
    <p className="text-sm text-ah-red">{message}</p>
    <button
      onClick={onRetry}
      className="rounded-xl bg-ah-green px-5 py-2 text-sm font-bold text-white shadow-ah-float transition-colors hover:bg-ah-green-d hover:shadow-ah-glow"
    >
      Thử lại
    </button>
  </motion.div>
);

// ---- Main component ------------------------------------------------------------

const PublishedList: React.FC = () => {
  const [items, setItems] = useState<PromptListItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FiltersState>({ search: '', categoryId: null, tags: [], sort: 'newest' });

  // Stable ref to latest filters for use inside loadMore callback.
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // Server-relevant filter key — excludes `sort` (sort is client-side, must NOT trigger a refetch).
  const serverKey = JSON.stringify({ s: filters.search, c: filters.categoryId, t: filters.tags });

  const hasMore = items.length < total;

  // Client-side sort over the loaded set. 'newest' preserves BE order (id DESC).
  const sortedItems = useMemo(() => {
    const arr = [...items];
    if (filters.sort === 'name') {
      arr.sort((a, b) => a.active_version.name.localeCompare(b.active_version.name, 'vi'));
    } else if (filters.sort === 'version') {
      arr.sort((a, b) => b.active_version.version_no - a.active_version.version_no);
    }
    return arr;
  }, [items, filters.sort]);

  const fetchPage = useCallback(async (nextPage: number, currentFilters: FiltersState, replace: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const { search, categoryId, tags } = currentFilters;
      const res = await listPrompts({
        page: nextPage,
        limit: PAGE_LIMIT,
        ...(search ? { search } : {}),
        ...(categoryId != null ? { category_id: categoryId } : {}),
        ...(tags.length ? { tags } : {}),
      });
      setTotal(res.meta.total);
      setItems((prev) => (replace ? res.data : [...prev, ...res.data]));
      setPage(nextPage);
    } catch (err: unknown) {
      const msg =
        (err as any)?.response?.data?.message ||
        (err as Error)?.message ||
        'Không thể tải danh sách prompt.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + server-filter-triggered reset (sort changes excluded via serverKey).
  useEffect(() => {
    setItems([]);
    setTotal(0);
    fetchPage(1, filtersRef.current, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverKey]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchPage(page + 1, filtersRef.current, false);
  }, [loading, hasMore, page, fetchPage]);

  const sentinelRef = useInfiniteScroll({ hasMore, loading, onLoadMore: loadMore });

  const handleFilterChange = useCallback((f: FiltersState) => { setFilters(f); }, []);
  const handleRetry = useCallback(() => { fetchPage(1, filtersRef.current, true); }, [fetchPage]);

  const showSkeleton = loading && items.length === 0;

  return (
    <div className="flex flex-col gap-7">
      <PromptToolbar onFilterChange={handleFilterChange} count={total} />

      {error && <ErrorBanner message={error} onRetry={handleRetry} />}

      {/* Skeleton grid on first load */}
      {showSkeleton && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <PromptCardSkeletonBlock key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && items.length === 0 && <EmptyState />}

      {/* Staggered card grid */}
      {items.length > 0 && (
        <StaggerList className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedItems.map((prompt) => (
            <StaggerItem key={prompt.id}>
              <PromptCard prompt={prompt} />
            </StaggerItem>
          ))}
        </StaggerList>
      )}

      {loading && items.length > 0 && <LoadingSpinner />}

      {/* Infinite-scroll sentinel */}
      <div ref={sentinelRef} className="h-1" aria-hidden="true" />

      {!hasMore && !loading && items.length > 0 && (
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="py-4 text-center text-xs text-ah-muted"
        >
          Đã hiển thị tất cả {total} prompt.
        </motion.p>
      )}
    </div>
  );
};

export default PublishedList;
