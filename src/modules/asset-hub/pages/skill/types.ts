// Shared TypeScript contracts for the Skill Package workspace.
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

import type { AssetHubCategory, AssetHubCategoryValue, AssetHubCategoryType } from '../../types/category';
import type { PublisherRef, ResponsibleUser, TagRef } from '../../types/catalog';

export type SkillCategoryType = Extract<AssetHubCategoryType, 'skill'>;
export type SkillCategory = AssetHubCategoryValue;
export type SkillCategoryRef = AssetHubCategory;

// ---- Core entities -------------------------------------------------------------

/** The skill .zip as a single file object, mirroring the diagnostic report's `file` field.
 *  Null when the version has no zip row. */
export interface SkillFile {
  file_url: string;
  name: string | null;
  size: number | null;
  mime_type: string | null;
}

export interface SkillVersion {
  id: number;
  skill_package_id: number;
  version_no: number;
  /** Predecessor approved version_no; null for the first-ever version. */
  old_version?: number | null;
  state: 'pending' | 'approved' | 'rejected';
  name: string;
  short_description: string;
  category_id: number | null;
  category: SkillCategory;
  category_detail?: SkillCategoryRef | null;
  /** Catalog tags attached to this version. Objects, not strings — the id drives filters and the
   *  kind drives the chip colour. */
  tags: TagRef[];
  /** Sanitized usage-guide HTML. Present ONLY on item detail and version detail; every list,
   *  review-queue and version-management row omits it (it can run to 200k characters). */
  usage_guide_html?: string;
  /** Skill .zip file object (metadata folded from skill_version_files). Null when absent. */
  file: SkillFile | null;
  /** Strapi URL of the avatar image. Null when no avatar is set. */
  avatar_url?: string | null;
  skill_md_content: string;
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

export interface SkillPackage {
  id: number;
  /** Stable public code `skill_<id>` (BE-generated). Present on detail responses. */
  code?: string;
  active_version_id: number | null;
  status: 'active' | 'inactive';
  created_by: number;
  active_version?: SkillVersion | null;
  /** Publishing unit (package-scoped). Null only if the row was deleted from the catalog. */
  publisher?: PublisherRef | null;
  /** People in charge (package-scoped, full-replace on every write). */
  responsible_users?: ResponsibleUser[];
  /** Publishing unit id — carried on the raw package row; prefer `publisher` for display. */
  publisher_id?: number;
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
  /** Catalog tags of this version (batched by the BE onto the raw projection). */
  tags: TagRef[];
  submitted_by_email: string | null;
  created_at: string;
  /** Version icon URL (BE column avatar_url). Null when none was uploaded. */
  avatar_url: string | null;
  /** True when this is a first-ever pending (state=pending AND old_version=null) → "mới" badge. */
  is_first_pending: boolean;
}

export type VersionStateFilter = 'pending' | 'approved' | 'rejected' | 'all';

export interface ListVersionsParams {
  /** Package ids selected in the UI; the API client serializes them as `skill_package_id=1,2,3`. */
  skill_package_id?: number[];
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
export type SkillPackageDetail = SkillPackage & {
  active_version: SkillVersion | null;
  versions: SkillVersion[];
  isUpdate: boolean;
  hasPendingVersion: boolean;
};

/** List row: package guaranteed to have a resolved active_version (published only). */
export type SkillListItem = SkillPackage & {
  active_version: SkillVersion;
};

// ---- Diff ----------------------------------------------------------------------

export interface SkillDiff {
  /** null means first version (no previous skill.md). */
  base: string | null;
  incoming: string;
  metadata: {
    version_id: number;
    version_no: number;
    /** Stable public code of the item (skill_<id>). Null if the package row is missing. */
    code: string | null;
    /** Predecessor approved version_no; null for the first-ever version. Drives the pending label. */
    old_version: number | null;
    state: string;
    name: string;
    avatar_url: string | null;
    category_id: number | null;
    category: SkillCategory;
    tags: TagRef[];
    /** Sanitized usage-guide HTML of the version under review (this endpoint is 403-gated). */
    usage_guide_html?: string;
    changelog_note: string | null;
    submitted_by: number;
    /** Resolved email of the submitter (BE joins users). Null if unresolved. Prefer over the raw id. */
    submitted_by_email?: string | null;
    submitted_at: string;
  };
}

export interface SkillVersionDetail {
  package: Pick<
    SkillPackage,
    'id' | 'code' | 'status' | 'active_version_id' | 'created_by' | 'publisher' | 'responsible_users'
  >;
  version: SkillVersion;
  comparison: null | {
    base_version_id: number | null;
    base_version_no: number | null;
    base: string | null;
    incoming: string;
  };
  can_review: boolean;
}

// ---- Permissions ---------------------------------------------------------------

export interface MySkillPermissions {
  canUpload: boolean;
  canApprove: boolean;
}

// ---- Workspace stats -----------------------------------------------------------

/** Dashboard counters for one workspace. Served by GET /asset-hub/stats, which returns a row per
 *  workspace in a single response — see `WorkspaceStatRow` in types/catalog.
 *  `total` = distinct live packages (one per package, counted by its latest version state), so
 *  `pending + approved + rejected === total`. `published` is separate: packages whose active
 *  version is approved + status=active (may differ from `approved` when a newer draft is pending). */
export interface WorkspaceStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  published: number;
}
