// Vertical version-history timeline for a skill package.
// Animation: stagger rows in; connector line drawn via border-l; state dots with ring halos.
// Each node: colored dot + version_no + StateBadge + date + changelog note.

import React from 'react';
import { motion } from 'framer-motion';
import type { SkillVersion } from '../types';
import { StateBadge } from './ReviewShared';
import { StaggerList, StaggerItem } from './motion-primitives';
import { fadeInUp } from '../../../theme/motion';
import { formatDate } from '../utils/format';

// State → dot color class (ring color is derived from same token via /30 opacity)
const DOT_COLOR: Record<string, { bg: string; ring: string }> = {
  approved: { bg: 'bg-ah-green',  ring: 'ring-ah-green/25' },
  pending:  { bg: 'bg-ah-amber',  ring: 'ring-ah-amber/25' },
  rejected: { bg: 'bg-ah-red',    ring: 'ring-ah-red/25' },
};
const FALLBACK_DOT = { bg: 'bg-ah-muted', ring: 'ring-ah-line' };

interface VersionsTimelineProps {
  versions: SkillVersion[];
}

const VersionsTimeline: React.FC<VersionsTimelineProps> = ({ versions }) => {
  if (versions.length === 0) {
    return (
      <motion.p
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="text-sm italic text-ah-muted"
      >
        Chưa có phiên bản nào.
      </motion.p>
    );
  }

  return (
    <StaggerList className="relative ml-2 pl-5">
      {/* Connector rail — full height, aligned with dots */}
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-ah-green/30 via-ah-line to-transparent"
        aria-hidden="true"
      />

      {versions.map((v, idx) => {
        const dot = DOT_COLOR[v.state] ?? FALLBACK_DOT;
        const isLast = idx === versions.length - 1;

        return (
          <StaggerItem key={v.id}>
            <div className={`relative pb-5 ${isLast ? 'pb-0' : ''}`}>
              {/* Node dot — centered on the rail */}
              <span
                className={`absolute -left-[22px] top-[3px] h-3.5 w-3.5 rounded-full ring-4 ring-ah-card shadow-ah-float ${dot.bg} ${dot.ring} ring-offset-0 outline-none ring-[3px]`}
                aria-hidden="true"
              />

              {/* Header row: version + badge + date */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold tabular-nums text-ah-ink">
                  v{v.version_no}
                </span>
                <StateBadge state={v.state} />
                <span className="text-xs tabular-nums text-ah-muted">
                  {formatDate(v.created_at)}
                </span>
              </div>

              {/* Changelog note */}
              {v.changelog_note ? (
                <p className="mt-1 text-sm leading-relaxed text-ah-muted">
                  {v.changelog_note}
                </p>
              ) : (
                <p className="mt-1 text-sm italic text-ah-muted/50">
                  Không có ghi chú.
                </p>
              )}
            </div>
          </StaggerItem>
        );
      })}
    </StaggerList>
  );
};

export default VersionsTimeline;
