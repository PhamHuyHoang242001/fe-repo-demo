import React from 'react';
import { Pagination } from 'antd';
import type { PaginationProps } from 'antd';

interface PaginationComponentProps {
  total: number; // Tổng số items
  pageSize: number; // Số items trên mỗi trang
  currentPage: number; // Trang hiện tại
  onPageChange: (page: number, pageSize: number) => void; // Hàm xử lý khi thay đổi trang
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ total, pageSize, currentPage, onPageChange }) => {
  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, size) => {
    onPageChange(current, size);
  };
  const options = pageSize % 6 === 0 ? ['6', '9', '12', '15'] : ['10', '50', '100'];
  return (
    <div className="flex flex-row justify-center items-center">
      <Pagination
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={onPageChange}
        pageSizeOptions={options}
        locale={{ items_per_page: '' }}
      />
    </div>
  );
};

export default PaginationComponent;
