import React, { useMemo } from 'react';
import { Select } from 'antd';
import { useCategories } from '../hooks/useCategories';
import type { AssetHubCategory } from '../types/category';
import type { AssetHubCategoryType } from '../types/category';
import { buildCategoryOptionLabel, resolveCategoryId } from '../utils/category';
import type { AssetHubCategoryValue } from '../types/category';

interface CategorySelectProps {
  type: AssetHubCategoryType;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
  status?: 'error' | 'warning';
  disabled?: boolean;
  size?: 'large' | 'middle' | 'small';
  allowInactiveSelection?: boolean;
  selectedCategory?: AssetHubCategoryValue;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  type,
  value,
  onChange,
  placeholder = 'Chọn danh mục…',
  className,
  ariaLabel,
  status,
  disabled,
  size = 'large',
  allowInactiveSelection = true,
  selectedCategory,
}) => {
  const { data, loading, error } = useCategories(type);
  const selectedId = resolveCategoryId(selectedCategory);

  const options = useMemo(() => {
    const activeOptions = data.map((category) => ({
      value: category.id,
      label: buildCategoryOptionLabel(category),
      disabled: category.is_active === false && category.id !== value,
    }));

    if (!allowInactiveSelection || !selectedCategory || typeof selectedCategory === 'string') {
      return activeOptions;
    }

    const exists = activeOptions.some((option) => option.value === selectedCategory.id);
    if (exists) return activeOptions;

    return [
      ...activeOptions,
      {
        value: selectedCategory.id,
        label: buildCategoryOptionLabel(selectedCategory as AssetHubCategory),
        disabled: selectedCategory.is_active === false && selectedCategory.id !== value,
      },
    ];
  }, [allowInactiveSelection, data, selectedCategory, value]);

  return (
    <Select<number>
      size={size}
      value={value ?? undefined}
      onChange={(next) => onChange(next ?? null)}
      placeholder={placeholder}
      className={className}
      aria-label={ariaLabel}
      options={options}
      loading={loading}
      status={status ?? (error ? 'error' : undefined)}
      disabled={disabled}
      notFoundContent={error ?? 'Không có danh mục phù hợp'}
      optionFilterProp="label"
      popupMatchSelectWidth
      allowClear
      onClear={() => onChange(null)}
    />
  );
};

export default CategorySelect;
