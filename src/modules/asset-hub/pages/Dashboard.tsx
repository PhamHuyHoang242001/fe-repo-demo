// AI Hub dashboard (Control Plane overview) — route index /asset-hub.
// Composes hero + KPI grid + latest feed + lifecycle breakdown from ONE parallel data batch
// (skill stats + prompt stats + latest feed). Layout mirrors mock.html's dashboard page.

import React from 'react';
import { useDashboardData } from './dashboard/hooks/useDashboardData';
import HeroBanner from './dashboard/components/HeroBanner';
import KpiGrid from './dashboard/components/KpiGrid';
import RecentAssetsPanel from './dashboard/components/RecentAssetsPanel';
import AssetBreakdownPanel from './dashboard/components/AssetBreakdownPanel';

const LoadingState: React.FC = () => (
  <div className="flex h-full items-center justify-center gap-3 py-24">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-ah-line border-t-ah-green" />
    <span className="text-sm text-ah-muted">Đang tải tổng quan…</span>
  </div>
);

const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="flex h-full flex-col items-center justify-center gap-3 py-24">
    <p className="text-sm text-ah-red">{message}</p>
    <button
      onClick={onRetry}
      className="rounded-xl bg-ah-green px-5 py-2 text-sm font-bold text-white shadow transition-colors hover:bg-ah-green-d"
    >
      Thử lại
    </button>
  </div>
);

const Dashboard: React.FC = () => {
  const { data, loading, error, refetch } = useDashboardData();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data) return null;

  const { skillStats, promptStats, latest } = data;

  return (
    <div className="space-y-6">
      <HeroBanner />
      <KpiGrid skill={skillStats} prompt={promptStats} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentAssetsPanel feed={latest} />
        <AssetBreakdownPanel skill={skillStats} prompt={promptStats} />
      </div>
    </div>
  );
};

export default Dashboard;
