import type { AssetHubCategory, AssetHubCategoryValue } from '../types/category';

function humanizeCategoryText(raw: string): string {
  return raw
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b[A-Za-zÀ-ỹ]/g, (match) => match.toUpperCase());
}

export function resolveCategoryLabel(category: AssetHubCategoryValue, fallback = '—'): string {
  if (!category) return fallback;
  if (typeof category === 'string') return humanizeCategoryText(category) || fallback;
  return category.name || fallback;
}

export function resolveCategoryId(category: AssetHubCategoryValue): number | null {
  if (!category || typeof category === 'string') return null;
  return category.id;
}

export function buildCategoryOptionLabel(category: AssetHubCategory): string {
  return category.is_active === false ? `${category.name} (đã ẩn)` : category.name;
}
