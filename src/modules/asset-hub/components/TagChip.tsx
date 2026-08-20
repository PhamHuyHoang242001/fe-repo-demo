// One rendering of a catalog tag, shared by every read surface (cards, hero, rail, review).
// The colour encodes `kind`, so the enterprise/personal axis is readable at a glance without a
// legend — and identically in both workspaces.

import React from 'react';
import type { AssetHubTagKind, TagRef } from '../types/catalog';

/** `solid` is for light surfaces; `onDark` for the gradient hero, where tinted fills wash out. */
export type TagChipVariant = 'solid' | 'onDark';

const KIND_CLASS: Record<AssetHubTagKind, string> = {
  enterprise: 'border-ah-green/35 bg-ah-green-l text-ah-green-d',
  personal: 'border-amber-400/45 bg-amber-50 text-amber-700',
};

interface TagChipProps {
  tag: TagRef;
  variant?: TagChipVariant;
  className?: string;
  /** Prefix the name with '#', matching the previous freeform-tag styling. */
  hash?: boolean;
}

const TagChip: React.FC<TagChipProps> = ({ tag, variant = 'solid', className = '', hash = false }) => {
  const tone =
    variant === 'onDark' ? 'border-white/25 bg-white/10 text-white/90' : KIND_CLASS[tag.kind] ?? KIND_CLASS.enterprise;

  return (
    <span
      title={tag.kind === 'personal' ? 'Tag cá nhân' : 'Tag doanh nghiệp'}
      className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${tone} ${className}`}
    >
      {hash ? `#${tag.name}` : tag.name}
    </span>
  );
};

export default TagChip;
