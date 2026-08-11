---
phase: 2
title: Sidebar & Collapse
status: completed
priority: P1
effort: 3h
dependencies:
  - 1
---

# Phase 2: Sidebar & Collapse

## Overview
Render the sidebar from `NAV_GROUPS`, with light-refined active state, dimmed locked items, and a collapse toggle (250px↔64px) whose state persists in localStorage. Upgrade the brand cell (gradient logo + toggle).

## Requirements
- Functional: active item = accent bar + `ah-green-l` bg + `ah-green-d` bold (via react-router `NavLink`). Locked items dimmed + `·Sắp có`, non-navigating. Collapse hides headings/labels, centers icons, shows label via antd `Tooltip` on hover; state read/written to `localStorage` and restored on mount.
- Non-functional: `AssetHubSidebar` stays < 200 lines (extract `SidebarItem`); Tailwind-only; no hardcoded hex.

## Architecture
- **Collapse state owner = `AssetHubLayout`** (single source): `const [collapsed, setCollapsed] = useState(() => localStorage.getItem('ah:collapsed') === '1')`; write on toggle via `useEffect`. Pass `collapsed` + `onToggle` down to `AssetHubBrand` and `AssetHubSidebar`.
- Grid columns switch reactively: `grid-cols-[250px_1fr]` vs `grid-cols-[64px_1fr]` (conditional class on the layout root) with a width transition.
- `SidebarItem` decides element by state: enabled → `<NavLink to>`; locked → `<div>` (no navigation, `cursor-default`, no hover bg). When `collapsed`, wrap the icon in antd `<Tooltip title={label} placement="right">`.

## Related Code Files
- Modify: `EDA_FE/src/modules/asset-hub/layout/AssetHubLayout.tsx` (collapse state + localStorage + grid switch + pass props)
- Modify: `EDA_FE/src/modules/asset-hub/layout/AssetHubBrand.tsx` (gradient logo ◆ + subtitle + collapse toggle ☰; logo-only when collapsed)
- Rewrite: `EDA_FE/src/modules/asset-hub/layout/AssetHubSidebar.tsx` (map `NAV_GROUPS`; hide group headings when collapsed)
- Create: `EDA_FE/src/modules/asset-hub/layout/SidebarItem.tsx` (one item: enabled NavLink vs locked div; Tooltip when collapsed)

## Implementation Steps
1. `AssetHubLayout`: add `collapsed` state seeded from `localStorage.getItem('ah:collapsed')`; `useEffect` persists (`'1'`/`'0'`). Root div className toggles grid cols + `transition-[grid-template-columns] duration-200`. Render `<AssetHubBrand collapsed onToggle/>`, `<AssetHubSidebar collapsed/>`, header, main.
2. `AssetHubBrand`: gradient rounded-square logo (`bg-gradient-to-br from-ah-green to-ah-green-d`, glyph ◆), name `VPBank AI Asset Hub` + subtitle `ENTERPRISE CONTROL PLANE` (hide text when `collapsed`). Add ☰ toggle button calling `onToggle`; keep border-b/border-r.
3. `SidebarItem`: props `{ item: NavItem; collapsed: boolean }`.
   - Enabled: `<NavLink to={item.to} end className={({isActive}) => ...}>` — active adds left accent bar (`before:` pseudo or a 2px left span), `bg-ah-green-l text-ah-green-d font-bold`; idle `text-ah-ink hover:bg-ah-pale`. `.15s` transition.
   - Locked: `<div className="opacity-50 cursor-default">` + right-side `·Sắp có` pill (`text-ah-gold`, tiny). No hover bg, no onClick.
   - Icon fixed-width span; label hidden when `collapsed`; when `collapsed`, wrap row in antd `Tooltip title={label} placement="right"`.
4. `AssetHubSidebar`: props `{ collapsed }`. Map `NAV_GROUPS`; render group `heading` (uppercase, `text-ah-muted`, hidden when `collapsed`) then its items via `SidebarItem`. Keep `overflow-y-auto`.
5. Verify keyboard/focus: locked items are not focusable links (plain div is fine for this round).

## Success Criteria
- [ ] Active route shows accent bar + green-l bg; switching routes moves the active state.
- [ ] All 9 locked items dimmed + `·Sắp có`, clicking does nothing (no URL change).
- [ ] Toggle collapses to 64px icon-only; hovering an icon shows its label tooltip; expanding restores labels/headings.
- [ ] Reload preserves collapsed/expanded state.
- [ ] `AssetHubSidebar.tsx` < 200 lines; build compiles.

## Risk Assessment
- antd `Tooltip` under preflight-OFF Tailwind: safe (antd ships own CSS). 
- Grid-template-columns transition may not animate in all browsers — acceptable; the state switch is what matters, animation is cosmetic.
- localStorage access in SSR-less webpack SPA is safe (always in browser).
