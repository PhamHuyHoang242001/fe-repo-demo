// Detail page: /asset-hub/skill/:id. Single skillApi.detail() call → package + active_version + versions[].
// Layout: hero band → 2-column grid (main=Nội dung | rail=Thông tin + Lịch sử phiên bản).
// Animated entrances via Reveal/StaggerList. Full-frame rounded-2xl cards with shadow-ah-float.
//
// XSS BOUNDARY: DOMPurify strips dangerous HTML/attrs from the skill.md source BEFORE react-markdown renders it.

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import DOMPurify from 'dompurify';
import { detail as fetchDetail } from './api/skillApi';
import type { SkillPackageDetail } from './types';
import DetailHero from './components/DetailHero';
import MetadataRail from './components/MetadataRail';
import VersionsTimeline from './components/VersionsTimeline';
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
              preview={
                safeMd ? (
                  /* XSS boundary: skill.md is DOMPurify-sanitized before react-markdown renders it.
                     rehype-highlight adds .hljs token classes → atom-one-dark theme colors block code. */
                  <div className="max-w-none text-sm leading-relaxed text-ah-ink [&_a]:font-medium [&_a]:text-ah-green [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:my-3 [&_blockquote]:rounded-r-md [&_blockquote]:border-l-[3px] [&_blockquote]:border-ah-green [&_blockquote]:bg-ah-green-l/40 [&_blockquote]:py-1 [&_blockquote]:pl-4 [&_blockquote]:text-ah-muted [&_code:not(.hljs)]:rounded [&_code:not(.hljs)]:border [&_code:not(.hljs)]:border-ah-green/20 [&_code:not(.hljs)]:bg-ah-green-l [&_code:not(.hljs)]:px-1.5 [&_code:not(.hljs)]:py-0.5 [&_code:not(.hljs)]:text-[0.85em] [&_code:not(.hljs)]:font-semibold [&_code:not(.hljs)]:text-ah-green-d [&_h1]:mb-3 [&_h1]:mt-5 [&_h1]:border-b [&_h1]:border-ah-line [&_h1]:pb-2 [&_h1]:text-lg [&_h1]:font-extrabold [&_h1]:text-ah-green-d [&_h2]:mb-2.5 [&_h2]:mt-6 [&_h2]:border-b [&_h2]:border-ah-line [&_h2]:pb-1.5 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-ah-green-d [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-bold [&_h3]:text-ah-ink [&_hr]:my-5 [&_hr]:border-ah-line [&_img]:rounded-lg [&_li]:my-1 [&_li]:marker:text-ah-green [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_pre]:my-4 [&_pre]:overflow-hidden [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-ah-ink/15 [&_pre]:shadow-ah-float [&_strong]:font-bold [&_strong]:text-ah-ink [&_table]:my-3 [&_table]:w-full [&_td]:border [&_td]:border-ah-line [&_td]:px-3 [&_td]:py-1.5 [&_th]:border [&_th]:border-ah-line [&_th]:bg-ah-pale [&_th]:px-3 [&_th]:py-1.5 [&_th]:text-ah-ink [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5">
                    <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}>
                      {safeMd}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-ah-line bg-ah-pale px-5 py-4 text-sm text-ah-muted">
                    Chưa có nội dung skill.md.
                  </div>
                )
              }
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
