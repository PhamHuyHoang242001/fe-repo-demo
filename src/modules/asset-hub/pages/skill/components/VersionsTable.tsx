// Versions history table for a skill package.
// Columns: version_no, created_at (date), state (colored badge), changelog_note.

import React from 'react';
import type { SkillVersion } from '../types';

interface VersionsTableProps {
  versions: SkillVersion[];
}

// State badge colors using ah-* tokens only.
const STATE_STYLES: Record<SkillVersion['state'], string> = {
  pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  approved: 'bg-ah-green-l text-ah-green-d border border-ah-line',
  rejected: 'bg-red-50 text-red-700 border border-red-200',
};

const STATE_LABELS: Record<SkillVersion['state'], string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
};

const formatDate = (iso: string): string => {
  try {
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
};

const VersionsTable: React.FC<VersionsTableProps> = ({ versions }) => {
  if (versions.length === 0) {
    return <p className="text-sm text-ah-muted">Chưa có phiên bản nào.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ah-line text-left text-xs font-semibold uppercase tracking-wide text-ah-muted">
            <th className="py-2 pr-4">Phiên bản</th>
            <th className="py-2 pr-4">Ngày tạo</th>
            <th className="py-2 pr-4">Trạng thái</th>
            <th className="py-2">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {versions.map((v) => (
            <tr key={v.id} className="border-b border-ah-line last:border-0">
              <td className="py-2 pr-4 font-semibold text-ah-ink">v{v.version_no}</td>
              <td className="py-2 pr-4 text-ah-muted">{formatDate(v.created_at)}</td>
              <td className="py-2 pr-4">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATE_STYLES[v.state]}`}
                >
                  {STATE_LABELS[v.state]}
                </span>
              </td>
              <td className="py-2 text-ah-muted">
                {v.changelog_note ? (
                  <span className="line-clamp-2">{v.changelog_note}</span>
                ) : (
                  <span className="italic opacity-50">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VersionsTable;
