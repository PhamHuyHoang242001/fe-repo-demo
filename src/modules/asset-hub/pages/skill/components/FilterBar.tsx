// Filter bar: debounced search input + category select + tags chip-input.
// All state is managed externally — this is a controlled component.
// Local debounce is applied inside so parent receives only settled values.
// Imports only from within the module — no src/hooks/* or src/pages/* (H4).

import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../types';
import { useDebounce } from '../hooks/useDebounce';

interface FilterBarProps {
  onFilterChange: (filters: { search: string; category: string; tags: string[] }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [searchRaw, setSearchRaw] = useState('');
  const [category, setCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Debounce the search query — parent only hears settled value after 350 ms.
  const searchDebounced = useDebounce(searchRaw, 350);

  // Notify parent whenever a settled filter value changes.
  React.useEffect(() => {
    onFilterChange({ search: searchDebounced, category, tags });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounced, category, tags]);

  const addTag = (raw: string) => {
    const trimmed = raw.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <input
        type="text"
        value={searchRaw}
        onChange={(e) => setSearchRaw(e.target.value)}
        placeholder="Tìm kiếm skill…"
        className="h-8 min-w-[180px] flex-1 rounded-lg border border-ah-line bg-ah-pale px-3 text-sm text-ah-ink placeholder:text-ah-muted focus:border-ah-green focus:outline-none"
      />

      {/* Category select */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="h-8 rounded-lg border border-ah-line bg-ah-pale px-2 text-sm text-ah-ink focus:border-ah-green focus:outline-none"
      >
        <option value="">Tất cả danh mục</option>
        {SKILL_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Tags chip input */}
      <div className="flex h-8 min-w-[160px] flex-1 flex-wrap items-center gap-1 rounded-lg border border-ah-line bg-ah-pale px-2 focus-within:border-ah-green">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-0.5 rounded-full bg-ah-green-l px-2 py-0.5 text-[10px] font-medium text-ah-green-d"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-0.5 leading-none text-ah-green hover:text-ah-green-d"
              aria-label={`Remove tag ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          onBlur={() => tagInput.trim() && addTag(tagInput)}
          placeholder={tags.length === 0 ? 'Thêm tag, Enter để xác nhận…' : ''}
          className="min-w-[80px] flex-1 bg-transparent text-xs text-ah-ink placeholder:text-ah-muted focus:outline-none"
        />
      </div>
    </div>
  );
};

export default FilterBar;
