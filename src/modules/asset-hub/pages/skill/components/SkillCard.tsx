// Single card in the published skill grid.
// Avatar: renders <img> when avatar_url (Strapi path) is present; falls back to initials placeholder.
// Click navigates to /asset-hub/skill/:id.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { SkillListItem } from '../types';

interface SkillCardProps {
  skill: SkillListItem;
}

// Category label → short Vietnamese-friendly abbreviation for the badge
const CATEGORY_LABELS: Record<string, string> = {
  general: 'Tổng hợp',
  'data-analysis': 'Phân tích',
  automation: 'Tự động',
  integration: 'Tích hợp',
  reporting: 'Báo cáo',
  other: 'Khác',
};

const AvatarPlaceholder: React.FC<{ name: string }> = ({ name }) => {
  // Initials from first two words of name
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ah-green-l text-sm font-bold text-ah-green-d">
      {initials || '?'}
    </div>
  );
};

interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
}

// Renders the Strapi avatar image when available; falls back to initials on load error or absence.
const Avatar: React.FC<AvatarProps> = ({ name, avatarUrl }) => {
  const [imgFailed, setImgFailed] = React.useState(false);

  if (avatarUrl && !imgFailed) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="h-12 w-12 shrink-0 rounded-xl object-cover"
        onError={() => setImgFailed(true)}
      />
    );
  }
  return <AvatarPlaceholder name={name} />;
};

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const navigate = useNavigate();
  const { active_version: v } = skill;

  return (
    <button
      type="button"
      onClick={() => navigate(`/asset-hub/skill/${skill.id}`)}
      className="flex flex-col gap-3 rounded-xl border border-ah-line bg-ah-card p-4 text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ah-green"
    >
      {/* Header row: avatar + name + version badge */}
      <div className="flex items-start gap-3">
        <Avatar name={v.name} avatarUrl={v.avatar_url} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-bold text-ah-ink">{v.name}</span>
            <span className="shrink-0 rounded-full bg-ah-green-l px-2 py-0.5 text-[10px] font-semibold text-ah-green-d">
              v{v.version_no}
            </span>
          </div>
          <span className="mt-0.5 inline-block rounded-md bg-ah-pale px-2 py-0.5 text-[10px] font-medium text-ah-muted">
            {CATEGORY_LABELS[v.category] ?? v.category}
          </span>
        </div>
      </div>

      {/* Short description */}
      <p className="line-clamp-2 text-xs text-ah-muted">{v.short_description}</p>

      {/* Tags */}
      {v.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {v.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-ah-line bg-ah-bg px-2 py-0.5 text-[10px] text-ah-muted"
            >
              {tag}
            </span>
          ))}
          {v.tags.length > 4 && (
            <span className="rounded-full border border-ah-line bg-ah-bg px-2 py-0.5 text-[10px] text-ah-muted">
              +{v.tags.length - 4}
            </span>
          )}
        </div>
      )}
    </button>
  );
};

export default SkillCard;
