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

// Mirrors BE SkillCategory enum (skill-category.constant.ts — single source of truth).
// Update both locations when the taxonomy changes.
export const SKILL_CATEGORIES = [
  'general',
  'data-analysis',
  'automation',
  'integration',
  'reporting',
  'other',
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

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
  state: 'pending' | 'approved' | 'rejected';
  name: string;
  short_description: string;
  category: SkillCategory;
  tags: string[];
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
  reviewed_at: string | null;
  reject_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface SkillPackage {
  id: number;
  active_version_id: number | null;
  status: 'active' | 'inactive';
  created_by: number;
  active_version?: SkillVersion | null;
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

// ---- My Skill ------------------------------------------------------------------

/** Thin representative-version summary for the My Skill grid. Mirrors the BE `my-items` projection,
 *  which deliberately OMITS `skill_md_content`/`reject_reason` (grid renders only badge + identity).
 *  Do NOT widen this to the full `SkillVersion` — the BE does not ship those fields here. */
export interface MySkillVersionSummary {
  id: number;
  version_no: number;
  state: 'pending' | 'approved' | 'rejected';
  name: string;
  short_description: string;
  category: SkillCategory;
  tags: string[];
  avatar_url?: string | null;
  file: SkillFile | null;
  created_at: string;
  updated_at: string;
}

/** A row in the My Skill tab: the caller's own package + a representative version (active or latest). */
export interface MySkillItem {
  id: number;
  status: 'active' | 'inactive';
  active_version_id: number | null;
  created_by: number;
  version: MySkillVersionSummary | null;
  latest_state: 'pending' | 'approved' | 'rejected' | null;
}

// ---- Diff ----------------------------------------------------------------------

export interface SkillDiff {
  /** null means first version (no previous skill.md). */
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

export interface MySkillPermissions {
  canUpload: boolean;
  canApprove: boolean;
}
