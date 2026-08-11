---
phase: 3
title: Header
status: completed
priority: P2
effort: 2h
dependencies:
  - 1
---

# Phase 3: Header

## Overview
Fill the empty `AssetHubHeader` stub with three visual-only elements: semantic search pill (⌘K), environment chips DEV/UAT/PROD, and an avatar with an antd Dropdown menu. No real handlers this round.

## Requirements
- Functional: search input renders with 🔎 + placeholder + `⌘K` hint (no submit logic); env chips show colored dots (green/amber/red), PROD emphasized; avatar circle opens a visual dropdown (Hồ sơ / Cài đặt / Đăng xuất — no actions).
- Non-functional: Tailwind-only + `ah-*` tokens (uses `ah-pale`, `ah-amber`, `ah-red` from Phase 1); `AssetHubHeader.tsx` < 200 lines (extract `EnvChips`).

## Architecture
- `AssetHubHeader` = flex row: search (left, `max-w`), then chips + avatar pushed right (`ml-auto`).
- `EnvChips` extracted as its own component (3 chips + dots) to keep header lean and reusable.
- Avatar dropdown uses antd `Dropdown` + `Avatar` (both already in antd v5); menu items are static, `onClick` no-ops for now.

## Related Code Files
- Rewrite: `EDA_FE/src/modules/asset-hub/layout/AssetHubHeader.tsx`
- Create: `EDA_FE/src/modules/asset-hub/layout/EnvChips.tsx`

## Implementation Steps
1. `EnvChips`: render three chips. Each = rounded pill (`border-ah-line`, `bg-ah-card`) with a colored dot + label: DEV → `bg-ah-green`, UAT → `bg-ah-amber`, PROD → `bg-ah-red` (PROD chip emphasized: `text-ah-red border`-tinted bg). Tokenized colors only.
2. `AssetHubHeader`: 
   - Left: search pill — `div` with `bg-ah-pale border border-ah-line rounded-lg px-3 py-1.5 flex items-center gap-2`, containing 🔎, `<input>` (placeholder from mock: "Tìm model, dataset, skill, workflow, API, prompt…"), and a muted `⌘K` hint span. Input has no state/handler.
   - Right (`ml-auto` cluster): `<EnvChips/>` then avatar.
   - Avatar: antd `<Dropdown menu={{items}}>` wrapping `<Avatar>` (circle, `ah-green` bg, initials "AĐ"). `items` = static [Hồ sơ, Cài đặt, Đăng xuất] with no-op handlers.
3. Keep header height aligned to the grid row (58px) already set by layout; ensure vertical centering.

## Success Criteria
- [ ] Header shows search pill with 🔎 + placeholder + ⌘K hint.
- [ ] Three env chips render with correct dot colors; PROD visually emphasized.
- [ ] Clicking avatar opens dropdown with 3 menu items (visual, no navigation).
- [ ] `AssetHubHeader.tsx` < 200 lines; build compiles; no hardcoded hex.

## Risk Assessment
- antd `Dropdown`/`Avatar` styling coexisting with Tailwind preflight-OFF: safe, same pattern as base repo.
- Search input inside a Tailwind `bg-ah-pale` container under preflight-OFF: give input `bg-transparent outline-none border-0` explicitly since no preflight reset.
