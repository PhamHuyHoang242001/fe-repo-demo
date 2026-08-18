// Elevated, sticky, frosted filter toolbar for the published list.
// Controls are antd (Input search + Select + tags-mode Select), themed to ah-* via ConfigProvider.
// Emits settled filter values (search is debounced internally). Sort reorders only loaded items —
// the list API has no sort param, so sort stays client-side.

import React, { useEffect, useRef, useState } from 'react';
import { Input, Select } from 'antd';
import { useDebounce } from '../hooks/useDebounce';
import { SURFACE_GLASS } from '../../../theme/surfaces';
import CategorySelect from '../../../components/CategorySelect';

const SearchIcon: React.FC = () => (
  <svg className="h-4 w-4 text-ah-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-5.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" />
  </svg>
);

// Walk up to the nearest vertically-scrollable ancestor (the tab panel in PromptPackage).
function findScrollParent(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null;
  while (node) {
    const oy = getComputedStyle(node).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && node.scrollHeight > node.clientHeight) return node;
    node = node.parentElement;
  }
  return null;
}

export type SortKey = 'newest' | 'name' | 'version';

export interface PromptFilters {
  search: string;
  categoryId: number | null;
  tags: string[];
  sort: SortKey;
}

interface PromptToolbarProps {
  onFilterChange: (filters: PromptFilters) => void;
  /** Live count of currently loaded/total results, shown on the right. */
  count?: number;
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'name', label: 'Tên A→Z' },
  { value: 'version', label: 'Phiên bản' },
];

export const PromptToolbar: React.FC<PromptToolbarProps> = ({ onFilterChange, count }) => {
  const [searchRaw, setSearchRaw] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [sort, setSort] = useState<SortKey>('newest');
  const [tags, setTags] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Elevate the sticky bar with a soft shadow once the panel is scrolled off the top.
  useEffect(() => {
    const parent = findScrollParent(rootRef.current);
    if (!parent) return;
    const onScroll = () => setScrolled(parent.scrollTop > 4);
    onScroll();
    parent.addEventListener('scroll', onScroll, { passive: true });
    return () => parent.removeEventListener('scroll', onScroll);
  }, []);

  const searchDebounced = useDebounce(searchRaw, 350);

  React.useEffect(() => {
    onFilterChange({ search: searchDebounced, categoryId, tags, sort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounced, categoryId, tags, sort]);

  return (
    <div
      ref={rootRef}
      className={`sticky top-0 z-10 -mx-5 -mt-5 mb-1 px-5 py-3 transition-shadow duration-200 ${SURFACE_GLASS} ${
        scrolled ? 'shadow-ah-glow-sm' : ''
      }`}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search */}
        <Input
          allowClear
          size="large"
          prefix={<SearchIcon />}
          value={searchRaw}
          onChange={(e) => setSearchRaw(e.target.value)}
          placeholder="Tìm kiếm prompt…"
          className="min-w-[220px] flex-1"
        />

        {/* Category */}
        <CategorySelect
          type="prompt"
          value={categoryId}
          onChange={setCategoryId}
          size="large"
          className="min-w-[176px]"
          ariaLabel="Danh mục"
          placeholder="Tất cả danh mục"
        />

        {/* Sort */}
        <Select<SortKey>
          value={sort}
          onChange={setSort}
          size="large"
          className="min-w-[148px]"
          aria-label="Sắp xếp"
          options={SORT_OPTIONS}
        />

        {/* Tags — free-form chips */}
        <Select
          mode="tags"
          value={tags}
          onChange={(v) => setTags(v.map((t) => t.trim().toLowerCase()).filter(Boolean))}
          size="large"
          className="min-w-[180px] flex-1"
          placeholder="Thêm tag…"
          tokenSeparators={[',']}
          maxTagCount="responsive"
          suffixIcon={null}
          aria-label="Tags"
        />

        {typeof count === 'number' && (
          <span className="ml-auto shrink-0 text-xs text-ah-muted">
            <span className="font-semibold text-ah-ink tabular-nums">{count}</span> prompt
          </span>
        )}
      </div>
    </div>
  );
};

export default PromptToolbar;
