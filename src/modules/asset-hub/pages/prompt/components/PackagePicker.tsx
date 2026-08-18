// PackagePicker — search and select an existing prompt package (update mode).
// Visual redesign: antd Input for search, animated dropdown, selected-state card.
// Logic (debounce, list API, select/clear handlers) and props are UNCHANGED.
// No import from src/hooks/* or src/pages/* (H4).

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { list } from '../api/promptApi';
import { useDebounce } from '../hooks/useDebounce';
import { staggerContainer, staggerItem, scaleIn, springSoft } from '../../../theme/motion';
import type { PromptListItem } from '../types';
import { resolveCategoryLabel } from '../../../utils/category';

const SearchIcon: React.FC = () => (
  <svg className="h-4 w-4 text-ah-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-5.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" />
  </svg>
);

interface PackagePickerProps {
  value: PromptListItem | null;
  onChange: (pkg: PromptListItem | null) => void;
  error?: string;
}

const PackagePicker: React.FC<PackagePickerProps> = ({ value, onChange, error }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<PromptListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    list({ search: debouncedSearch || undefined, limit: 20 })
      .then((res) => setResults(res.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedSearch, open]);

  const handleSelect = useCallback(
    (pkg: PromptListItem) => {
      onChange(pkg);
      setOpen(false);
      setSearch('');
    },
    [onChange],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
      setSearch('');
    },
    [onChange],
  );

  return (
    <div className="relative flex flex-col gap-1.5">
      {/* Selected state card */}
      <AnimatePresence mode="wait" initial={false}>
        {value && !open ? (
          <motion.div
            key="selected"
            variants={scaleIn}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex items-center justify-between rounded-xl border border-ah-green bg-ah-green-l px-4 py-3 shadow-ah-float"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-ah-ink">{value.active_version.name}</span>
              <span className="text-xs text-ah-muted">
                ID #{value.id} · {resolveCategoryLabel(value.active_version.category)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { setOpen(true); setSearch(''); }}
                className="text-xs font-bold text-ah-green transition-colors hover:text-ah-green-d underline underline-offset-2"
              >
                Đổi
              </button>
              <button
                type="button"
                onClick={handleClear}
                aria-label="Bỏ chọn package"
                className="rounded-lg p-1 text-ah-muted transition-colors hover:bg-ah-red/10 hover:text-ah-red"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="search-input"
            variants={scaleIn}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <Input
              size="large"
              allowClear
              prefix={<SearchIcon />}
              value={search}
              placeholder="Tìm tên prompt package…"
              autoFocus={open}
              onFocus={() => setOpen(true)}
              onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
              suffix={
                loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-ah-line border-t-ah-green" />
                ) : undefined
              }
              status={error && !open ? 'error' : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown results */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop — click away to close */}
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute top-full z-20 mt-1.5 w-full overflow-hidden rounded-2xl border border-ah-line bg-ah-card shadow-ah-float"
              style={{ maxHeight: 220, overflowY: 'auto' }}
            >
              {results.length === 0 && !loading ? (
                <p className="px-5 py-4 text-sm text-ah-muted">
                  {debouncedSearch ? 'Không tìm thấy kết quả' : 'Nhập để tìm kiếm…'}
                </p>
              ) : (
                <motion.div variants={staggerContainer} initial="hidden" animate="show">
                  {results.map((pkg) => (
                    <motion.button
                      key={pkg.id}
                      type="button"
                      variants={staggerItem}
                      onClick={() => handleSelect(pkg)}
                      whileHover={{ backgroundColor: 'rgba(0,105,62,0.06)' }}
                      transition={springSoft}
                      className="flex w-full items-start gap-3 border-b border-ah-line px-5 py-3.5 text-left last:border-b-0 transition-colors"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-ah-ink">{pkg.active_version.name}</span>
                        <span className="text-xs text-ah-muted">
                          ID #{pkg.id} · {resolveCategoryLabel(pkg.active_version.category)}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {error && !open && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-xs text-ah-red"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PackagePicker;
