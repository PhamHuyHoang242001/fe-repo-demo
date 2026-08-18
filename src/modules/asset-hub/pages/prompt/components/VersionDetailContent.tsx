import React from 'react';
import { motion } from 'framer-motion';
import type { PromptVersionDetail } from '../types';
import DiffView from './DiffView';
import { MetaRow, StateBadge } from './ReviewShared';
import { CARD_BASE } from '../../../theme/surfaces';
import { fadeInUp } from '../../../theme/motion';
import { resolveCategoryLabel } from '../../../utils/category';

interface Props {
  detail: PromptVersionDetail;
}

const VersionDetailContent: React.FC<Props> = ({ detail }) => {
  const { package: pkg, version, comparison } = detail;
  return (
    <div className="flex flex-col gap-4">
      <motion.div variants={fadeInUp} initial="hidden" animate="show" className={`${CARD_BASE} px-5 py-4`}>
        <div className="flex flex-col gap-2.5">
          <MetaRow label="Mã package" value={pkg.code ?? `#${pkg.id}`} />
          <MetaRow label="Danh mục" value={resolveCategoryLabel(version.category)} />
          <MetaRow label="Mô tả" value={version.short_description || '—'} />
          <MetaRow label="Tags" value={version.tags.length ? version.tags.join(', ') : '—'} />
          <MetaRow label="Người gửi" value={version.submitted_by_email ?? `#${version.submitted_by}`} />
          <MetaRow label="Ngày gửi" value={new Date(version.created_at).toLocaleString('vi-VN')} />
          {version.changelog_note && <MetaRow label="Thay đổi" value={version.changelog_note} />}
          {version.reviewed_at && (
            <MetaRow label="Ngày duyệt" value={new Date(version.reviewed_at).toLocaleString('vi-VN')} />
          )}
          {version.reviewed_by && (
            <MetaRow label="Người duyệt" value={version.reviewed_by_email ?? `#${version.reviewed_by}`} />
          )}
          {version.reject_reason && (
            <MetaRow label="Lý do từ chối" value={<span className="text-ah-red">{version.reject_reason}</span>} />
          )}
        </div>
      </motion.div>

      {version.state === 'pending' && comparison && (
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold text-ah-ink">Kiểm tra thay đổi</h2>
            <span className="text-xs text-ah-muted">
              {comparison.base_version_no == null ? 'Phiên bản đầu tiên' : `So với v${comparison.base_version_no}`}
            </span>
          </div>
          <DiffView base={comparison.base} incoming={comparison.incoming} />
        </section>
      )}

      {version.state !== 'pending' && (
        <motion.section variants={fadeInUp} initial="hidden" animate="show" className={`${CARD_BASE} px-5 py-4`}>
          <div className="mb-3 flex items-center gap-2">
            <StateBadge state={version.state} />
            <span className="text-sm font-bold text-ah-ink">Nội dung phiên bản</span>
          </div>
          <pre className="max-h-[640px] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-ah-pale p-4 font-mono text-[13px] text-ah-ink">
            {version.prompt_content || 'Không có nội dung prompt.'}
          </pre>
        </motion.section>
      )}
    </div>
  );
};

export default VersionDetailContent;
