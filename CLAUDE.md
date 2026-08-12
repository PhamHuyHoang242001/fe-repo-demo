# CLAUDE.md — EDA_FE

Hướng dẫn cho Claude Code khi làm việc trong repo FE này.

## Stack

React 18 + TypeScript + Webpack + `react-router-dom` v6 + Redux Toolkit + **antd v5** + **Tailwind v3 (preflight OFF)** + `@loadable/component` (lazy) + i18next. Import resolve từ `src/` root (babel-plugin-module-resolver): vd `import X from 'layouts/Header'`.

## Routing hiện tại (base cũ — hạn chế đụng)

- `src/App.tsx` = top-level Routes: `/login`, `/forgot-password`, `/*` → `DefaultLayout`.
- `DefaultLayout` (auth-guarded, có idle-timer) → `Sidebar` + `PermissionContent`.
- `PermissionContent` map `routes/routes.ts`, bọc mỗi page bằng `Header`/`Footer` dùng chung.
- → Đây là phần logic dùng chung "rắc rối"; tính năng độc lập KHÔNG nên đi qua đây.

## [RULE] Isolated Modules — tính năng mới độc lập

Khi build một mảng tính năng mới muốn cô lập khỏi base cũ, dễ tích hợp/tháo gỡ:

1. **Vị trí:** đặt toàn bộ trong `src/modules/<ten-module>/`. Self-contained, không rải ra `pages/` cũ.
2. **Mount:** thêm route sibling tại `src/App.tsx` dạng `<Route path="/<ten-module>/*" element={<ModuleApp/>}/>`. **KHÔNG** đi qua `DefaultLayout` / `PermissionContent`.
3. **Cấu trúc chuẩn trong module:**
   ```
   src/modules/<ten>/
   ├── <Ten>App.tsx      # entry: guard → layout → nested <Routes>
   ├── routes.tsx        # bảng route nội bộ module
   ├── guard/            # guard nhẹ (isLogin() → Navigate /login), KHÔNG kéo idle-timer
   ├── layout/           # layout shell riêng: header + sidebar + content
   ├── pages/            # các trang của module
   └── theme/            # token màu (nguồn chân lý duy nhất)
   ```
4. **Không import chéo** logic base cũ. Chỉ được dùng util thuần (vd `utils/jwt`).
5. **Styling: Tailwind + antd (đã theme).** Preflight OFF (coexist antd). Ưu tiên Tailwind cho layout; dùng **antd v5** cho input/select/modal… (đã theme ah-* qua `ConfigProvider` trong `AssetHubApp`, prefer `size="large"`). Animation dùng **framer-motion** (đã cài) — variants dùng chung ở `theme/motion.ts`, primitives ở `components/motion-primitives.tsx`.
6. **Màu:** token hóa trong `tailwind.config.js` theo namespace module (vd `ah-green`), **không hardcode hex** rải rác.

## [RULE] Tiêu chí UI (bắt buộc)

- Đẹp — **hiện đại, bold, có chiều sâu & hiệu ứng** (không còn "tối giản phẳng"). Nhiều motion đẹp mắt nhưng **mượt, không gây rối/say** (mức vừa-đậm).
- **Border khuôn FULL** (đủ 4 cạnh, `rounded-2xl` cho panel/card) — KHÔNG dùng `border-b` nửa chừng. Nghỉ dùng `shadow-ah-float`, hover thêm `shadow-ah-glow` + viền xanh.
- **Input/Select/Textarea/Modal: dùng antd** (đã theme), không dùng `<input>/<select>` native thô.
- **Motion:** entrance fade+rise (`Reveal`/`fadeInUp`), list dùng `StaggerList/StaggerItem`, card `hoverLift`, modal `scaleIn` + `AnimatePresence`. Reduced-motion xử lý toàn cục qua `<MotionConfig reducedMotion="user">` — **không** thêm guard `motion-reduce` từng chỗ.
- Từng icon / text / mã màu **đồng bộ tuyệt đối**, rõ nghĩa, chuẩn chỉ.
- Design kit (nguồn chân lý): `theme/antd-theme.ts`, `theme/motion.ts`, `theme/surfaces.ts`, `pages/skill/components/motion-primitives.tsx`.
- File component `PascalCase`. File **< 200 dòng**, tách nhỏ theo concern.

## Ghi chú

- `tailwind.config.js` content đã glob `./src/**/*` → module mới tự được quét, không cần đổi config (trừ khi thêm color token).
