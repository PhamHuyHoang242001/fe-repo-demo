// Shared TypeScript contracts for the Prompt Package workspace.
// Mirror the BE entity shapes exactly so callers get compile-time safety.
// Keep in sync with the BE when field shapes change.

// ---- Pagination ----------------------------------------------------------------

/** BE pagination envelope: `{data, meta}` at the top level of res.data. */
export interface Paginated<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

// ---- Category ------------------------------------------------------------------

// Mirrors BE PromptCategory enum (prompt-category.constant.ts — single source of truth).
// Update both locations when the taxonomy changes.
export const PROMPT_CATEGORIES = ['writing', 'coding', 'marketing', 'analysis', 'roleplay', 'data', 'other'] as const;

export type PromptCategory = (typeof PROMPT_CATEGORIES)[number];

// ---- Core entities -------------------------------------------------------------

export interface PromptVersion {
  id: number;
  prompt_package_id: number;
  version_no: number;
  /** Predecessor approved version_no; null for the first-ever version. */
  old_version?: number | null;
  state: 'pending' | 'approved' | 'rejected';
  name: string;
  short_description: string;
  category: PromptCategory;
  tags: string[];
  /** Strapi URL of the avatar image. Null when no avatar is set. */
  avatar_url?: string | null;
  prompt_content: string;
  changelog_note: string | null;
  submitted_by: number;
  /** Resolved email of the submitter (BE joins users). Null if unresolved. Prefer over the raw id. */
  submitted_by_email?: string | null;
  reviewed_by: number | null;
  reviewed_by_email?: string | null;
  reviewed_at: string | null;
  reject_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface PromptPackage {
  id: number;
  /** Stable public code `prompt_<id>` (BE-generated). Present on detail responses. */
  code?: string;
  active_version_id: number | null;
  status: 'active' | 'inactive';
  created_by: number;
  active_version?: PromptVersion | null;
}

// ---- Version management (flat 1-row-per-version list) --------------------------

/** One row of the version-management list. Thin — carries NO content. */
export interface VersionRow {
  package_id: number;
  code: string;
  package_name: string;
  version_id: number;
  /** Predecessor approved version_no; null for the first-ever version. */
  old_version: number | null;
  version_no: number;
  state: 'pending' | 'approved' | 'rejected';
  submitted_by_email: string | null;
  created_at: string;
  /** True when this is a first-ever pending (state=pending AND old_version=null) → "mới" badge. */
  is_first_pending: boolean;
}

export type VersionStateFilter = 'pending' | 'approved' | 'rejected' | 'all';

export interface ListVersionsParams {
  /** Package ids selected in the UI; the API client serializes them as `prompt_package_id=1,2,3`. */
  prompt_package_id?: number[];
  state?: VersionStateFilter;
  page?: number;
  pageSize?: number;
  sort?: 'newest' | 'oldest';
}

/** A distinct-code option for the filter multi-select (from codesOnly mode). */
export interface VersionCodeOption {
  package_id: number;
  code: string;
  package_name: string;
}

// ---- Composite shapes ----------------------------------------------------------

/** Full detail: package + resolved active_version + all versions for the timeline.
 *  `isUpdate`: caller may edit (approver=any, uploader=own). `hasPendingVersion`: a pending version
 *  already exists (Edit is blocked while true). */
export type PromptPackageDetail = PromptPackage & {
  active_version: PromptVersion | null;
  versions: PromptVersion[];
  isUpdate: boolean;
  hasPendingVersion: boolean;
};

/** List row: package guaranteed to have a resolved active_version (published only). */
export type PromptListItem = PromptPackage & {
  active_version: PromptVersion;
};

// ---- Diff ----------------------------------------------------------------------

export interface PromptDiff {
  /** null means first version (no previous prompt content to diff against). */
  base: string | null;
  incoming: string;
  metadata: {
    version_id: number;
    version_no: number;
    /** Predecessor approved version_no; null for the first-ever version. Drives the pending label. */
    old_version: number | null;
    state: string;
    name: string;
    category: string;
    tags: string[];
    changelog_note: string | null;
    submitted_by: number;
    /** Resolved email of the submitter (BE joins users). Null if unresolved. Prefer over the raw id. */
    submitted_by_email?: string | null;
    submitted_at: string;
  };
}

export interface PromptVersionDetail {
  package: Pick<PromptPackage, 'id' | 'code' | 'status' | 'active_version_id' | 'created_by'>;
  version: PromptVersion;
  comparison: null | {
    base_version_id: number | null;
    base_version_no: number | null;
    base: string | null;
    incoming: string;
  };
  can_review: boolean;
}

// ---- Permissions ---------------------------------------------------------------

export interface MyPromptPermissions {
  canUpload: boolean;
  canApprove: boolean;
}
