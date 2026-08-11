---
title: Asset-Hub Isolated Module Scaffold
description: ''
status: completed
priority: P2
branch: master
tags: []
blockedBy: []
blocks: []
created: '2026-08-10T10:45:26.510Z'
createdBy: 'ck:plan'
source: skill
---

# Asset-Hub Isolated Module Scaffold

## Overview

Dựng khung một **isolated module** `asset-hub` trong EDA_FE — mount song song tại `App.tsx` (`/asset-hub/*`), bypass hoàn toàn `DefaultLayout`/`PermissionContent` (idle-timer + Header/Footer/Sidebar dùng chung + permission logic). Vòng này **chỉ scaffold**: layout shell 3 khối trống (header/sidebar/content) theo bố cục `mock.html`, guard nhẹ, palette green/gold token hóa. **Chưa feature thật.**

Ràng buộc: chỉ Tailwind (preflight OFF — coexist antd), **không thêm lib mới**, component PascalCase (đồng bộ repo), file <200 dòng, UI đẹp/tối giản/không màu mè/đồng bộ mã màu. Rule đã lưu ở `EDA_FE/CLAUDE.md`.

**Base files sửa (additive only, 3 file):** `src/App.tsx`, `src/pages/auth/views/Login.tsx`, `tailwind.config.js`.

**Compile check:** `npm run build1` (webpack — authoritative: resolve alias + syntax) + `npm run lint`. Lưu ý: babel `preset-typescript` **strip types, KHÔNG type-check**; `tsconfig.paths` rỗng nên `tsc --noEmit` báo lỗi alias toàn repo → không dùng làm gate. Import cross-module dùng alias `@` (→ `./src`): `@/modules/asset-hub/...` (KHÔNG có alias `modules`; webpack chỉ có alias per-folder + `@`).

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Foundation & Color Tokens](./phase-01-foundation-color-tokens.md) | Completed |
| 2 | [Module Shell & Layout](./phase-02-module-shell-layout.md) | Completed |
| 3 | [Base Wiring & Compile Check](./phase-03-base-wiring-compile-check.md) | Completed |

## Dependencies

<!-- Cross-plan dependencies -->
