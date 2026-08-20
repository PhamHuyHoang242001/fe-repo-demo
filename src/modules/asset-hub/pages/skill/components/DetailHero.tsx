// Gradient hero band for the skill detail page. Bold treatment: SURFACE_HERO gradient +
// shimmer sweep + framer-motion entrance. Avatar, name, version badge, actions.
// XSS boundary is upstream (SkillDetail sanitizes before passing pkg down).

import React from 'react';
import { motion } from 'framer-motion';
import TagChip from '../../../components/TagChip';
import type { SkillPackageDetail } from '../types';
import { SURFACE_HERO } from '../../../theme/surfaces';
import { fadeInUp, hoverPress } from '../../../theme/motion';
import { formatDate } from '../utils/format';
import { StatusBadge } from './StatusBadge';
import SkillActions from './SkillActions';
import { resolveCategoryLabel } from '../../../utils/category';

// Large avatar variant — white ring on gradient; initials fallback.
const HeroAvatar: React.FC<{ name: string; avatarUrl?: string | null }> = ({ name, avatarUrl }) => {
  const [failed, setFailed] = React.useState(false);
  if (avatarUrl && !failed) {
    return (
      <motion.img
        src={avatarUrl}
        alt={name}
        onError={() => setFailed(true)}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="h-20 w-20 shrink-0 rounded-2xl object-cover shadow-ah-glow-sm ring-2 ring-white/40"
      />
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold text-white ring-2 ring-white/40 shadow-ah-glow-sm"
    >
      {name.slice(0, 2).toUpperCase()}
    </motion.div>
  );
};

interface DetailHeroProps {
  pkg: SkillPackageDetail;
}

const DetailHero: React.FC<DetailHeroProps> = ({ pkg }) => {
  const v = pkg.active_version;
  if (!v) {
    return (
      <div className="rounded-2xl border border-ah-line bg-ah-pale p-5 text-sm text-ah-muted">
        Skill này chưa có phiên bản được duyệt.
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className={`relative overflow-hidden rounded-2xl p-6 shadow-ah-glow ${SURFACE_HERO}`}
    >
      {/* Shimmer sweep — full-width diagonal highlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 animate-ah-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      {/* Subtle inner vignette to anchor the content */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-black/10"
      />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        {/* Identity block */}
        <div className="flex items-start gap-4">
          <HeroAvatar name={v.name} avatarUrl={v.avatar_url} />

          <div className="min-w-0">
            {/* Name + version chip + status */}
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white drop-shadow">{v.name}</h1>
              <motion.span
                {...hoverPress}
                className="cursor-default rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold text-white ring-1 ring-white/25 shadow"
              >
                v{v.version_no}
              </motion.span>
              {pkg.code && (
                <span className="cursor-default rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-white/90 ring-1 ring-white/20">
                  {pkg.code}
                </span>
              )}
              <StatusBadge status={pkg.status} />
            </div>

            {/* Short description */}
            {v.short_description && (
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-white/85">{v.short_description}</p>
            )}

            {/* Category + tags + date */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="rounded-md bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white ring-1 ring-white/20">
                {resolveCategoryLabel(v.category)}
              </span>
              {/* Publishing unit sits beside the category: both answer "what is this and whose". */}
              {pkg.publisher && (
                <span className="rounded-md bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white ring-1 ring-white/20">
                  {pkg.publisher.name}
                </span>
              )}
              {v.tags.map((t) => (
                <TagChip key={t.id} tag={t} variant="onDark" hash />
              ))}
              <span className="ml-1 text-[11px] text-white/65">Cập nhật {formatDate(v.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="shrink-0">
          <SkillActions packageId={pkg.id} file={v.file} skillMd={v.skill_md_content} />
        </div>
      </div>
    </motion.div>
  );
};

export default DetailHero;
