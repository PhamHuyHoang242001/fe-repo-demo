// "Cấu Trúc Tài Sản Theo Loại" — per-type lifecycle breakdown bars driven by workspace stats.
// The three segments (approved / pending / rejected) PARTITION `total` (BE guarantees they sum),
// so the stacked bar is exact. `published` is shown separately in the footer (it's a distinct
// live-package count, not part of the lifecycle partition).

import React from 'react';
import { Reveal } from '../../skill/components/motion-primitives';
import { CARD_BASE } from '../../../theme/surfaces';
import { Icon, type IconName } from '../../../layout/icons';
import type { WorkspaceStats } from '../types';

interface Segment {
  label: string;
  value: number;
  bar: string;
  dot: string;
}

const BreakdownRow: React.FC<{ label: string; icon: IconName; stats: WorkspaceStats }> = ({ label, icon, stats }) => {
  const total = stats.total || 0;
  const segments: Segment[] = [
    { label: 'Đã duyệt', value: stats.approved, bar: 'bg-ah-green', dot: 'bg-ah-green' },
    { label: 'Chờ duyệt', value: stats.pending, bar: 'bg-ah-amber', dot: 'bg-ah-amber' },
    { label: 'Từ chối', value: stats.rejected, bar: 'bg-ah-red', dot: 'bg-ah-red' },
  ];
  const pct = (v: number) => (total > 0 ? (v / total) * 100 : 0);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-bold text-ah-ink">
          <Icon name={icon} className="h-4 w-4 text-ah-green" /> {label}
        </span>
        <span className="text-sm font-extrabold text-ah-ink">{total}</span>
      </div>

      <div className="flex h-3 w-full overflow-hidden rounded-full bg-ah-line/60">
        {total === 0
          ? null
          : segments.map((s) => (
              <div
                key={s.label}
                className={s.bar}
                style={{ width: `${pct(s.value)}%` }}
                title={`${s.label}: ${s.value}`}
              />
            ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-ah-muted">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${s.dot}`} /> {s.label}: {s.value}
          </span>
        ))}
      </div>
    </div>
  );
};

interface Props {
  skill: WorkspaceStats;
  prompt: WorkspaceStats;
}

const AssetBreakdownPanel: React.FC<Props> = ({ skill, prompt }) => (
  <Reveal delay={0.1} className={`flex flex-col justify-between p-6 ${CARD_BASE}`}>
    <div>
      <h3 className="mb-1 flex items-center gap-2 text-base font-bold text-ah-ink">
        <Icon name="governance" className="h-4 w-4 text-ah-green" />
        Cấu Trúc Tài Sản Theo Loại
      </h3>
      <p className="mb-6 text-xs text-ah-muted">Phân bố assets theo nhóm và trạng thái kiểm duyệt</p>

      <div className="space-y-6">
        <BreakdownRow label="Skill Package" icon="skill" stats={skill} />
        <BreakdownRow label="Prompt Library" icon="prompt" stats={prompt} />
      </div>
    </div>

    <div className="mt-6 flex items-center justify-between border-t border-ah-line pt-4 text-xs text-ah-muted">
      <span>
        Đã publish: <strong className="text-ah-ink">{skill.published + prompt.published}</strong> /{' '}
        {skill.total + prompt.total} assets
      </span>
    </div>
  </Reveal>
);

export default AssetBreakdownPanel;
