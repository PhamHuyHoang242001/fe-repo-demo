---
phase: 1
title: Foundation & Color Tokens
status: completed
priority: P1
effort: 0.5h
dependencies: []
---

# Phase 1: Foundation & Color Tokens

## Overview
Đặt nền cho module: thêm color tokens green/gold vào `tailwind.config.js` (namespace `ah-*`) làm nguồn chân lý duy nhất cho màu, và tạo file token TS mirror cho các chỗ cần giá trị hex trong JS. Tạo skeleton folder `src/modules/asset-hub/`.

## Requirements
- Functional: class Tailwind `bg-ah-green`, `text-ah-ink`, `border-ah-line`, ... hoạt động toàn repo (content đã glob `./src/**/*`).
- Non-functional: additive-only — KHÔNG đè/đổi token màu hiện có; không phá build cũ.

## Architecture
- Tailwind `theme.extend.colors.ah` = 1 object palette. Vì `content` đã quét `src/**/*` nên module mới tự được nhận diện, không cần đổi `content`.
- `theme/colors.ts` = hằng số TS mirror palette (dùng khi cần hex trong logic/inline style, tránh hardcode rải rác — DRY).

## Related Code Files
- Modify: `tailwind.config.js`
- Create: `src/modules/asset-hub/theme/colors.ts`
- Create (skeleton, giữ chỗ): thư mục `src/modules/asset-hub/{guard,layout,pages,theme}` (tạo khi ghi file ở Phase 2)

## Implementation Steps
1. Sửa `tailwind.config.js` → thêm `theme.extend.colors.ah`:
   ```js
   module.exports = {
     content: ['./src/**/*.{js,jsx,ts,tsx}'],
     theme: {
       extend: {
         colors: {
           ah: {
             green: '#00693E',
             'green-d': '#004C2E',
             'green-l': '#E9F3EE',
             gold: '#C59C37',
             ink: '#1d2521',
             muted: '#6a7873',
             line: '#dde5e1',
             bg: '#f0f4f2',
             card: '#ffffff',
           },
         },
       },
     },
     plugins: [],
     corePlugins: { preflight: false },
   };
   ```
   (giữ nguyên `preflight: false`).
2. Tạo `src/modules/asset-hub/theme/colors.ts`:
   ```ts
   // Palette green/gold (VPBank) — nguồn chân lý cho asset-hub.
   // Ưu tiên dùng class Tailwind ah-* ; hằng số này chỉ cho chỗ cần hex trong JS.
   export const AH_COLORS = {
     green: '#00693E',
     greenDark: '#004C2E',
     greenLight: '#E9F3EE',
     gold: '#C59C37',
     ink: '#1d2521',
     muted: '#6a7873',
     line: '#dde5e1',
     bg: '#f0f4f2',
     card: '#ffffff',
   } as const;
   ```

## Success Criteria
- [ ] `tailwind.config.js` có `theme.extend.colors.ah`, `preflight` vẫn `false`.
- [ ] `theme/colors.ts` tạo xong, export `AH_COLORS`.
- [ ] `npm run build1` không lỗi mới; không thay đổi bất kỳ token/class màu cũ.

## Risk Assessment
- Rủi ro cực thấp (additive). Nếu lỡ trùng key `ah` với token cũ → grep `colors.ah` trước khi thêm (hiện config không có `theme` block nên an toàn).
