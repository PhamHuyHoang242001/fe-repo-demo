// Single card in the published skill grid — "hero" treatment.
// Avatar: renders <img> when avatar_url is present; falls back to initials placeholder.
// Click navigates to /asset-hub/skill/:id.
// Animation: MotionCard (staggerItem variant + hoverLift). Glow border on hover.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { SkillListItem } from '../types';
import { GRADIENT_BORDER_HOVER, GRADIENT_BORDER_MASK } from '../../../theme/surfaces';
import { hoverPress, hoverLift, staggerItem } from '../../../theme/motion';
import { formatBytes, formatDate } from '../utils/format';
import { MotionCard } from './motion-primitives';

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
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ah-green-l text-sm font-bold text-ah-green-d ring-2 ring-ah-green/20">
      {initials || '?'}
    </div>
  );
};

interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
}

const Avatar: React.FC<AvatarProps> = ({ name, avatarUrl }) => {
  const [imgFailed, setImgFailed] = React.useState(false);

  if (avatarUrl && !imgFailed) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="h-12 w-12 shrink-0 rounded-xl object-cover ring-2 ring-ah-green/20 shadow-ah-glow-sm"
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
    <MotionCard
      className="group relative flex h-full cursor-pointer flex-col gap-3 overflow-hidden p-5 shadow-ah-float-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ah-green/60"
      onClick={() => navigate(`/asset-hub/skill/${skill.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/asset-hub/skill/${skill.id}`)}
    >
      {/* Gradient border revealed on hover (masked overlay — see GRADIENT_BORDER_HOVER) */}
      <span aria-hidden className={GRADIENT_BORDER_HOVER} style={GRADIENT_BORDER_MASK} />

      {/* Header row: avatar + name + version badge */}
      <div className="flex items-start gap-3">
        <Avatar name={v.name} avatarUrl={v.avatar_url} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-bold text-ah-ink transition-colors group-hover:text-ah-green-d">
              {v.name}
            </span>
            <motion.span
              {...hoverPress}
              className="shrink-0 rounded-md border border-ah-green/30 bg-ah-green-l px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-ah-green-d"
            >
              v{v.version_no}
            </motion.span>
          </div>
          {/* Category pill — full border, full rounded */}
          <span className="mt-1.5 inline-flex items-center rounded-full border border-ah-line bg-ah-pale px-2 py-0.5 text-[10px] font-semibold text-ah-muted">
            {CATEGORY_LABELS[v.category] ?? v.category}
          </span>
        </div>
      </div>

      {/* Short description — fixed 2-line height keeps cards aligned */}
      <p className="line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-ah-muted">
        {v.short_description}
      </p>

      {/* Tags — full-border pills */}
      {v.tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1">
          {v.tags.slice(0, 4).map((tag) => (
            <motion.span
              key={tag}
              {...hoverPress}
              className="rounded-full border border-ah-line bg-ah-pale px-2 py-0.5 text-[10px] font-medium text-ah-muted transition-colors hover:border-ah-green/40 hover:text-ah-green-d"
            >
              {tag}
            </motion.span>
          ))}
          {v.tags.length > 4 && (
            <span className="rounded-full border border-ah-line bg-ah-pale px-2 py-0.5 text-[10px] font-medium text-ah-muted">
              +{v.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer meta — zip size + last updated, pinned to baseline */}
      <div
        className={`flex items-center justify-between border-t border-ah-line pt-3 text-[10px] text-ah-muted ${v.tags.length > 0 ? '' : 'mt-auto'}`}
      >
        <span className="tabular-nums">{formatBytes(v.file?.size) || '—'}</span>
        <span className="tabular-nums">{formatDate(v.updated_at)}</span>
      </div>
    </MotionCard>
  );
};

export default SkillCard;
