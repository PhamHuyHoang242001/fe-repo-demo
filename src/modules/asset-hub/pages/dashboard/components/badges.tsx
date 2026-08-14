// Shared pill badges for the dashboard feed: artifact type (skill/prompt) + lifecycle state.
// Colours use the canonical ah-* tokens so they stay in sync with the rest of the module.

import React from 'react';
import type { ArtifactType, LatestArtifact } from '../types';

const TYPE_META: Record<ArtifactType, { label: string; glyph: string; cls: string }> = {
  skill: { label: 'Skill', glyph: '📦', cls: 'bg-ah-green-l text-ah-green border-ah-green/20' },
  prompt: { label: 'Prompt', glyph: '💬', cls: 'bg-ah-pale text-ah-green-br border-ah-green/15' },
};

export const TypeBadge: React.FC<{ type: ArtifactType }> = ({ type }) => {
  const m = TYPE_META[type];
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${m.cls}`}>
      {m.glyph} {m.label}
    </span>
  );
};

const STATE_META: Record<LatestArtifact['state'], { label: string; cls: string }> = {
  approved: { label: 'Đã duyệt', cls: 'bg-ah-green-l text-ah-green border-ah-green/25' },
  pending: { label: 'Chờ duyệt', cls: 'bg-ah-amber/10 text-ah-amber border-ah-amber/25' },
  rejected: { label: 'Từ chối', cls: 'bg-ah-red/10 text-ah-red border-ah-red/25' },
};

export const StateBadge: React.FC<{ state: LatestArtifact['state'] }> = ({ state }) => {
  const m = STATE_META[state];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold ${m.cls}`}>
      ● {m.label}
    </span>
  );
};
