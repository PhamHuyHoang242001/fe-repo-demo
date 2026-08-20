// Picker for catalog tags. Tags are seeded rows scoped to one workspace, so this replaces the
// old freeform tags input: a user picks from the catalog rather than inventing strings.
// The kind filter narrows the options; a tag of either kind may be selected (the mix is allowed).

import React, { useEffect, useMemo, useState } from 'react';
import { Select, Tag } from 'antd';
import type { SelectProps } from 'antd';
import { listTags } from '../api/catalogApi';
import type { AssetHubArtifactType, AssetHubTagKind, CatalogTag, TagRef } from '../types/catalog';

interface CatalogTagSelectProps {
  artifactType: AssetHubArtifactType;
  value: number[];
  onChange: (value: number[]) => void;
  /** Tags already on the version — merged in so their names render before the catalog loads. */
  selectedTags?: TagRef[];
  /** Optional kind narrowing for the option list. Undefined shows both kinds. */
  kind?: AssetHubTagKind;
  className?: string;
  disabled?: boolean;
  maxCount?: number;
  placeholder?: string;
}

// Enterprise tags read as the "official" axis and personal as the individual one, so they carry
// distinct colours everywhere a tag is rendered.
const KIND_CLASS: Record<AssetHubTagKind, string> = {
  enterprise: '!border-ah-green/30 !bg-ah-green-l !text-ah-green',
  personal: '!border-amber-400/40 !bg-amber-50 !text-amber-700',
};

const CatalogTagSelect: React.FC<CatalogTagSelectProps> = ({
  artifactType,
  value,
  onChange,
  selectedTags = [],
  kind,
  className = 'w-full',
  disabled,
  maxCount = 20,
  placeholder = 'Chọn tag…',
}) => {
  const [tags, setTags] = useState<CatalogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listTags({ artifact_type: artifactType, ...(kind ? { kind } : {}) })
      .then((rows) => {
        if (!cancelled) setTags(rows);
      })
      .catch(() => {
        if (!cancelled) setError('Không tải được danh sách tag');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [artifactType, kind]);

  // id → kind, so a chip can be coloured without another lookup pass.
  const kindById = useMemo(() => {
    const map = new Map<number, AssetHubTagKind>();
    for (const t of selectedTags) map.set(t.id, t.kind);
    for (const t of tags) map.set(t.id, t.kind);
    return map;
  }, [tags, selectedTags]);

  const options = useMemo(() => {
    const merged = new Map<number, { id: number; name: string }>();
    // Already-attached tags stay selectable even when the kind filter would exclude them.
    for (const t of selectedTags) merged.set(t.id, t);
    for (const t of tags) merged.set(t.id, t);
    return Array.from(merged.values()).map((t) => ({ value: t.id, label: t.name }));
  }, [tags, selectedTags]);

  const renderTag: SelectProps['tagRender'] = ({ label, value: tagValue, closable, onClose }) => (
    <Tag
      closable={closable}
      onClose={onClose}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`!my-0.5 !mr-1 !rounded-full !text-xs !font-semibold ${
        KIND_CLASS[kindById.get(Number(tagValue)) ?? 'enterprise']
      }`}
    >
      {label}
    </Tag>
  );

  return (
    <Select<number[]>
      mode="multiple"
      size="large"
      className={className}
      value={value}
      onChange={(next) => onChange(next ?? [])}
      placeholder={placeholder}
      options={options}
      loading={loading}
      status={error ? 'error' : undefined}
      disabled={disabled}
      maxCount={maxCount}
      tagRender={renderTag}
      notFoundContent={error ?? 'Không có tag phù hợp'}
      optionFilterProp="label"
      showSearch
    />
  );
};

export default CatalogTagSelect;
