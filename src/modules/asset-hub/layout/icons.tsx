import React from 'react';

// Bộ icon SVG line (phong cách Lucide, stroke 1.75, currentColor) — thay toàn bộ
// unicode glyph cũ (◆ ☰ ▤ 🔎 📈) để đồng bộ, sắc nét, theme-driven. Zero-dep: chỉ SVG
// nội tuyến, không kéo thư viện icon mới (giữ nguyên nguyên tắc module cô lập).

export type IconName =
  | 'dashboard'
  | 'catalog'
  | 'lineage'
  | 'model'
  | 'dataset'
  | 'skill'
  | 'prompt'
  | 'workflow'
  | 'api'
  | 'playground'
  | 'governance'
  | 'observability';

// Map name → path elements (viewBox 0 0 24 24). Mỗi icon mang ý nghĩa rõ với mục nav.
const PATHS: Record<IconName, React.ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  catalog: (
    <>
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </>
  ),
  lineage: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5 15.4 17.5M15.4 6.5 8.6 10.5" />
    </>
  ),
  model: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </>
  ),
  dataset: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5" />
      <path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3" />
    </>
  ),
  skill: (
    <>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </>
  ),
  prompt: (
    <>
      <path d="M12 3.2 13.9 9 19.5 9 15 12.6l1.7 5.6L12 14.9 7.3 18.2 9 12.6 4.5 9 10.1 9Z" />
      <path d="M19 3v3.5M20.75 4.75h-3.5" />
    </>
  ),
  workflow: (
    <>
      <rect x="3" y="3" width="6" height="6" rx="1.5" />
      <rect x="15" y="15" width="6" height="6" rx="1.5" />
      <path d="M6 9v3a3 3 0 0 0 3 3h6" />
    </>
  ),
  api: <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />,
  playground: (
    <>
      <path d="M10 3h4M10 3v6.5L4.7 18a2 2 0 0 0 1.7 3h11.2a2 2 0 0 0 1.7-3L14 9.5V3" />
      <path d="M7.5 15h9" />
    </>
  ),
  governance: (
    <>
      <path d="M12 3v18M7.5 21h9" />
      <path d="M12 6 5 8l-2.4 5.6a3.4 3.4 0 0 0 4.8 0L5 8M12 6l7 2 2.4 5.6a3.4 3.4 0 0 1-4.8 0L19 8" />
    </>
  ),
  observability: <path d="M22 12h-4l-3 8L9 4l-3 8H2" />,
};

interface IconProps {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}

// Icon nav dùng chung. size điều khiển bằng className (w/h), màu bằng text-* (currentColor).
export const Icon: React.FC<IconProps> = ({ name, className = 'h-[18px] w-[18px]', strokeWidth = 1.75 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    {PATHS[name]}
  </svg>
);

// Chevron trái — nút toggle xoay 180° khi collapsed (bằng class rotate của caller).
export const ChevronIcon: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const LockIcon: React.FC<{ className?: string }> = ({ className = 'h-3.5 w-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

// Logo mark: hub mạng (1 node trung tâm + 3 node vệ tinh nối tia) — biểu đạt "Asset Hub /
// Control Plane". Dùng trong ô gradient của AssetHubBrand. Màu kế thừa currentColor (trắng).
export const BrandMark: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M12 12 12 4.5M12 12 5.5 16M12 12 18.5 16" opacity="0.9" />
    <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
    <circle cx="12" cy="4" r="1.9" fill="currentColor" stroke="none" />
    <circle cx="5" cy="17" r="1.9" fill="currentColor" stroke="none" />
    <circle cx="19" cy="17" r="1.9" fill="currentColor" stroke="none" />
  </svg>
);
