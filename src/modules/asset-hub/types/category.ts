export const ASSET_HUB_CATEGORY_TYPES = ['skill', 'prompt'] as const;

export type AssetHubCategoryType = (typeof ASSET_HUB_CATEGORY_TYPES)[number];

export interface AssetHubCategory {
  id: number;
  name: string;
  type: AssetHubCategoryType;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type AssetHubCategoryValue = AssetHubCategory | string | null | undefined;

