// Picker for the people in charge of an artifact. The directory endpoint is paginated and
// browsable: page 1 loads on open, scrolling appends the next page, and typing narrows the
// same list server-side rather than being a precondition for any results.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Select, Tag } from 'antd';
import type { SelectProps } from 'antd';
import { listUsers } from '../api/catalogApi';
import type { ResponsibleUser } from '../types/catalog';

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

interface ResponsibleUserSelectProps {
  value: number[];
  onChange: (value: number[]) => void;
  /** Users already attached to the package — merged in so their emails render before any fetch. */
  selectedUsers?: ResponsibleUser[];
  className?: string;
  status?: 'error' | 'warning';
  disabled?: boolean;
  maxCount?: number;
}

const renderUserTag: SelectProps['tagRender'] = ({ label, closable, onClose }) => (
  <Tag
    closable={closable}
    onClose={onClose}
    onMouseDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
    className="!my-0.5 !mr-1 !rounded-full !border-ah-green/30 !bg-ah-green-l !text-xs !font-semibold !text-ah-green"
  >
    {label}
  </Tag>
);

const ResponsibleUserSelect: React.FC<ResponsibleUserSelectProps> = ({
  value,
  onChange,
  selectedUsers = [],
  className = 'w-full',
  status,
  disabled,
  maxCount = 20,
}) => {
  const [users, setUsers] = useState<ResponsibleUser[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Guards against a slow early page overwriting the results of a newer keyword.
  const requestSeq = useRef(0);

  const fetchPage = useCallback(async (nextPage: number, search: string, append: boolean) => {
    const seq = ++requestSeq.current;
    setLoading(true);
    try {
      const res = await listUsers({ page: nextPage, limit: PAGE_SIZE, ...(search ? { search } : {}) });
      if (seq !== requestSeq.current) return;
      setUsers((prev) => (append ? [...prev, ...res.data] : res.data));
      setTotal(res.meta?.total ?? 0);
      setPage(nextPage);
      setError(null);
    } catch {
      if (seq !== requestSeq.current) return;
      // A 403 here means the caller holds no upload/approve grant — the form is unusable anyway.
      setError('Không tải được danh sách người dùng');
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  }, []);

  // Initial page, then re-query on every settled keyword.
  useEffect(() => {
    const timer = setTimeout(() => void fetchPage(1, keyword.trim(), false), keyword ? SEARCH_DEBOUNCE_MS : 0);
    return () => clearTimeout(timer);
  }, [keyword, fetchPage]);

  const options = useMemo(() => {
    const merged = new Map<number, ResponsibleUser>();
    // Pre-selected users first so their chips never render as bare ids.
    for (const u of selectedUsers) merged.set(u.id, u);
    for (const u of users) merged.set(u.id, u);
    return Array.from(merged.values()).map((u) => ({ value: u.id, label: u.email }));
  }, [users, selectedUsers]);

  const handlePopupScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    const reachedBottom = el.scrollTop + el.offsetHeight >= el.scrollHeight - 24;
    if (reachedBottom && !loading && users.length < total) {
      void fetchPage(page + 1, keyword.trim(), true);
    }
  };

  return (
    <Select<number[]>
      mode="multiple"
      size="large"
      className={className}
      value={value}
      onChange={(next) => onChange(next ?? [])}
      placeholder="Chọn người chịu trách nhiệm…"
      options={options}
      loading={loading}
      status={status ?? (error ? 'error' : undefined)}
      disabled={disabled}
      maxCount={maxCount}
      tagRender={renderUserTag}
      notFoundContent={error ?? (loading ? 'Đang tải…' : 'Không tìm thấy người dùng')}
      // Filtering happens server-side; keeping the client filter off avoids hiding freshly
      // fetched rows that do not match the stale local keyword.
      filterOption={false}
      onSearch={setKeyword}
      onPopupScroll={handlePopupScroll}
      showSearch
    />
  );
};

export default ResponsibleUserSelect;
