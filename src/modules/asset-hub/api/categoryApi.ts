import 'utils/http';
import axios from 'axios';
import { APP_CONFIG } from 'utils/env';
import type { AssetHubCategory, AssetHubCategoryType } from '../types/category';

const url = (path = '') => `${APP_CONFIG.apiUrl}/categories${path}`;

export interface ListCategoriesParams {
  type: AssetHubCategoryType;
  include_inactive?: boolean;
}

function normalizeCategoryResponse(data: unknown): AssetHubCategory[] {
  if (Array.isArray(data)) return data as AssetHubCategory[];
  if (Array.isArray((data as { data?: unknown })?.data)) return (data as { data: AssetHubCategory[] }).data;
  return [];
}

export async function listCategories(params: ListCategoriesParams): Promise<AssetHubCategory[]> {
  const res = await axios.get(url(), {
    params: {
      type: params.type,
      ...(params.include_inactive ? { include_inactive: true } : {}),
    },
  });

  return normalizeCategoryResponse(res.data);
}

