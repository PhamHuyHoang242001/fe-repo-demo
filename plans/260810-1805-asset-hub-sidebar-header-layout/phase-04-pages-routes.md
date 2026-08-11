---
phase: 4
title: Pages & Routes
status: completed
priority: P2
effort: 1.5h
dependencies:
  - 1
---

# Phase 4: Pages & Routes

## Overview
Wire the 3 clickable destinations to distinct blank pages using a shared `PageShell`, and register their routes in the module's `routes.tsx`. Rename the placeholder `Overview.tsx` → `Dashboard.tsx` for clarity.

## Requirements
- Functional: `/asset-hub` → Dashboard, `/asset-hub/skill` → Skill Package, `/asset-hub/prompt` → Prompt Library. Each is a blank white screen with a consistent crumb + title + dashed placeholder box. Unknown sub-paths redirect to index.
- Non-functional: DRY via one `PageShell`; each page < 40 lines; PascalCase.

## Architecture
- `PageShell` = presentational wrapper: props `{ crumb, title, children? }`; renders breadcrumb (uppercase `text-ah-muted`), `<h1>` (`text-ah-green-d`), and a dashed placeholder box (`border-dashed border-ah-line bg-ah-card`) — mirrors the existing `Overview` placeholder so all 3 look uniform.
- Each page is a thin component calling `PageShell` with its own crumb/title.
- Routes are relative (module mounted at `/asset-hub/*`): `index`, `skill`, `prompt`, and `*` → `Navigate to="."`.

## Related Code Files
- Create: `EDA_FE/src/modules/asset-hub/pages/PageShell.tsx`
- Rename/Modify: `EDA_FE/src/modules/asset-hub/pages/Overview.tsx` → `pages/Dashboard.tsx` (use `PageShell`, crumb "TỔNG QUAN", title "Control Plane Dashboard")
- Create: `EDA_FE/src/modules/asset-hub/pages/SkillPackage.tsx` (crumb "TÀI SẢN ỨNG DỤNG › SKILL", title "Skill Package")
- Create: `EDA_FE/src/modules/asset-hub/pages/PromptLibrary.tsx` (crumb "TÀI SẢN ỨNG DỤNG › PROMPT", title "Prompt Library")
- Modify: `EDA_FE/src/modules/asset-hub/routes.tsx` (add `skill` + `prompt` routes)

## Implementation Steps
1. Create `PageShell.tsx` (extract the pattern from current `Overview.tsx`): crumb + h1 + dashed placeholder saying "Nội dung sẽ được xây ở đây." Accept optional `children` to override the placeholder later.
2. Rename `Overview.tsx` → `Dashboard.tsx`; reimplement as `<PageShell crumb="TỔNG QUAN" title="Control Plane Dashboard" />`. Remove the old standalone markup.
3. Create `SkillPackage.tsx` and `PromptLibrary.tsx`, each a one-liner over `PageShell` with its crumb/title.
4. Update `routes.tsx`:
   ```tsx
   <Routes>
     <Route index element={<Dashboard />} />
     <Route path="skill" element={<SkillPackage />} />
     <Route path="prompt" element={<PromptLibrary />} />
     <Route path="*" element={<Navigate to="." replace />} />
   </Routes>
   ```
   Update the import (`Overview` → `Dashboard`) and add the two new imports.
5. Confirm sidebar `to` values from Phase 1 (`/asset-hub`, `/asset-hub/skill`, `/asset-hub/prompt`) match these routes.

## Success Criteria
- [ ] All 3 routes render distinct crumb + title via `PageShell`; layout (sidebar/header) persists across them.
- [ ] Sidebar active state matches the current route on each of the 3 pages.
- [ ] Unknown `/asset-hub/xyz` redirects to index.
- [ ] No leftover `Overview.tsx`; imports updated; build compiles.

## Risk Assessment
Low. Only cross-cutting risk is route/`to` mismatch between Phase 1 nav data and this phase — Step 5 explicitly reconciles them. `Navigate to="."` relative resolution already proven in the existing `routes.tsx`.
