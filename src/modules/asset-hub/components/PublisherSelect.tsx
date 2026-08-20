// Picker for the publishing unit that owns an artifact. Package-scoped, required on both
// create and edit — the BE rejects a write without it.

import React, { useEffect, useMemo, useState } from 'react';
import { Select } from 'antd';
import { listPublishers } from '../api/catalogApi';
import type { PublisherRef } from '../types/catalog';

interface PublisherSelectProps {
  value: number | null;
  onChange: (value: number | null) => void;
  /** Publisher already attached to the package — kept selectable even if it left the catalog. */
  selectedPublisher?: PublisherRef | null;
  placeholder?: string;
  className?: string;
  status?: 'error' | 'warning';
  disabled?: boolean;
}

const PublisherSelect: React.FC<PublisherSelectProps> = ({
  value,
  onChange,
  selectedPublisher,
  placeholder = 'Chọn đơn vị phát hành…',
  className = 'w-full',
  status,
  disabled,
}) => {
  const [publishers, setPublishers] = useState<PublisherRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listPublishers()
      .then((rows) => {
        if (!cancelled) setPublishers(rows);
      })
      .catch(() => {
        if (!cancelled) setError('Không tải được danh sách đơn vị phát hành');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const options = useMemo(() => {
    const base = publishers.map((p) => ({ value: p.id, label: p.name }));
    // A retired publisher still on the package must remain visible, or an edit would silently
    // drop it and the required field would look empty.
    if (selectedPublisher && !base.some((o) => o.value === selectedPublisher.id)) {
      return [...base, { value: selectedPublisher.id, label: selectedPublisher.name }];
    }
    return base;
  }, [publishers, selectedPublisher]);

  return (
    <Select<number>
      size="large"
      className={className}
      value={value ?? undefined}
      onChange={(next) => onChange(next ?? null)}
      placeholder={placeholder}
      options={options}
      loading={loading}
      status={status ?? (error ? 'error' : undefined)}
      disabled={disabled}
      notFoundContent={error ?? 'Không có đơn vị phù hợp'}
      optionFilterProp="label"
      showSearch
      allowClear
      onClear={() => onChange(null)}
    />
  );
};

export default PublisherSelect;
