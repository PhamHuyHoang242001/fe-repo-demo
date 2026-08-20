// Compact metadata block for the detail rail. Read-only facts about the package/active version.
// Animated stagger on mount via StaggerList/StaggerItem from motion-primitives.
// Narrow-column friendly: label above, value below.

import React from 'react';
import TagChip from '../../../components/TagChip';
import type { SkillPackageDetail } from '../types';
import { formatDate } from '../utils/format';
import { StaggerList, StaggerItem } from './motion-primitives';
import { resolveCategoryLabel } from '../../../utils/category';

interface RowProps {
  label: string;
  children: React.ReactNode;
}

// Single metadata row — stagger child, full-frame label+value pair.
const Row: React.FC<RowProps> = ({ label, children }) => (
  <StaggerItem>
    <dt className="text-[11px] font-bold uppercase tracking-wider text-ah-muted">{label}</dt>
    <dd className="mt-0.5 text-sm font-medium text-ah-ink">{children}</dd>
  </StaggerItem>
);

interface MetadataRailProps {
  pkg: SkillPackageDetail;
}

const MetadataRail: React.FC<MetadataRailProps> = ({ pkg }) => {
  const v = pkg.active_version;
  return (
    <StaggerList>
      <dl className="space-y-3.5">
        <Row label="Trạng thái">
          {pkg.status === 'active' ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-ah-green" />
              Đang hiển thị
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-ah-muted" />
              Đã ẩn
            </span>
          )}
        </Row>

        {v && (
          <Row label="Danh mục">
            <span className="rounded-md bg-ah-pale px-2 py-0.5 text-[12px] font-semibold text-ah-ink">
              {resolveCategoryLabel(v.category)}
            </span>
          </Row>
        )}

        {v && v.tags.length > 0 && (
          <Row label="Tags">
            <div className="mt-1 flex flex-wrap gap-1">
              {v.tags.map((t) => (
                <TagChip key={t.id} tag={t} hash />
              ))}
            </div>
          </Row>
        )}

        {/* Publishing unit and people in charge are package-scoped — they describe who owns the
            artifact, as opposed to "Người đăng", who merely submitted this version. */}
        <Row label="Đơn vị phát hành">{pkg.publisher?.name ?? '—'}</Row>

        {pkg.responsible_users && pkg.responsible_users.length > 0 && (
          <Row label="Người chịu trách nhiệm">
            <div className="mt-1 flex flex-wrap gap-1">
              {pkg.responsible_users.map((u) => (
                <span
                  key={u.id}
                  className="break-all rounded-full border border-ah-line bg-ah-pale px-2 py-0.5 text-[11px] font-medium text-ah-muted"
                >
                  {u.email}
                </span>
              ))}
            </div>
          </Row>
        )}

        {v && <Row label="Người đăng"><span className="break-all">{v.submitted_by_email ?? `#${v.submitted_by}`}</span></Row>}

        {v && <Row label="Cập nhật">{formatDate(v.updated_at)}</Row>}

        <Row label="Số phiên bản">
          <span className="tabular-nums font-bold text-ah-green">{pkg.versions.length}</span>
        </Row>
      </dl>
    </StaggerList>
  );
};

export default MetadataRail;
