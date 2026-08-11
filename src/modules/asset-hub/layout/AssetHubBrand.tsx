import React from 'react';
import { BrandMark } from './icons';

// Ô brand góc trên-trái: NỀN gradient xanh lá VPBank + dải shimmer lấp lánh lướt chéo.
// Logo tile kính mờ (frosted) + hub mark trắng; wordmark chữ trắng cho tương phản chuẩn.
// Toggle đã dời ra nút nổi trên đường phân cách (AssetHubLayout).
// Khi collapsed: căn giữa logo tile; wordmark fade-out mượt.
interface Props {
  collapsed: boolean;
}

const AssetHubBrand: React.FC<Props> = ({ collapsed }) => (
  <div
    className={`relative flex h-full items-center gap-3 overflow-hidden border-b border-r border-ah-green-d bg-gradient-to-br from-ah-green-d via-ah-green to-ah-green-br ${
      collapsed ? 'justify-center px-0' : 'px-4'
    }`}
  >
    {/* Gloss tĩnh: sáng rất nhẹ nửa trên tạo chiều sâu (giảm để không chói) */}
    <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent" aria-hidden />
    {/* Shimmer sweep: dải sáng chéo lướt qua theo chu kỳ, dịu (tắt khi reduced-motion) */}
    <span
      className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 animate-ah-shimmer bg-gradient-to-r from-transparent via-white/[0.14] to-transparent motion-reduce:hidden"
      aria-hidden
    />

    {/* Logo tile: kính mờ + viền sáng + hub mark trắng */}
    <span
      className="relative z-10 grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-white/15 text-white shadow-[0_2px_10px_-2px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/30 backdrop-blur-sm"
      aria-hidden
    >
      <BrandMark className="h-5 w-5" />
      <span className="pointer-events-none absolute inset-x-1 top-0.5 h-1/2 rounded-t-xl bg-gradient-to-b from-white/25 to-transparent" />
    </span>

    {/* Wordmark — chữ trắng; thu chiều ngang + fade khi collapsed để không giật layout */}
    <div
      className={`relative z-10 min-w-0 leading-tight transition-all duration-200 ease-out motion-reduce:transition-none ${
        collapsed ? 'pointer-events-none w-0 -translate-x-1 opacity-0' : 'w-auto translate-x-0 opacity-100'
      }`}
    >
      <div className="truncate text-[13.5px] font-bold tracking-tight text-white drop-shadow-sm">VPBank AI Asset Hub</div>
      <div className="mt-1.5 truncate text-[9px] font-semibold uppercase tracking-[0.1em] text-white/75">
        Enterprise Control Plane
      </div>
    </div>
  </div>
);

export default AssetHubBrand;
