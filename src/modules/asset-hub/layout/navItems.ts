// Nav data model — single source cho AssetHubSidebar.
// CHỈ 3 mục có `to` (clickable): Dashboard, Skill Package, Prompt Library.
// 9 mục còn lại `locked` → hiển thị mờ + icon khóa (KHÔNG chữ), không điều hướng.
// `to` là path tuyệt đối (/asset-hub/...) để NavLink `end`-match đúng từ mọi độ sâu.
// `icon` = IconName → render bằng bộ SVG line trong icons.tsx (đồng bộ, sắc nét, theme-driven).

import { IconName } from './icons';

export interface NavItem {
  id: string;
  label: string;
  icon: IconName;
  to?: string; // chỉ có ở 3 mục clickable (absolute path)
  locked?: boolean; // true → mờ + icon khóa, không click
  badge?: string; // pill nhỏ tùy chọn, vd 'NEW'
}

export interface NavGroup {
  heading: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    heading: 'Tổng quan',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', to: '/asset-hub' },
      { id: 'catalog', label: 'Asset Catalog', icon: 'catalog', locked: true },
      { id: 'lineage', label: 'Lineage & Impact', icon: 'lineage', locked: true },
    ],
  },
  {
    heading: 'Tài sản nền tảng',
    items: [
      { id: 'model', label: 'AI Model Registry', icon: 'model', locked: true },
      { id: 'dataset', label: 'Golden Dataset', icon: 'dataset', locked: true },
    ],
  },
  {
    heading: 'Tài sản ứng dụng',
    items: [
      { id: 'skill', label: 'Skill Package', icon: 'skill', to: '/asset-hub/skill' },
      { id: 'prompt', label: 'Prompt Library', icon: 'prompt', to: '/asset-hub/prompt' },
      { id: 'workflow', label: 'Workflow', icon: 'workflow', locked: true },
      { id: 'api', label: 'API & MCP', icon: 'api', locked: true },
    ],
  },
  {
    heading: 'Vận hành & Kiểm định',
    items: [
      { id: 'playground', label: 'Playground & Eval', icon: 'playground', locked: true },
      { id: 'governance', label: 'Governance', icon: 'governance', locked: true },
      { id: 'observability', label: 'Observability & FinOps', icon: 'observability', locked: true },
    ],
  },
];
