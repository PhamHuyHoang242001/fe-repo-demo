// Skill Package workspace — 3-tab shell.
// This component OWNS all tab mount points and gating so Phases 4/5/6 only
// fill their respective tab file without touching this file.
//
// Tab visibility (M4 gating):
//   "Danh sách"  — always visible (view open to all authenticated users)
//   "Chờ duyệt"  — visible when canApprove || canUpload
//   "Upload"     — visible when canUpload only
import React, { useState } from 'react';
import { useSkillPermissions } from './hooks/useSkillPermissions';
import PublishedList from './tabs/PublishedList';
import ReviewQueue from './tabs/ReviewQueue';
import UploadForm from './tabs/UploadForm';

// ---- Types -------------------------------------------------------------------

type TabKey = 'list' | 'review' | 'upload';

interface Tab {
  key: TabKey;
  label: string;
  panel: React.ReactNode;
}

// ---- Sub-components ----------------------------------------------------------

const LoadingState: React.FC = () => (
  <div className="flex h-full items-center justify-center">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-ah-line border-t-ah-green" />
    <span className="ml-3 text-sm text-ah-muted">Đang tải quyền hạn…</span>
  </div>
);

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div className="flex h-full flex-col items-center justify-center gap-3">
    <p className="text-sm text-ah-red">{message}</p>
    <button
      onClick={onRetry}
      className="rounded-lg bg-ah-green px-4 py-2 text-sm font-semibold text-white hover:bg-ah-green-d transition-colors"
    >
      Thử lại
    </button>
  </div>
);

// ---- Tab bar -----------------------------------------------------------------

interface TabBarProps {
  tabs: Tab[];
  active: TabKey;
  onChange: (key: TabKey) => void;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, active, onChange }) => (
  <div className="flex gap-1 border-b border-ah-line">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        onClick={() => onChange(tab.key)}
        className={[
          'px-4 py-2 text-sm font-semibold transition-colors',
          active === tab.key
            ? 'border-b-2 border-ah-green text-ah-green'
            : 'text-ah-muted hover:text-ah-ink',
        ].join(' ')}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

// ---- Main component ----------------------------------------------------------

const SkillPackage: React.FC = () => {
  const { data: perms, loading, error, refetch } = useSkillPermissions();
  const [activeTab, setActiveTab] = useState<TabKey>('list');

  // Breadcrumb
  const crumb = (
    <div className="text-[11px] font-semibold uppercase tracking-wider text-ah-muted">
      Tài sản ứng dụng › Skill
    </div>
  );

  const heading = (
    <h1 className="mt-1 mb-4 text-[22px] font-extrabold tracking-tight text-ah-green-d">
      Skill Package
    </h1>
  );

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        {crumb}
        {heading}
        <div className="flex flex-1 rounded-xl border border-ah-line bg-ah-card">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col">
        {crumb}
        {heading}
        <div className="flex flex-1 rounded-xl border border-ah-line bg-ah-card">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  // perms is guaranteed non-null when !loading && !error
  const canUpload = perms?.canUpload ?? false;
  const canApprove = perms?.canApprove ?? false;

  const tabs: Tab[] = [
    { key: 'list', label: 'Danh sách', panel: <PublishedList /> },
    // "Chờ duyệt" shown when user can approve OR has uploaded (to track own submissions)
    ...(canApprove || canUpload
      ? [{ key: 'review' as TabKey, label: 'Chờ duyệt', panel: <ReviewQueue /> }]
      : []),
    ...(canUpload ? [{ key: 'upload' as TabKey, label: 'Upload', panel: <UploadForm /> }] : []),
  ];

  // Reset to 'list' if active tab is no longer visible after perms load
  const visibleKeys = tabs.map((t) => t.key);
  const resolvedActive = visibleKeys.includes(activeTab) ? activeTab : 'list';

  const activePanel = tabs.find((t) => t.key === resolvedActive)?.panel;

  return (
    <div className="flex h-full flex-col">
      {crumb}
      {heading}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-ah-line bg-ah-card">
        <TabBar tabs={tabs} active={resolvedActive} onChange={setActiveTab} />
        <div className="flex-1 overflow-auto p-4">{activePanel}</div>
      </div>
    </div>
  );
};

export default SkillPackage;
