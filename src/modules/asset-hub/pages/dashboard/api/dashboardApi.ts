// Raw axios client for the dashboard's cross-cutting "latest" feed.
// Follows the same conventions as skill/prompt apis: side-effect import wires the global auth
// interceptor; APP_CONFIG.apiUrl = BASE_URL + '/api/v1'; calls resolve to '/api/v1/asset-hub/*'.
// Workspace stats are fetched via the existing skill/prompt `stats()` (reused, not re-implemented).

import 'utils/http'; // side-effect: registers global auth interceptor
import axios from 'axios';
import { APP_CONFIG } from 'utils/env';
import type { LatestFeed } from '../types';

const url = (path: string) => `${APP_CONFIG.apiUrl}/asset-hub${path}`;

/** N newest skills + N newest prompts, each carrying its latest version's fields.
 *  `limit` overrides the BE-configured default (LATEST_ARTIFACTS_LIMIT) when provided. */
export function latest(limit?: number): Promise<LatestFeed> {
  return axios.get(url('/latest'), { params: limit ? { limit } : {} }).then((res) => res.data);
}
