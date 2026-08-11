// Palette green/gold (VPBank) cho asset-hub.
// CANONICAL = `tailwind.config.js` (theme.extend.colors.ah). Ưu tiên LUÔN dùng class
// Tailwind ah-* (bg-ah-green, ...). Bảng dưới CHỈ dùng khi cần hex trong JS (vd inline
// style/canvas) — nếu sửa màu, phải sync cả 2 nơi. Key khớp token Tailwind để dễ đối chiếu.
export const AH_COLORS = {
  green: '#00693E',
  'green-d': '#004C2E',
  'green-br': '#0A7A48',
  'green-l': '#E9F3EE',
  gold: '#C59C37',
  ink: '#1d2521',
  muted: '#6a7873',
  line: '#dde5e1',
  bg: '#f0f4f2',
  card: '#ffffff',
  pale: '#F4F7F5',
  amber: '#B8860B',
  red: '#7A1F2B',
} as const;

export type AhColorKey = keyof typeof AH_COLORS;
