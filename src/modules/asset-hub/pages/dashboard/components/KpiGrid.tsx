// KPI row — four headline counters derived from the two workspace stat blocks.
// Mirrors mock.html's KPI grid: Tổng Assets / Skill Packages / Prompts / Chờ Phê Duyệt.

import React from 'react';
import { StaggerList, StaggerItem } from '../../skill/components/motion-primitives';
import { CARD_BASE } from '../../../theme/surfaces';
import { Icon, type IconName } from '../../../layout/icons';
import type { WorkspaceStats } from '../types';

interface KpiCardProps {
  label: string;
  value: number;
  hint: string;
  hintTone: 'muted' | 'good' | 'warn';
  icon: IconName;
  iconClass: string;
  valueClass: string;
}

const HINT_TONE: Record<KpiCardProps['hintTone'], string> = {
  muted: 'text-ah-muted',
  good: 'text-ah-green',
  warn: 'text-ah-amber',
};

const KpiCard: React.FC<KpiCardProps> = ({ label, value, hint, hintTone, icon, iconClass, valueClass }) => (
  <StaggerItem className={`flex items-center justify-between p-5 ${CARD_BASE}`}>
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ah-muted">{label}</p>
      <h3 className={`mt-1 text-2xl font-extrabold ${valueClass}`}>{value.toLocaleString('vi-VN')}</h3>
      <span className={`mt-1 inline-block text-xs font-medium ${HINT_TONE[hintTone]}`}>{hint}</span>
    </div>
    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${iconClass}`}>
      <Icon name={icon} className="h-6 w-6" />
    </div>
  </StaggerItem>
);

interface Props {
  skill: WorkspaceStats;
  prompt: WorkspaceStats;
}

const KpiGrid: React.FC<Props> = ({ skill, prompt }) => {
  const cards: KpiCardProps[] = [
    {
      label: 'Tổng Assets',
      value: skill.total + prompt.total,
      hint: `${skill.published + prompt.published} đã publish`,
      hintTone: 'good',
      icon: 'catalog',
      iconClass: 'border-ah-line bg-ah-pale text-ah-ink',
      valueClass: 'text-ah-ink',
    },
    {
      label: 'Skill Packages',
      value: skill.published,
      hint: 'Published',
      hintTone: 'muted',
      icon: 'skill',
      iconClass: 'border-ah-green/15 bg-ah-green-l text-ah-green',
      valueClass: 'text-ah-green-d',
    },
    {
      label: 'Prompts',
      value: prompt.published,
      hint: 'Published',
      hintTone: 'muted',
      icon: 'prompt',
      iconClass: 'border-ah-green/15 bg-ah-green-l text-ah-green-br',
      valueClass: 'text-ah-green-br',
    },
    {
      label: 'Chờ Phê Duyệt',
      value: skill.pending + prompt.pending,
      hint: 'Cần xử lý',
      hintTone: 'warn',
      icon: 'observability',
      iconClass: 'border-ah-amber/20 bg-ah-amber/10 text-ah-amber',
      valueClass: 'text-ah-amber',
    },
  ];

  return (
    <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
      {cards.map((c) => (
        <KpiCard key={c.label} {...c} />
      ))}
    </StaggerList>
  );
};

export default KpiGrid;
