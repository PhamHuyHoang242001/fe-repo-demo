// Detail page: /asset-hub/skill/:id. Single skillApi.detail() call → package + active_version + versions[] (M7).
// XSS BOUNDARY (C5): rehypeSanitize strips all disallowed tags/attrs from skill.md before React renders.
// Never use dangerouslySetInnerHTML with unsanitized content.

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { detail as fetchDetail } from './api/skillApi';
import type { SkillPackageDetail } from './types';
import VersionsTable from './components/VersionsTable';

// ---- Sub-components ------------------------------------------------------------

const LoadingState: React.FC = () => (
  <div className="flex flex-1 items-center justify-center">
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-ah-line border-t-ah-green" />
    <span className="ml-2 text-sm text-ah-muted">Đang tải chi tiết…</span>
  </div>
);

interface ErrorStateProps {
  status: number | null;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ status, onRetry }) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4">
    <p className="text-sm font-semibold text-ah-red">
      {status === 404 ? 'Skill không tồn tại.' : 'Không thể tải chi tiết skill.'}
    </p>
    {status !== 404 && (
      <button
        onClick={onRetry}
        className="rounded-lg bg-ah-green px-4 py-1.5 text-sm font-semibold text-white hover:bg-ah-green-d transition-colors"
      >
        Thử lại
      </button>
    )}
    <Link to="/asset-hub/skill" className="text-sm text-ah-green hover:text-ah-green-d">
      ← Quay lại danh sách
    </Link>
  </div>
);

// ---- Detail header ----------------------------------------------------------

// Renders the Strapi avatar image when avatar_url is present; falls back to initials on error.
const DetailAvatar: React.FC<{ name: string; avatarUrl?: string | null }> = ({ name, avatarUrl }) => {
  const [imgFailed, setImgFailed] = React.useState(false);

  if (avatarUrl && !imgFailed) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="h-16 w-16 shrink-0 rounded-xl object-cover"
        onError={() => setImgFailed(true)}
      />
    );
  }
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-ah-green-l text-lg font-bold text-ah-green-d">
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
};

interface DetailHeaderProps {
  pkg: SkillPackageDetail;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({ pkg }) => {
  const v = pkg.active_version;
  if (!v) {
    return (
      <div className="rounded-xl border border-ah-line bg-ah-pale p-4 text-sm text-ah-muted">
        Skill này chưa có phiên bản được duyệt.
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 rounded-xl border border-ah-line bg-ah-pale p-4">
      <DetailAvatar name={v.name} avatarUrl={v.avatar_url} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-extrabold text-ah-ink">{v.name}</h2>
          <span className="rounded-full bg-ah-green-l px-2 py-0.5 text-[11px] font-semibold text-ah-green-d">
            v{v.version_no}
          </span>
        </div>
        <p className="mt-1 text-sm text-ah-muted">{v.short_description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-ah-bg px-2 py-0.5 text-[10px] font-medium text-ah-muted border border-ah-line">
            {v.category}
          </span>
          {v.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-ah-line bg-ah-bg px-2 py-0.5 text-[10px] text-ah-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---- Main component ------------------------------------------------------------

const SkillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
      .then((data) => {
        if (!cancelled) {
          setPkg(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const status = (err as any)?.response?.status ?? null;
          setErrorStatus(status);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [id, tick]);

  const crumb = (
    <div className="mb-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-ah-muted">
      <Link to="/asset-hub/skill" className="hover:text-ah-green transition-colors">
        Skill
      </Link>
      <span>›</span>
      <span>#{id}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        {crumb}
        <LoadingState />
      </div>
    );
  }

  if (errorStatus !== null || !pkg) {
    return (
      <div className="flex h-full flex-col">
        {crumb}
        <ErrorState status={errorStatus} onRetry={() => setTick((n) => n + 1)} />
      </div>
    );
  }

  const mdContent = pkg.active_version?.skill_md_content ?? '';

  return (
    <div className="flex h-full flex-col gap-4">
      {crumb}
      <DetailHeader pkg={pkg} />

      {/* Skill.md content — sanitized XSS boundary via rehypeSanitize (C5) */}
      {mdContent ? (
        <div className="rounded-xl border border-ah-line bg-ah-card p-5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ah-muted">Nội dung</h3>
          {/* XSS boundary: rehypeSanitize strips all disallowed HTML from skill.md before render. */}
          <div className="prose prose-sm max-w-none text-ah-ink [&_a]:text-ah-green [&_code]:rounded [&_code]:bg-ah-pale [&_code]:px-1 [&_pre]:rounded-lg [&_pre]:bg-ah-pale [&_pre]:p-3">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{mdContent}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-ah-line bg-ah-pale px-5 py-4 text-sm text-ah-muted">
          Chưa có nội dung skill.md.
        </div>
      )}

      {/* Versions timeline — fetched within detail() (M7, no separate API call) */}
      <div className="rounded-xl border border-ah-line bg-ah-card p-5">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ah-muted">
          Lịch sử phiên bản ({pkg.versions.length})
        </h3>
        <VersionsTable versions={pkg.versions} />
      </div>
    </div>
  );
};

export default SkillDetail;
