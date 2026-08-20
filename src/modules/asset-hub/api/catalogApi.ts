// Client for the cross-workspace catalogs at /api/v1/asset-hub/*.
// Raw axios for the same reason as skillApi: real HTTP status codes must reach the UI.
// The global interceptor in utils/http.ts attaches the bearer token.

import 'utils/http'; // side-effect: registers global auth interceptor
import axios from 'axios';
import { APP_CONFIG } from 'utils/env';
import type {
  AssetHubArtifactType,
  AssetHubTagKind,
  CatalogTag,
  ListUsersParams,
  PublisherRef,
  ResponsibleUser,
  WorkspaceStatRow,
} from '../types/catalog';

const url = (path: string) => `${APP_CONFIG.apiUrl}/asset-hub${path}`;

export interface ListTagsParams {
  artifact_type?: AssetHubArtifactType;
  kind?: AssetHubTagKind;
}

/** Seeded tag catalog, optionally narrowed to one workspace and/or ownership kind. */
export function listTags(params: ListTagsParams = {}): Promise<CatalogTag[]> {
  return axios.get(url('/tags'), { params }).then((res) => res.data?.data ?? []);
}

/** Seeded publishing units, shared by both workspaces. */
export function listPublishers(): Promise<PublisherRef[]> {
  return axios.get(url('/publishers')).then((res) => res.data?.data ?? []);
}

/** Paginated user directory backing the person-in-charge picker.
 *  Requires one of skill_upload / prompt_upload / skill_approve / prompt_approve on the BE —
 *  a caller without any of them gets 403, which the picker surfaces as an empty state. */
export function listUsers(
  params: ListUsersParams = {},
): Promise<{ data: ResponsibleUser[]; meta: { total: number; page: number; limit: number } }> {
  return axios.get(url('/users'), { params }).then((res) => res.data);
}

/** Dashboard counters for both workspaces in ONE request (replaces the two per-workspace calls). */
export function hubStats(): Promise<WorkspaceStatRow[]> {
  return axios.get(url('/stats')).then((res) => res.data?.data ?? []);
}
