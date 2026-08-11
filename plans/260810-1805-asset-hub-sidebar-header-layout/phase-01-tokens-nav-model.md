---
phase: 1
title: Tokens & Nav Model
status: completed
priority: P1
effort: 1h
dependencies: []
---

# Phase 1: Tokens & Nav Model

## Overview
Foundation layer: add the 3 missing color tokens the header env-chips need, and create the single-source nav data model that Sidebar (Phase 2) renders from. No UI yet.

## Requirements
- Functional: `ah-pale`, `ah-amber`, `ah-red` usable as Tailwind classes; `navItems` array describing 4 groups / 12 items with only 3 carrying a route.
- Non-functional: token values synced between `tailwind.config.js` and `theme/colors.ts` (existing rule); no hardcoded hex outside these two files.

## Architecture
- Tokens live under the existing `ah` namespace in `tailwind.config.js` (`theme.extend.colors.ah`) and mirrored in `theme/colors.ts` `AH_COLORS`.
- Nav model is a plain typed array in `layout/navItems.ts` — data, not JSX — so `AssetHubSidebar` stays a thin renderer < 200 lines.
- Icons = unicode glyphs (mock's language), since `@ant-design/icons` is not installed.

## Related Code Files
- Modify: `EDA_FE/tailwind.config.js` (add `pale`, `amber`, `red` to `colors.ah`)
- Modify: `EDA_FE/src/modules/asset-hub/theme/colors.ts` (mirror the 3 keys in `AH_COLORS`)
- Create: `EDA_FE/src/modules/asset-hub/layout/navItems.ts`

## Implementation Steps
1. In `tailwind.config.js`, under `theme.extend.colors.ah`, add: `pale: '#F4F7F5'`, `amber: '#B8860B'`, `red: '#7A1F2B'`. Keep existing keys.
2. In `theme/colors.ts`, add the same 3 keys to `AH_COLORS` (keeps JS-side hex in sync per file's own note).
3. Create `layout/navItems.ts` exporting a type + grouped array:
   ```ts
   export interface NavItem {
     id: string;
     label: string;
     icon: string;          // unicode glyph, e.g. '▤'
     to?: string;           // present only for the 3 clickable items (absolute path)
     locked?: boolean;      // true → dimmed + '·Sắp có', no navigation
     badge?: string;        // optional small pill, e.g. 'NEW'
   }
   export interface NavGroup { heading: string; items: NavItem[]; }
   export const NAV_GROUPS: NavGroup[] = [ /* 4 groups below */ ];
   ```
   Groups & items (mirror mock; only 3 have `to`):
   - **Tổng quan**: `{▤ Dashboard, to:'/asset-hub'}`, `{▦ Asset Catalog, locked}`, `{⛓ Lineage & Impact, locked}`
   - **Tài sản nền tảng**: `{◐ AI Model Registry, locked}`, `{⛁ Golden Dataset, locked}`
   - **Tài sản ứng dụng**: `{◈ Skill Package, to:'/asset-hub/skill'}`, `{✎ Prompt Library, to:'/asset-hub/prompt'}`, `{⇄ Workflow, locked}`, `{⚡ API & MCP, locked}`
   - **Vận hành & Kiểm định**: `{▷ Playground & Eval, locked}`, `{⚖ Governance, locked}`, `{📈 Observability & FinOps, locked}`
4. Note in a comment that route `to` values are absolute (`/asset-hub/...`) so NavLink `end`-matching works from any depth.

## Success Criteria
- [ ] `bg-ah-pale`, `bg-ah-amber`, `bg-ah-red` (and text variants) resolve after build.
- [ ] `NAV_GROUPS` has 4 groups, 12 items, exactly 3 with `to`, 9 with `locked: true`.
- [ ] `theme/colors.ts` and `tailwind.config.js` list identical `ah` hex values.
- [ ] No hardcoded hex added anywhere except these two token files.

## Risk Assessment
Low. Only risk is token drift between the two files — mitigated by doing both edits in this phase. Adding tokens does not affect antd (preflight stays OFF).
