// Shared contracts for the cross-workspace catalogs served under /api/v1/asset-hub/*.
// Skill and Prompt both pick from the same publishers, users and (type-scoped) tags.

export type AssetHubArtifactType = 'skill' | 'prompt';

/** Ownership axis of a tag — drives the chip colour on every read surface. */
export type AssetHubTagKind = 'enterprise' | 'personal';

/** A tag as it appears on any version payload. Replaces the old freeform `string`. */
export interface TagRef {
  id: number;
  name: string;
  kind: AssetHubTagKind;
}

/** A tag as it appears in the picker — additionally scoped to one workspace. */
export interface CatalogTag extends TagRef {
  artifact_type: AssetHubArtifactType;
}

/** Publishing unit owning an artifact. Package-scoped, not version-scoped. */
export interface PublisherRef {
  id: number;
  name: string;
}

/** A person in charge. The directory intentionally exposes id + email only. */
export interface ResponsibleUser {
  id: number;
  email: string;
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  /** Optional narrowing filter — the picker browses the full directory without it. */
  search?: string;
}

/** Dashboard counters for one workspace, discriminated by `type`. */
export interface WorkspaceStatRow {
  type: AssetHubArtifactType;
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  published: number;
}
