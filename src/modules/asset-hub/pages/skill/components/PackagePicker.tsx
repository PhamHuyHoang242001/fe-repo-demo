// PackagePicker — search and select an existing skill package (update mode).
// Uses skillApi.list with debounced search. Local hook (useDebounce) from Phase 4.
// No import from src/hooks/* or src/pages/* (H4).

import React, { useState, useEffect, useCallback } from 'react';
import { list } from '../api/skillApi';
import { useDebounce } from '../hooks/useDebounce';
import type { SkillListItem } from '../types';

interface PackagePickerProps {
  value: SkillListItem | null;
  onChange: (pkg: SkillListItem | null) => void;
  error?: string;
}

const PackagePicker: React.FC<PackagePickerProps> = ({ value, onChange, error }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SkillListItem[]>([]);
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
    (pkg: SkillListItem) => {
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
    <div className="relative flex flex-col gap-1">
      {/* Selected display or search input */}
      {value && !open ? (
        <div className="flex items-center justify-between rounded-lg border border-ah-green bg-ah-green-l px-3 py-2">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-ah-ink">{value.active_version.name}</span>
            <span className="text-xs text-ah-muted">ID #{value.id} · {value.active_version.category}</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setOpen(true); setSearch(''); }}
              className="text-xs font-semibold text-ah-green hover:text-ah-green-d transition-colors"
            >
              Đổi
            </button>
            <button
              type="button"
              onClick={handleClear}
              aria-label="Bỏ chọn package"
              className="text-ah-muted hover:text-ah-red transition-colors text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={search}
            placeholder="Tìm tên skill package…"
            autoFocus={open}
            onFocus={() => setOpen(true)}
            onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
            className={[
              'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
              error && !open
                ? 'border-ah-red focus:border-ah-red'
                : 'border-ah-line focus:border-ah-green',
            ].join(' ')}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-ah-line border-t-ah-green" />
            </div>
          )}
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <>
          {/* backdrop — click away to close */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full z-20 mt-1 w-full max-h-52 overflow-auto rounded-xl border border-ah-line bg-ah-card shadow-lg">
            {results.length === 0 && !loading && (
              <p className="px-4 py-3 text-sm text-ah-muted">
                {debouncedSearch ? 'Không tìm thấy kết quả' : 'Nhập để tìm kiếm…'}
              </p>
            )}
            {results.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => handleSelect(pkg)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-ah-green-l transition-colors border-b border-ah-line last:border-b-0"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-ah-ink">{pkg.active_version.name}</span>
                  <span className="text-xs text-ah-muted">ID #{pkg.id} · {pkg.active_version.category}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {error && !open && <p className="text-xs text-ah-red">{error}</p>}
    </div>
  );
};

export default PackagePicker;
