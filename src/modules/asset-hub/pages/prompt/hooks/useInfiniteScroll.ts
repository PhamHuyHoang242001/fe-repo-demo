// Local IntersectionObserver-based infinite-scroll hook — built inside module (H4).
// Calls `onLoadMore` when the sentinel element enters the viewport.
// Guards against:
//   - double-fire while a fetch is already in-flight (inFlight flag)
//   - firing when there are no more items (hasMore flag)

import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  /** Whether more items are available to load. */
  hasMore: boolean;
  /** Whether a fetch is currently in progress. */
  loading: boolean;
  /** Callback fired when the sentinel is visible and conditions are met. */
  onLoadMore: () => void;
}

/**
 * Attaches an IntersectionObserver to the returned ref.
 * Mount the ref on a sentinel element at the bottom of the list.
 *
 * Example:
 *   const sentinelRef = useInfiniteScroll({ hasMore, loading, onLoadMore });
 *   return <div ref={sentinelRef} />;
 */
export function useInfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
}: UseInfiniteScrollOptions): React.RefObject<HTMLDivElement> {
  const sentinelRef = useRef<HTMLDivElement>(null);
  // Stable ref to latest callback — avoids stale closure in observer.
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMoreRef.current();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
    // Re-connect observer when hasMore/loading changes so conditions are re-evaluated.
  }, [hasMore, loading]);

  return sentinelRef;
}
