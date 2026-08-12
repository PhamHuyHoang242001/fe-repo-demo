// Animated pill tab bar for the Skill Package workspace.
// Uses framer-motion LayoutGroup + layoutId so the active indicator slides smoothly between tabs.
// Full-frame frosted pill container — no half border-b (border policy: full frame only).

import React from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { springSnappy } from '../../../theme/motion';

export type TabKey = 'list' | 'mine' | 'review';

export interface TabDef {
  key: TabKey;
  label: string;
  count?: number;
}

interface SkillTabBarProps {
  tabs: TabDef[];
  active: TabKey;
  onChange: (key: TabKey) => void;
}

const SkillTabBar: React.FC<SkillTabBarProps> = ({ tabs, active, onChange }) => (
  <div className="px-4 pt-4 pb-0">
    <LayoutGroup id="skill-tabs">
      <div className="relative flex items-center gap-1 rounded-2xl border border-ah-line bg-ah-pale/60 p-1">
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className="relative flex min-w-0 items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ah-green/60"
              style={{ zIndex: 1 }}
            >
              {/* Sliding active pill — rendered behind text via layoutId */}
              {isActive && (
                <motion.span
                  layoutId="tab-active-pill"
                  className="absolute inset-0 rounded-xl bg-white shadow-ah-float ring-1 ring-ah-line"
                  transition={springSnappy}
                  style={{ zIndex: -1 }}
                />
              )}
              <span className={isActive ? 'text-ah-green-d' : 'text-ah-muted'}>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <motion.span
                  layout
                  className={[
                    'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums leading-none',
                    isActive ? 'bg-ah-green-l text-ah-green-d' : 'bg-ah-line/60 text-ah-muted',
                  ].join(' ')}
                >
                  {tab.count}
                </motion.span>
              )}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
    {/* Full-width hairline separator below the pill bar */}
    <div className="mt-3 border-b border-ah-line" />
  </div>
);

export default SkillTabBar;
