---
phase: 3
title: Base Wiring & Compile Check
status: completed
priority: P1
effort: 0.5h
dependencies:
  - 2
---

# Phase 3: Base Wiring & Compile Check

## Overview
Nối module vào base cũ bằng **2 thay đổi additive**: 1 route sibling ở `App.tsx` và 1 card ở `Login.tsx`. Sau đó compile + lint để chốt scaffold. Đây là phase duy nhất chạm file base.

## Requirements
- Functional: từ `/login` bấm card → điều hướng `/asset-hub`; nếu đã login thấy layout module, chưa login guard đá về `/login`.
- Non-functional: KHÔNG sửa route cũ trong `App.tsx`; card không phá layout 2-cột của Login.

## Architecture
- `App.tsx`: thêm route sibling `<Route path="/asset-hub/*" element={<AssetHubApp/>}/>` TRƯỚC `/*` (DefaultLayout) để không bị nuốt bởi catch-all. Lazy load qua `loadable` (đồng bộ pattern hiện có).
- `Login.tsx`: thêm card dưới `<Form>` ở cột trái, dùng `navigate('/asset-hub')`. UX option (a): card luôn hiện.

## Related Code Files
- Modify: `src/App.tsx`
- Modify: `src/pages/auth/views/Login.tsx`

## Implementation Steps
1. **`src/App.tsx`**:
   - Thêm: `const AssetHubApp = loadable(() => import('@/modules/asset-hub/AssetHubApp'));`
     (dùng alias `@` = `./src`; KHÔNG có alias `modules` trong webpack).
   - Trong `<Routes>`, thêm TRƯỚC dòng `/*`:
     ```tsx
     <Route path="/asset-hub/*" element={<AssetHubApp />} />
     ```
   - Xác nhận thứ tự: `/login`, `/forgot-password`, `/asset-hub/*`, rồi cuối cùng `/*` → DefaultLayout.
2. **`src/pages/auth/views/Login.tsx`**:
   - `navigate` đã có sẵn (`useNavigate`).
   - Dưới `<Form>` (trong cột trái `w-1/2`), thêm card tối giản:
     ```tsx
     <button
       type="button"
       onClick={() => navigate('/asset-hub')}
       className="mt-8 flex w-[360px] items-center justify-between rounded-2xl border border-ah-line bg-ah-card px-6 py-4 text-left transition hover:border-ah-green hover:shadow-sm"
     >
       <div>
         <div className="text-sm font-semibold text-ah-ink">AI Asset Hub</div>
         <div className="text-xs text-ah-muted">Khu vực làm việc độc lập</div>
       </div>
       <span className="text-ah-green">→</span>
     </button>
     ```
   - Giữ nguyên mọi thứ khác của Login (form, footer, ảnh).
3. **Compile & lint** (babel strip types, KHÔNG type-check → build webpack là gate thật):
   - `npm run build1` (webpack production base config — verify resolve alias `@/modules/...` + syntax)
   - `npm run lint` (eslint --fix; sửa lỗi lint mới nếu có, không đụng code cũ)
   - (tùy chọn) `npm start` chạy dev, mở `/login`, bấm card → kiểm tra guard + layout.

## Success Criteria
- [ ] `App.tsx` có route `/asset-hub/*` đặt trước `/*`; route cũ nguyên vẹn.
- [ ] `Login.tsx` có card → `navigate('/asset-hub')`; layout 2-cột không vỡ.
- [ ] `npm run build1` build sạch, `npm run lint` không lỗi mới.
- [ ] Manual: chưa login bấm card → về `/login`; đã login → thấy layout 3 khối green/gold.

## Risk Assessment
- Nếu đặt `/asset-hub/*` SAU `/*` → catch-all DefaultLayout nuốt route → phải đặt trước (đã ghi rõ).
- Import path: webpack aliases là **per-folder** (`pages`, `layouts`, `utils`, ...) + `@`→src; KHÔNG có alias `modules`. Vì vậy App.tsx phải import `@/modules/asset-hub/AssetHubApp`. Module internal imports để **relative**; chỉ `utils/jwt` dùng alias sẵn có.
