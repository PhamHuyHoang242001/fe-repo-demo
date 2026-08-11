# Brainstorm — Asset Hub Sidebar + Header (layout-only round)

**Date:** 2026-08-10 · **Module:** `EDA_FE/src/modules/asset-hub` (isolated module, mounted `/asset-hub/*`)
**Ref:** `mock.html` (VPBank AI Asset Hub — Enterprise Control Plane v1.3)

## Problem
Dựng sidebar + header cho asset-hub đẹp hơn mock, tối giản nhưng có điểm nhấn. Vòng này CHỈ layout: 3 màn trắng clickable (Dashboard, Skill Package, Prompt Library); các mục khác hiển thị đầy đủ nhưng không click được.

## Context (scout)
- Module scaffold đã tồn tại: `AssetHubLayout/Brand/Header/Sidebar` (Header+Sidebar là stub rỗng), `Overview.tsx` trắng, guard auth đang tắt (dev).
- Stack: React18+TS+Webpack, react-router v6, antd v5, Tailwind v3 (preflight OFF), import từ `src/`.
- Tokens `ah-*` đã có trong `tailwind.config.js` + mirror `theme/colors.ts`.
- `@ant-design/icons` KHÔNG cài → giữ unicode glyph như mock (zero-dep).
- Rule: Tailwind-only, no hardcode hex, file < 200 dòng, PascalCase, không thêm lib mới.

## Decisions (user-confirmed)
1. **Visual:** Light refined — giữ tông mock; điểm nhấn = active accent bar + gradient logo + collapse mượt (KHÔNG đổi màu mè).
2. **Locked items:** mờ (opacity-50) + badge `·Sắp có` (ah-gold), cursor default, không navigation.
3. **Collapse:** CÓ nút thu gọn 250px↔64px, icon-only + antd Tooltip khi hover. **Persist localStorage** (nhớ qua reload).
4. **Header elements:** Search bar (⌘K, visual), Env chips DEV/UAT/PROD, Avatar + antd Dropdown menu (visual). KHÔNG có notifications/theme toggle.

## Nav model (4 nhóm / 12 mục — chỉ 3 có `to`)
- Tổng quan: ▤ **Dashboard** `/asset-hub` · ▦ Asset Catalog 🔒 · ⛓ Lineage & Impact 🔒
- Tài sản nền tảng: ◐ AI Model Registry 🔒 · ⛁ Golden Dataset 🔒
- Tài sản ứng dụng: ◈ **Skill Package** `/asset-hub/skill` · ✎ **Prompt Library** `/asset-hub/prompt` · ⇄ Workflow 🔒 · ⚡ API & MCP 🔒
- Vận hành & Kiểm định: ▷ Playground 🔒 · ⚖ Governance 🔒 · 📈 Observability 🔒

Item shape: `{ id, label, icon, to?, locked?, badge? }`.

## Design
- **Sidebar:** NavLink active = bar `ah-green` + bg `ah-green-l` + text `ah-green-d` bold; hover `ah-pale`; locked dimmed + `·Sắp có`. Collapsed: ẩn heading/label, icon center, Tooltip label.
- **Collapse:** `useState` + localStorage ở `AssetHubLayout`; grid cols switch có transition; toggle (☰) ở Brand.
- **Brand:** logo gradient rounded-square (◆) + tên + subtitle `ENTERPRISE CONTROL PLANE`; thu gọn còn logo.
- **Header:** search pill `ah-pale` (🔎 + ⌘K, no handler); env chips (dot xanh/amber/đỏ, PROD nhấn); avatar `ah-green` + antd Dropdown (Hồ sơ/Cài đặt/Đăng xuất, visual).
- **Pages+routes:** `index→Dashboard`, `/skill→SkillPackage`, `/prompt→PromptLibrary`; shared `PageShell` (crumb + h1 + dashed box). Rename `Overview.tsx`→`Dashboard.tsx`.
- **Tokens mới:** `ah-pale #F4F7F5`, `ah-amber #B8860B`, `ah-red #7A1F2B` (sync 2 file).

## Files
- Edit: `AssetHubLayout.tsx`, `AssetHubBrand.tsx`, `AssetHubHeader.tsx`, `AssetHubSidebar.tsx`, `routes.tsx`, `tailwind.config.js`, `theme/colors.ts`
- New: `navItems.ts`, `SidebarItem.tsx`, `EnvChips.tsx`, `PageShell.tsx`, `pages/SkillPackage.tsx`, `pages/PromptLibrary.tsx` (+ rename Overview→Dashboard)

## Success criteria
- `/asset-hub`, `/asset-hub/skill`, `/asset-hub/prompt` render màn trắng đúng, đổi active đúng.
- 9 mục locked hiển thị mờ + `·Sắp có`, không đi được.
- Collapse hoạt động, tooltip đúng, nhớ trạng thái sau reload.
- Header có search/env/avatar-menu; build không lỗi; file < 200 dòng.

## Out of scope
Nội dung thật của 3 trang; search/notification/env-switch logic; auth thật; 9 màn locked.

## Open questions
None.
