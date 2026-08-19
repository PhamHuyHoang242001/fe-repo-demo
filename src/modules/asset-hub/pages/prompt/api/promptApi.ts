// Raw axios client for the Prompt Package workspace.
//
// WHY raw axios (not HttpService):
//   HttpService.get/post swallow errors — they call handleError and return `undefined`.
//   Inline UI needs real HTTP status codes (422 validation, 409 pending-conflict, 403 forbidden)
//   to show contextual messages. Raw axios lets rejections propagate so callers can
//   inspect `err.response.status` themselves.
//
// WHY no manual auth header:
//   The global axios request interceptor in utils/http.ts (line 32) automatically attaches
//   `Authorization: Bearer <token>` to every axios call. Importing utils/http.ts as a side
//   effect wires that interceptor; we import it here only for that purpose.
//
// URL pattern: APP_CONFIG.apiUrl = BASE_URL + '/api/v1'.
//   Calls use '/prompt/*' → resolves to '/api/v1/prompt/*' matching BE controller prefix.
//
// The prompt text is sent inline (JSON `prompt_content`) — no ZIP, no backend fetch.
// The optional avatar still uses a pull-based flow: uploadFileToStrapi() sends the image to
// Strapi and returns its URL; that URL is then POSTed in the JSON body. The Strapi call uses a
// separate axios instance so the backend auth token is never leaked to Strapi.

import 'utils/http'; // side-effect: registers global auth interceptor
import axios from 'axios';
import { APP_CONFIG } from 'utils/env';
import { saveBlobResponse } from '../../../utils/download-file';

import type {
  Paginated,
  PromptListItem,
  PromptPackageDetail,
  PromptPackage,
  PromptVersion,
  PromptDiff,
  MyPromptPermissions,
  VersionRow,
  ListVersionsParams,
  VersionCodeOption,
  PromptVersionDetail,
  WorkspaceStats,
} from '../types';

// Convenience helper — keeps call sites concise.
const url = (path: string) => `${APP_CONFIG.apiUrl}/prompt${path}`;

// ---- Strapi upload (pull-based flow step 1) -----------------------------------

// Dedicated axios instance so the global BE auth interceptor (utils/http.ts) does
// NOT attach the backend user token to the Strapi request. Strapi auth is its own
// optional bearer token (STRAPI_UPLOAD_TOKEN).
const strapiClient = axios.create();

// Resolve a Strapi-returned URL (often root-relative like /uploads/x.zip) to absolute.
function toAbsoluteStrapiUrl(u: string): string {
  return /^https?:\/\//i.test(u) ? u : `${APP_CONFIG.strapiUploadUrl}${u}`;
}

/** Upload one file to Strapi `/api/upload` and return its absolute URL.
 *  Strapi's multipart field name is `files`; the response is an array. */
export async function uploadFileToStrapi(file: File): Promise<string> {
  const form = new FormData();
  form.append('files', file);

  const headers: Record<string, string> = {};
  if (APP_CONFIG.strapiUploadToken) {
    headers['Authorization'] = `Bearer ${APP_CONFIG.strapiUploadToken}`;
  }

  const res = await strapiClient.post(`${APP_CONFIG.strapiUploadUrl}/api/upload`, form, { headers });
  const first = Array.isArray(res.data) ? res.data[0] : null;
  if (!first?.url) throw new Error('Strapi upload returned no url');
  return toAbsoluteStrapiUrl(first.url);
}

// Payload shapes for the JSON backend upload.
// The prompt artifact is sent inline as `prompt_content` (plain text, no ZIP, no Strapi fetch).
// The avatar stays an optional plain URL (uploaded to Strapi first, then its URL sent here).
export interface UploadNewPayload {
  prompt_content: string;
  avatar_url?: string;
  name: string;
  short_description: string;
  category_id: number;
  tags?: string[];
}

export interface UploadUpdatePayload extends UploadNewPayload {
  changelog_note?: string;
}

// BE response shapes (the backend returns thin id envelopes, NOT full entities).
// createNew → { package: { id }, version: { id, version_no } }; createVersion → { version: {...} }.
export interface UploadNewResult {
  package: { id: number };
  version: { id: number; version_no: number };
}
export interface UploadUpdateResult {
  version: { id: number; version_no: number };
}

// ---- Download ------------------------------------------------------------------

/** Download the active version as a professional .md via the BearerGuard-protected BE endpoint.
 *  Fetches as a blob through the authenticated client (a plain anchor would omit the auth header
 *  and 401) and saves it client-side. Filename comes from the response header. */
export async function downloadMarkdown(id: number): Promise<void> {
  const res = await axios.get<Blob>(url(`/items/${id}/download`), { responseType: 'blob' });
  saveBlobResponse(res, `prompt-${id}.md`);
}

// ---- List & Detail -------------------------------------------------------------

/** List published prompts (active_version != null, status=active).
 *  Returns Paginated<PromptListItem> where res.data is the envelope directly. */
export function list(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
    tags?: string[];
  } = {},
): Promise<Paginated<PromptListItem>> {
  return axios.get(url('/items'), { params }).then((res) => res.data);
}

/** Full detail: package + all versions + caller flags (isUpdate, hasPendingVersion). */
export function detail(id: number): Promise<PromptPackageDetail> {
  return axios.get(url(`/items/${id}`)).then((res) => res.data);
}

/** Version-management list: flat 1 row per version, always scoped to the caller by the backend.
 *  Package ids are a display filter only and use the comma-separated wire contract. */
export function listVersions(params: ListVersionsParams = {}): Promise<Paginated<VersionRow>> {
  const { prompt_package_id: packageIds, ...rest } = params;
  const queryParams = {
    ...rest,
    ...(packageIds?.length ? { prompt_package_id: packageIds.join(',') } : {}),
  };
  return axios.get(url('/versions'), { params: queryParams }).then((res) => res.data);
}

/** Distinct package codes visible to the caller — feeds the filter multi-select. Same BE visibility
 *  predicate as listVersions, so options never drift from the rows. */
export function listVersionCodes(): Promise<{ data: VersionCodeOption[] }> {
  return axios.get(url('/versions'), { params: { codesOnly: true } }).then((res) => res.data);
}

// ---- Upload --------------------------------------------------------------------

/** Create a new prompt package (first upload). JSON body with Strapi URLs.
 *  Returns `{ package: { id }, version: { id, version_no } }` — use `.package.id` to navigate. */
export function uploadNew(payload: UploadNewPayload): Promise<UploadNewResult> {
  return axios.post(url('/items'), payload).then((res) => res.data);
}

/** Submit a new version for an existing prompt package. JSON body with Strapi URLs.
 *  PUT (full-body replace of the draft) — BE contract; path/body/response unchanged from POST.
 *  Returns `{ version: { id, version_no } }`. */
export function uploadUpdate(id: number, payload: UploadUpdatePayload): Promise<UploadUpdateResult> {
  return axios.put(url(`/items/${id}/versions`), payload).then((res) => res.data);
}

// ---- Review --------------------------------------------------------------------

/** List pending versions for review.
 *  Approvers see all pending; everyone else is forced to own-submitted.
 *  submitted_by / category_id / sort are applied server-side on the pending queue. */
export function reviews(
  params: {
    page?: number;
    limit?: number;
    submitted_by?: number;
    category_id?: number;
    sort?: 'newest' | 'oldest' | 'name';
  } = {},
): Promise<Paginated<PromptVersion>> {
  return axios.get(url('/reviews'), { params }).then((res) => res.data);
}

/** Distinct pending-version submitters for the review-queue "Người tạo" filter. */
export function reviewSubmitters(): Promise<{ data: Array<{ id: number; email: string | null }> }> {
  return axios.get(url('/reviews/submitters')).then((res) => res.data);
}

/** Git-style diff for a pending version vs its predecessor's prompt.md. */
export function diff(versionId: number): Promise<PromptDiff> {
  return axios.get(url(`/versions/${versionId}/diff`)).then((res) => res.data);
}

/** Full standalone detail for any visible version. */
export function versionDetail(versionId: number): Promise<PromptVersionDetail> {
  return axios.get(url(`/versions/${versionId}`)).then((res) => res.data);
}

/** Approve a pending version (sets it as active_version). */
export function approve(versionId: number): Promise<PromptVersion> {
  return axios.post(url(`/versions/${versionId}/approve`)).then((res) => res.data);
}

/** Reject a pending version with a required reason. */
export function reject(versionId: number, reason: string): Promise<PromptVersion> {
  return axios.post(url(`/versions/${versionId}/reject`), { reason }).then((res) => res.data);
}

// ---- Status toggle -------------------------------------------------------------

/** Toggle prompt package visibility (active ↔ inactive). Approver-only. */
export function toggleStatus(id: number, status: 'active' | 'inactive'): Promise<PromptPackage> {
  return axios.patch(url(`/items/${id}/status`), { status }).then((res) => res.data);
}

// ---- Permissions ---------------------------------------------------------------

/** Fetch the caller's prompt-specific permissions (canUpload, canApprove).
 *  Fetched once on mount by usePromptPermissions; not cached globally. */
export function myPermissions(): Promise<MyPromptPermissions> {
  return axios.get(url('/my-permissions')).then((res) => res.data);
}

// ---- Stats ---------------------------------------------------------------------

/** Whole-workspace Prompt dashboard counters (total/pending/approved/rejected/published).
 *  BE wraps the payload in `{ data }`; unwrap to the flat counters for the caller. */
export function stats(): Promise<WorkspaceStats> {
  return axios.get(url('/stats')).then((res) => res.data.data);
}
