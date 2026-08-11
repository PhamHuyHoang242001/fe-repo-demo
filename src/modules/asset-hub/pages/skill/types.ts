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

export interface SkillVersion {
  id: number;
  skill_package_id: number;
  version_no: number;
  state: 'pending' | 'approved' | 'rejected';
  name: string;
  short_description: string;
  category: SkillCategory;
  tags: string[];
  /** Strapi URL of the skill .zip, stored directly on the row (diagnostic-style). */
  zip_url: string;
  /** Strapi URL of the avatar image. Null when no avatar is set. */
  avatar_url?: string | null;
  skill_md_content: string;
  changelog_note: string | null;
  submitted_by: number;
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

/** Full detail: package + resolved active_version + all versions for the timeline. */
export type SkillPackageDetail = SkillPackage & {
  active_version: SkillVersion | null;
  versions: SkillVersion[];
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
    state: string;
    name: string;
    category: string;
    tags: string[];
    changelog_note: string | null;
    submitted_by: number;
    submitted_at: string;
  };
}

// ---- Permissions ---------------------------------------------------------------

export interface MySkillPermissions {
  canUpload: boolean;
  canApprove: boolean;
}
