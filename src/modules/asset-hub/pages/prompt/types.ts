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
export const PROMPT_CATEGORIES = [
  'writing',
  'coding',
  'marketing',
  'analysis',
  'roleplay',
  'data',
  'other',
] as const;

export type PromptCategory = (typeof PROMPT_CATEGORIES)[number];

// ---- Core entities -------------------------------------------------------------

export interface PromptVersion {
  id: number;
  prompt_package_id: number;
  version_no: number;
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
  reviewed_at: string | null;
  reject_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface PromptPackage {
  id: number;
  active_version_id: number | null;
  status: 'active' | 'inactive';
  created_by: number;
  active_version?: PromptVersion | null;
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

// ---- My Prompt ------------------------------------------------------------------

/** Thin representative-version summary for the My Prompt grid. Mirrors the BE `my-items` projection,
 *  which deliberately OMITS `prompt_content`/`reject_reason` (grid renders only badge + identity).
 *  Do NOT widen this to the full `PromptVersion` — the BE does not ship those fields here. */
export interface MyPromptVersionSummary {
  id: number;
  version_no: number;
  state: 'pending' | 'approved' | 'rejected';
  name: string;
  short_description: string;
  category: PromptCategory;
  tags: string[];
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

/** A row in the My Prompt tab: the caller's own package + a representative version (active or latest). */
export interface MyPromptItem {
  id: number;
  status: 'active' | 'inactive';
  active_version_id: number | null;
  created_by: number;
  version: MyPromptVersionSummary | null;
  latest_state: 'pending' | 'approved' | 'rejected' | null;
}

// ---- Diff ----------------------------------------------------------------------

export interface PromptDiff {
  /** null means first version (no previous prompt content to diff against). */
  base: string | null;
  incoming: string;
  metadata: {
    version_id: number;
    version_no: number;
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

// ---- Permissions ---------------------------------------------------------------

export interface MyPromptPermissions {
  canUpload: boolean;
  canApprove: boolean;
}
