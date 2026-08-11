import React from 'react';
import { NAV_GROUPS } from './navItems';
import SidebarItem from './SidebarItem';

// Sidebar: render NAV_GROUPS. Khi collapsed → ẩn heading nhóm (fade + thu chiều cao),
// mục nav căn giữa icon. Divider mảnh giữa các nhóm giữ nhịp thị giác.
interface Props {
  collapsed: boolean;
}

const AssetHubSidebar: React.FC<Props> = ({ collapsed }) => (
  <aside
    className={`h-full overflow-y-auto overflow-x-hidden border-r border-ah-line bg-ah-card py-3 ${
      collapsed ? 'px-2' : 'px-3'
    }`}
  >
    {NAV_GROUPS.map((group, gi) => (
      <div key={group.heading} className={gi > 0 ? 'mt-1' : ''}>
        {/* Heading nhóm — fade + collapse chiều cao khi thu gọn (không giật layout) */}
        <div
          className={`overflow-hidden px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-ah-muted/80 transition-all duration-200 ease-out motion-reduce:transition-none ${
            collapsed ? 'mb-0 mt-2 h-0 opacity-0' : 'mb-1.5 mt-3 h-4 opacity-100'
          }`}
        >
          {group.heading}
        </div>
        <div className="flex flex-col gap-0.5">
          {group.items.map((item) => (
            <SidebarItem key={item.id} item={item} collapsed={collapsed} />
          ))}
        </div>
      </div>
    ))}
  </aside>
);

export default AssetHubSidebar;
