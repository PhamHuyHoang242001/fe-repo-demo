// Detail page: /asset-hub/skill/:id. Single skillApi.detail() call → package + active_version + versions[].
// Layout: hero band → 2-column grid (main=Nội dung | rail=Thông tin + Lịch sử phiên bản).
// Animated entrances via Reveal/StaggerList. Full-frame rounded-2xl cards with shadow-ah-float.
//
// XSS BOUNDARY: DOMPurify strips dangerous HTML/attrs from the skill.md source BEFORE react-markdown renders it.

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import 'highlight.js/styles/atom-one-dark.css';
import DOMPurify from 'dompurify';
import { detail as fetchDetail } from './api/skillApi';
import type { SkillPackageDetail } from './types';
import DetailHero from './components/DetailHero';
import MetadataRail from './components/MetadataRail';
import VersionsTimeline from './components/VersionsTimeline';
import SkillMdPreview from './components/SkillMdPreview';
import { Reveal, StaggerList, StaggerItem } from './components/motion-primitives';
import { CARD_BASE } from '../../theme/surfaces';
import ArtifactContentTabs from '../../components/ArtifactContentTabs';

// ---- Sub-components ------------------------------------------------------------

const LoadingState: React.FC = () => (
  <div className="flex flex-1 items-center justify-center gap-3">
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-ah-line border-t-ah-green" />
    <span className="text-sm text-ah-muted">Đang tải chi tiết…</span>
  </div>
);

const ErrorState: React.FC<{ status: number | null; onRetry: () => void }> = ({ status, onRetry }) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4">
    <p className="text-sm font-semibold text-ah-red">
      {status === 404 ? 'Skill không tồn tại.' : 'Không thể tải chi tiết skill.'}
    </p>
    {status !== 404 && (
      <Button
        type="primary"
        size="large"
        onClick={onRetry}
      >
        Thử lại
      </Button>
    )}
    <Link to="/asset-hub/skill" className="text-sm text-ah-green hover:text-ah-green-d">
      ← Quay lại danh sách
    </Link>
  </div>
);

// ---- Main component ------------------------------------------------------------

const SkillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<SkillPackageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const numId = Number(id);
    if (!id || isNaN(numId)) {
      setErrorStatus(404);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setErrorStatus(null);
    fetchDetail(numId)
      .then((data) => { if (!cancelled) { setPkg(data); setLoading(false); } })
      .catch((err: unknown) => {
        if (!cancelled) {
          setErrorStatus((err as any)?.response?.status ?? null);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [id, tick]);

  // XSS boundary: sanitize the raw skill.md before react-markdown renders it.
  const safeMd = useMemo(
    () => DOMPurify.sanitize(pkg?.active_version?.skill_md_content ?? ''),
    [pkg],
  );

  const crumb = (
    <div className="mb-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-ah-muted">
      <Link to="/asset-hub/skill" className="transition-colors hover:text-ah-green">Skill</Link>
      <span>›</span>
      <span>#{id}</span>
    </div>
  );

  if (loading) return <div className="flex h-full flex-col">{crumb}<LoadingState /></div>;
  if (errorStatus !== null || !pkg)
    return <div className="flex h-full flex-col">{crumb}<ErrorState status={errorStatus} onRetry={() => setTick((n) => n + 1)} /></div>;

  // Edit button lives here (success branch) — NOT in DetailHero (early-returns when active_version is null,
  // yet pending/rejected-only own skills still need Edit). Disabled while a pending version exists.
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        {crumb}
        {pkg.isUpdate && (
          <Button
            type="default"
            size="middle"
            disabled={pkg.hasPendingVersion}
            title={pkg.hasPendingVersion ? 'Đang có phiên bản chờ duyệt' : undefined}
            onClick={() => navigate(`/asset-hub/skill/${id}/edit`)}
            className="shrink-0 border-ah-green text-ah-green hover:bg-ah-green-l"
          >
            Chỉnh sửa
          </Button>
        )}
      </div>

      {/* Hero — has its own entrance animation internally */}
      <DetailHero pkg={pkg} />

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        {/* Main column — Nội dung only */}
        <div className="flex min-w-0 flex-col gap-5">
          <Reveal>
            {/* Guide first, raw skill.md second — a reader wants the instructions, a reviewer the file. */}
            <ArtifactContentTabs
              guideHtml={pkg.active_version?.usage_guide_html}
              previewLabel="SKILL.md"
              preview={<SkillMdPreview zipTree={pkg.active_version?.zip_tree} safeMd={safeMd} />}
            />
          </Reveal>
        </div>

        {/* Sticky rail — drops below main under lg */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start">
          <StaggerList className="flex flex-col gap-5">
            <StaggerItem>
              <div className={`${CARD_BASE} p-5`}>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-ah-muted">Thông tin</p>
                <MetadataRail pkg={pkg} />
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className={`${CARD_BASE} p-5`}>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-ah-muted">
                  Lịch sử phiên bản ({pkg.versions.length})
                </h3>
                <VersionsTimeline versions={pkg.versions} />
              </div>
            </StaggerItem>
          </StaggerList>
        </aside>
      </div>
    </div>
  );
};

export default SkillDetail;
