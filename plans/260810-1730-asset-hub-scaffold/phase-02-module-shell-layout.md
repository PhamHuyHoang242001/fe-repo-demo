---
phase: 2
title: Module Shell & Layout
status: completed
priority: P1
effort: 1.5h
dependencies:
  - 1
---

# Phase 2: Module Shell & Layout

## Overview
Xây toàn bộ nội thất module trong `src/modules/asset-hub/`: guard nhẹ, layout shell grid 3 khối (brand/topbar/sidebar/content) theo `mock.html`, các khối để **trống placeholder**, routing nội bộ, và entry `AssetHubApp`. Không đụng base cũ ở phase này.

## Requirements
- Functional: vào `/asset-hub` (khi đã login) → thấy layout grid với header + sidebar + content trống, style green/gold. Chưa login → guard đá về `/login`.
- Non-functional: mỗi file <200 dòng, component PascalCase, chỉ Tailwind, không import chéo logic base (chỉ `utils/jwt`).

## Architecture
Cây render: `AssetHubApp` → `RequireAuth` → `AssetHubLayout` (grid) → nested `<Routes>` (từ `routes.tsx`) render vào ô `main`.

Layout grid (Tailwind, mô phỏng mock):
```
grid-template-areas: "brand top" / "side main"
grid-template-columns: 250px 1fr
grid-template-rows: 58px 1fr
```
Dùng arbitrary utilities: `grid grid-cols-[250px_1fr] grid-rows-[58px_1fr] min-h-screen`, gán vùng bằng `[grid-area:brand]` v.v. (hoặc đơn giản hơn: brand+header là 1 hàng flex, dưới là flex row sidebar+content — chọn cách grid để bám mock).

## Related Code Files
- Create: `src/modules/asset-hub/guard/RequireAuth.tsx`
- Create: `src/modules/asset-hub/layout/AssetHubBrand.tsx`
- Create: `src/modules/asset-hub/layout/AssetHubHeader.tsx`
- Create: `src/modules/asset-hub/layout/AssetHubSidebar.tsx`
- Create: `src/modules/asset-hub/layout/AssetHubLayout.tsx`
- Create: `src/modules/asset-hub/pages/Overview.tsx`
- Create: `src/modules/asset-hub/routes.tsx`
- Create: `src/modules/asset-hub/AssetHubApp.tsx`

## Implementation Steps
1. **`guard/RequireAuth.tsx`** — guard nhẹ, tái dùng `isLogin()`:
   ```tsx
   import React from 'react';
   import { Navigate } from 'react-router-dom';
   import { isLogin } from 'utils/jwt';

   const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     if (!isLogin()) return <Navigate to="/login" replace />;
     return <>{children}</>;
   };
   export default RequireAuth;
   ```
2. **`layout/AssetHubBrand.tsx`** — ô brand góc trên-trái (logo/tên tối giản). Placeholder: text "Asset Hub" `text-ah-ink font-semibold`, nền `bg-ah-card`, `border-b border-r border-ah-line`.
3. **`layout/AssetHubHeader.tsx`** — 🔲 KHỐI HEADER (topbar). Trống: `bg-ah-card border-b border-ah-line`, chừa chỗ search/env/avatar (comment `{/* TODO: search / env / avatar */}`).
4. **`layout/AssetHubSidebar.tsx`** — 🔲 KHỐI SIDEBAR. Trống: `bg-ah-card border-r border-ah-line`, comment `{/* TODO: nav groups */}`.
5. **`layout/AssetHubLayout.tsx`** — khung grid, nhận `children` (ô main):
   ```tsx
   import React from 'react';
   import AssetHubBrand from './AssetHubBrand';
   import AssetHubHeader from './AssetHubHeader';
   import AssetHubSidebar from './AssetHubSidebar';

   const AssetHubLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <div className="grid min-h-screen grid-cols-[250px_1fr] grid-rows-[58px_1fr] bg-ah-bg text-ah-ink">
       <div className="[grid-area:brand]"><AssetHubBrand /></div>   {/* dùng grid-template-areas hoặc đặt thứ tự cột/hàng */}
       <div className="[grid-area:top]"><AssetHubHeader /></div>
       <div className="[grid-area:side] overflow-y-auto"><AssetHubSidebar /></div>
       <main className="[grid-area:main] overflow-y-auto p-6">{children}</main>
     </div>
   );
   export default AssetHubLayout;
   ```
   > Lưu ý: để `[grid-area:*]` chạy cần khai báo `grid-template-areas`. Cách gọn: thêm class arbitrary `[grid-template-areas:'brand_top''side_main']` vào container. Nếu thấy rối, fallback KISS: bỏ areas, chỉ cần thứ tự DOM brand→header→sidebar→main khớp cột/hàng (brand ở (r1,c1), header (r1,c2), sidebar (r2,c1), main (r2,c2)) — grid tự điền theo thứ tự, không cần areas.
6. **`pages/Overview.tsx`** — 🔲 KHỐI CONTENT trống: 1 tiêu đề nhẹ + vùng trắng. `text-ah-muted` placeholder "Nội dung sẽ được xây ở đây".
7. **`routes.tsx`** — bảng route nội bộ (relative, vì mount dưới `/asset-hub/*`):
   ```tsx
   import React from 'react';
   import { Routes, Route, Navigate } from 'react-router-dom';
   import Overview from './pages/Overview';

   const AssetHubRoutes: React.FC = () => (
     <Routes>
       <Route index element={<Overview />} />
       <Route path="*" element={<Navigate to="." replace />} />
     </Routes>
   );
   export default AssetHubRoutes;
   ```
8. **`AssetHubApp.tsx`** — entry:
   ```tsx
   import React from 'react';
   import RequireAuth from './guard/RequireAuth';
   import AssetHubLayout from './layout/AssetHubLayout';
   import AssetHubRoutes from './routes';

   const AssetHubApp: React.FC = () => (
     <RequireAuth>
       <AssetHubLayout>
         <AssetHubRoutes />
       </AssetHubLayout>
     </RequireAuth>
   );
   export default AssetHubApp;
   ```

## Success Criteria
- [ ] 8 file tạo xong, mỗi file <200 dòng, PascalCase component.
- [ ] Chỉ dùng Tailwind (+ `isLogin` từ `utils/jwt`); không import DefaultLayout/PermissionContent/Header/Sidebar cũ.
- [ ] Grid 3 khối hiển thị đúng vị trí brand/header/sidebar/content.
- [ ] `npm run build1` build sạch (webpack resolve OK). `utils/jwt` dùng alias sẵn có.

## Risk Assessment
- `grid-template-areas` với arbitrary Tailwind dễ sai cú pháp → có sẵn fallback KISS (bỏ areas, dựa thứ tự DOM) ở step 5.
- Preflight OFF: một số reset (margin/box-sizing) không có → verify khối không bị lệch; thêm `box-border` nếu cần.
