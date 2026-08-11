import React from 'react';

// Khung trang dùng chung cho các màn trắng: breadcrumb + tiêu đề + ô placeholder.
// `children` để override nội dung khi trang thật được xây sau này.
interface Props {
  crumb: string;
  title: string;
  children?: React.ReactNode;
}

const PageShell: React.FC<Props> = ({ crumb, title, children }) => (
  <div className="flex h-full flex-col">
    <div className="text-[11px] font-semibold uppercase tracking-wider text-ah-muted">{crumb}</div>
    <h1 className="mt-1 text-[22px] font-extrabold tracking-tight text-ah-green-d">{title}</h1>
    <div className="mt-4 flex flex-1 items-center justify-center rounded-xl border border-dashed border-ah-line bg-ah-card">
      {children ?? <p className="text-sm text-ah-muted">Nội dung sẽ được xây ở đây.</p>}
    </div>
  </div>
);

export default PageShell;
