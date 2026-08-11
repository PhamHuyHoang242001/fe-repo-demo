---
title: Asset Hub Sidebar + Header Layout
description: >-
  Fill the empty sidebar/header stubs in the isolated asset-hub module —
  light-refined visual, collapsible sidebar (persisted), locked 'Sắp có' items,
  3 clickable blank pages.
status: completed
priority: P2
branch: master
tags:
  - frontend
  - layout
  - asset-hub
  - tailwind
blockedBy: []
blocks: []
created: '2026-08-10T11:06:52.123Z'
createdBy: 'ck:plan'
source: skill
---

# Asset Hub Sidebar + Header Layout

## Overview

Layout-only round for `EDA_FE/src/modules/asset-hub` (isolated module, mounted `/asset-hub/*`, bypasses DefaultLayout). Fill the currently-empty `AssetHubHeader` + `AssetHubSidebar` stubs and wire 3 blank clickable pages. Reference: `mock.html` (VPBank AI Asset Hub). Design confirmed in `./brainstorm-summary.md`.

**Confirmed decisions:** Light-refined visual (keep mock tone; polish = accent bar + gradient logo + smooth collapse, NOT more color) · collapsible sidebar 250px↔64px with antd Tooltip, **persisted to localStorage** · 9 locked items dimmed + `·Sắp có` badge (no navigation) · header = search pill (⌘K, visual) + env chips DEV/UAT/PROD + avatar antd Dropdown (visual) · 3 routes: Dashboard `/asset-hub`, Skill Package `/asset-hub/skill`, Prompt Library `/asset-hub/prompt`.

**Constraints (EDA_FE/CLAUDE.md):** Tailwind-only (preflight OFF), no hardcoded hex (use `ah-*` tokens), files < 200 lines, PascalCase components, **no new npm deps** (antd already present; `@ant-design/icons` NOT installed → keep unicode glyphs from mock). No cross-import of old base logic.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Tokens & Nav Model](./phase-01-tokens-nav-model.md) | Completed |
| 2 | [Sidebar & Collapse](./phase-02-sidebar-collapse.md) | Completed |
| 3 | [Header](./phase-03-header.md) | Completed |
| 4 | [Pages & Routes](./phase-04-pages-routes.md) | Completed |

## Dependencies

Phase 1 (tokens + nav data) blocks Phases 2–3 (they consume `ah-*` tokens + `navItems`). Phase 4 (pages/routes) is independent of 2–3 but its route targets are what the sidebar links to. Build order: 1 → 2 → 3 → 4. No cross-plan dependencies.

## Success Criteria (whole plan)

- [ ] `/asset-hub`, `/asset-hub/skill`, `/asset-hub/prompt` each render a distinct blank page; sidebar active state follows the route.
- [ ] 9 locked items render dimmed + `·Sắp có`, non-clickable (no navigation, no hover highlight).
- [ ] Collapse toggle works (250px↔64px), tooltips show labels when collapsed, state survives reload.
- [ ] Header shows search pill (⌘K), env chips (DEV/UAT/PROD), avatar dropdown menu.
- [ ] `npm run build` (webpack) compiles with no errors; every new/edited file < 200 lines; Tailwind-only, no hardcoded hex.
