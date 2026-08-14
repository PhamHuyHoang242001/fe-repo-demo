// "Assets Mới & Cần Chú Ý" — the latest feed rendered as a compact, read-only table.
// Merges the N newest skills + N newest prompts, sorts by created_at desc. Display-only:
// no per-row action column (name / type / state only).

import React from 'react';
import { Reveal } from '../../skill/components/motion-primitives';
import { CARD_BASE } from '../../../theme/surfaces';
import { Icon } from '../../../layout/icons';
import { formatDate } from '../../skill/utils/format';
import { TypeBadge, StateBadge } from './badges';
import type { LatestArtifact, LatestFeed } from '../types';

const Row: React.FC<{ item: LatestArtifact }> = ({ item }) => (
  <tr className="transition-colors hover:bg-ah-pale/60">
    <td className="px-3 py-3">
      <div className="font-bold text-ah-ink">{item.name}</div>
      <div className="text-[11px] text-ah-muted">
        v{item.version} • {formatDate(item.created_at)}
        {item.created_by ? ` • ${item.created_by}` : ''}
      </div>
    </td>
    <td className="px-3 py-3">
      <TypeBadge type={item.type} />
    </td>
    <td className="px-3 py-3">
      <StateBadge state={item.state} />
    </td>
  </tr>
);

const RecentAssetsPanel: React.FC<{ feed: LatestFeed }> = ({ feed }) => {
  // Interleave both groups, newest first (BE already sorts within each group by created_at desc).
  const items = [...feed.data.skills, ...feed.data.prompts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <Reveal delay={0.06} className={`p-6 ${CARD_BASE}`}>
      <div className="mb-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-ah-ink">
          <Icon name="observability" className="h-4 w-4 text-ah-green" />
          Assets Mới &amp; Cần Chú Ý
        </h3>
        <p className="text-xs text-ah-muted">Các tài nguyên vừa nộp — phiên bản mới nhất của mỗi gói</p>
      </div>

      {items.length === 0 ? (
        <div className="py-10 text-center text-sm text-ah-muted">Chưa có tài nguyên nào.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ah-muted">
            <thead className="border-y border-ah-line bg-ah-pale/70 font-bold uppercase tracking-wider text-ah-ink">
              <tr>
                <th className="px-3 py-3">Tên Asset</th>
                <th className="px-3 py-3">Loại</th>
                <th className="px-3 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ah-line/70">
              {items.map((item) => (
                <Row key={`${item.type}-${item.code}`} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Reveal>
  );
};

export default RecentAssetsPanel;
