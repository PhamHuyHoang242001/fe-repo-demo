import React from 'react';
import { NavLink } from 'react-router-dom';
import { Tooltip } from 'antd';
import { NavItem } from './navItems';
import { Icon, LockIcon } from './icons';

// Một dòng nav. Enabled → NavLink (active = accent bar trái + nền xanh nhạt + icon xanh).
// Locked → div mờ + icon khóa nhỏ bên phải (KHÔNG chữ "Sắp có"), không điều hướng.
// Khi collapsed: ẩn label, căn giữa icon, bọc Tooltip hiện tên khi hover.
interface Props {
  item: NavItem;
  collapsed: boolean;
}

// no-underline: preflight OFF nên thẻ <a> của NavLink dính gạch chân mặc định của trình duyệt.
const ROW =
  'group relative flex items-center rounded-lg text-[13px] no-underline transition-colors duration-150 ease-out motion-reduce:transition-none';

const SidebarItem: React.FC<Props> = ({ item, collapsed }) => {
  const pad = collapsed ? 'h-10 justify-center px-0' : 'h-9 gap-3 px-3';

  const iconEl = (active?: boolean) => (
    <Icon
      name={item.icon}
      className={`h-[18px] w-[18px] flex-shrink-0 transition-transform duration-150 ease-out motion-reduce:transition-none ${
        active ? '' : 'group-hover:scale-110'
      }`}
    />
  );

  let row: React.ReactNode;

  if (item.locked) {
    row = (
      <div className={`${ROW} ${pad} cursor-default text-ah-muted/45`} aria-disabled>
        {iconEl()}
        {!collapsed && (
          <>
            <span className="truncate">{item.label}</span>
            <LockIcon className="ml-auto h-3.5 w-3.5 text-ah-muted/40" />
          </>
        )}
      </div>
    );
  } else {
    row = (
      <NavLink
        to={item.to as string}
        end
        className={({ isActive }) =>
          `${ROW} ${pad} ${
            isActive
              ? 'bg-ah-green-l font-semibold text-ah-green-d shadow-[inset_0_0_0_1px_rgba(0,105,62,0.08)] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-r-full before:bg-ah-green'
              : 'font-medium text-ah-ink hover:bg-ah-pale hover:text-ah-ink'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {iconEl(isActive)}
            {!collapsed && <span className="truncate">{item.label}</span>}
            {!collapsed && item.badge && (
              <span className="ml-auto rounded-md bg-ah-gold px-1.5 py-0.5 text-[10px] font-bold text-white">
                {item.badge}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  }

  return collapsed ? (
    <Tooltip title={item.locked ? `${item.label} · Sắp có` : item.label} placement="right" mouseEnterDelay={0.15}>
      {row}
    </Tooltip>
  ) : (
    row
  );
};

export default SidebarItem;
