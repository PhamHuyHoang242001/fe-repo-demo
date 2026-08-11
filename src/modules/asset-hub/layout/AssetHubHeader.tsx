import React from 'react';
import { Avatar, Dropdown, MenuProps } from 'antd';
import EnvChips from './EnvChips';
import { SearchIcon } from './icons';
import { AH_COLORS } from '../theme/colors';

// Header (topbar): search pill (focus ring) · env chip · avatar menu (visual).
// Giai đoạn layout — chưa gắn handler thật (input/menu chỉ để hiển thị).
const USER_MENU: MenuProps['items'] = [{ key: 'logout', label: 'Đăng xuất' }];

const AssetHubHeader: React.FC = () => (
  <header className="flex h-full items-center gap-4 border-b border-ah-line bg-ah-card px-6">
    {/* Search pill — SVG icon + focus-within ring xanh, ⌘K kbd chỉn chu */}
    <label className="flex w-full max-w-[520px] items-center gap-2.5 rounded-lg border border-ah-line bg-ah-pale px-3 py-2 text-ah-muted transition-all duration-150 ease-out focus-within:border-ah-green/40 focus-within:bg-ah-card focus-within:shadow-[0_0_0_3px_rgba(0,105,62,0.10)] motion-reduce:transition-none">
      <SearchIcon className="h-4 w-4 flex-shrink-0" />
      <input
        className="flex-1 border-0 bg-transparent text-[13px] text-ah-ink outline-none placeholder:text-ah-muted"
        placeholder="Tìm model, dataset, skill, workflow, API, prompt…"
      />
      <kbd className="hidden select-none rounded border border-ah-line bg-ah-card px-1.5 py-0.5 font-sans text-[10px] font-semibold text-ah-muted sm:inline-block">
        ⌘K
      </kbd>
    </label>

    {/* Cụm phải: env chip · avatar */}
    <div className="ml-auto flex items-center gap-3">
      <EnvChips />
      <Dropdown menu={{ items: USER_MENU }} trigger={['click']} placement="bottomRight">
        <Avatar
          size={34}
          className="cursor-pointer font-bold ring-2 ring-transparent transition-shadow duration-150 hover:ring-ah-green/25"
          style={{ backgroundColor: AH_COLORS.green }}
        >
          AĐ
        </Avatar>
      </Dropdown>
    </div>
  </header>
);

export default AssetHubHeader;
