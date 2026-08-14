// Contracts for the AI Hub dashboard (Control Plane overview).
// Mirrors the BE GET /asset-hub/latest envelope and reuses the per-workspace WorkspaceStats.

import type { WorkspaceStats } from '../skill/types';

export type { WorkspaceStats };

/** Discriminator shared by the latest feed + badges. */
export type ArtifactType = 'skill' | 'prompt';

/** One row of the "latest" feed — the newest version of a skill/prompt package.
 *  Field-for-field mirror of BE LatestArtifactItem (asset-hub/latest). `state` may be any
 *  lifecycle value (pending/approved/rejected) since the feed shows the latest version as-is. */
export interface LatestArtifact {
  code: string;
  version: number;
  created_at: string;
  name: string;
  description: string;
  type: ArtifactType;
  state: 'pending' | 'approved' | 'rejected';
  /** Submitter email ("Người tạo"). Null when the user row can't be resolved. */
  created_by: string | null;
}

/** BE GET /asset-hub/latest → { data: { skills, prompts }, meta: { limit } }. */
export interface LatestFeed {
  data: { skills: LatestArtifact[]; prompts: LatestArtifact[] };
  meta: { limit: number };
}

/** Everything the dashboard renders, fetched in one parallel batch. */
export interface DashboardData {
  skillStats: WorkspaceStats;
  promptStats: WorkspaceStats;
  latest: LatestFeed;
}
