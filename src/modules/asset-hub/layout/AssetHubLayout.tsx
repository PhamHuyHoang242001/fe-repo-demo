import React, { useEffect, useState } from 'react';
import AssetHubBrand from './AssetHubBrand';
import AssetHubHeader from './AssetHubHeader';
import AssetHubSidebar from './AssetHubSidebar';
import { ChevronIcon } from './icons';

// Khung grid 2x2: [brand | header] / [sidebar | main].
// Sở hữu state `collapsed` (single source) → truyền xuống Brand + Sidebar.
// Persist localStorage để nhớ qua reload. Cột sidebar 250px ↔ 64px.
// Toggle = nút tròn NỔI trên đường phân cách sidebar↔content (mẫu Notion/Linear/VS Code):
//   chevron xoay 180° theo trạng thái, căn tâm đúng đường seam ở mọi width.
const STORAGE_KEY = 'ah:collapsed';

const AssetHubLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(() => localStorage.getItem(STORAGE_KEY) === '1');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  const cols = collapsed ? 'grid-cols-[64px_1fr]' : 'grid-cols-[250px_1fr]';
  // Tâm nút (w-7=28px) nằm đúng seam: expanded 250-14=236, collapsed 64-14=50.
  const railLeft = collapsed ? 'left-[50px]' : 'left-[236px]';

  return (
    <div
      className={`relative box-border grid h-screen overflow-hidden ${cols} grid-rows-[58px_1fr] bg-ah-bg text-ah-ink transition-[grid-template-columns] duration-200 ease-out motion-reduce:transition-none`}
    >
      <AssetHubBrand collapsed={collapsed} />
      <AssetHubHeader />
      <AssetHubSidebar collapsed={collapsed} />
      <main className="overflow-y-auto p-6">{children}</main>

      {/* Nút toggle nổi trên seam — tách khỏi brand cho gọn & dễ với tới */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        aria-expanded={!collapsed}
        title={collapsed ? 'Mở rộng' : 'Thu gọn'}
        className={`group absolute top-[74px] z-20 grid h-7 w-7 place-items-center rounded-full border border-ah-line bg-ah-card text-ah-muted shadow-[0_2px_8px_-1px_rgba(29,37,33,0.18)] transition-all duration-200 ease-out hover:border-ah-green/40 hover:text-ah-green-d hover:shadow-[0_4px_12px_-2px_rgba(0,105,62,0.30)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ah-green/40 motion-reduce:transition-none ${railLeft}`}
      >
        <ChevronIcon
          className={`h-4 w-4 transition-transform duration-200 ease-out group-active:scale-90 motion-reduce:transition-none ${
            collapsed ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
};

export default AssetHubLayout;
