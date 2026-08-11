// AvatarPicker — optional image picker with preview thumbnail.
// Client-validates: image MIME type + size ≤ 5 MB.
// No import from src/hooks/* or src/pages/* (H4).

import React, { useRef, useState, useCallback } from 'react';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB — matches BE memoryStorage limit
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface AvatarPickerProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validate = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) return 'Chỉ chấp nhận ảnh (JPG, PNG, GIF, WebP, SVG)';
    if (file.size > MAX_BYTES) return `Ảnh quá lớn (tối đa 5 MB, thực tế ${formatSize(file.size)})`;
    return null;
  };

  const accept = useCallback((file: File) => {
    const err = validate(file);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onChange(file);
    // Build object URL for immediate preview — revoke on clear/replace
    const objectUrl = URL.createObjectURL(file);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return objectUrl;
    });
  }, [onChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) accept(file);
      e.target.value = '';
    },
    [accept],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setError(null);
      onChange(null);
    },
    [preview, onChange],
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        {/* Thumbnail / placeholder */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label="Chọn ảnh đại diện"
          className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-ah-line bg-ah-pale transition-colors hover:border-ah-green hover:bg-ah-green-l"
        >
          {preview ? (
            <img src={preview} alt="avatar preview" className="h-full w-full object-cover" />
          ) : (
            <svg className="h-6 w-6 text-ah-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18.75h16.5M3 6.75h18M3 12h18" />
            </svg>
          )}
        </button>

        <div className="flex flex-col gap-1 text-sm">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-fit font-semibold text-ah-green underline hover:text-ah-green-d transition-colors"
          >
            {value ? 'Đổi ảnh' : 'Chọn ảnh đại diện'}
          </button>
          {value ? (
            <div className="flex items-center gap-2 text-xs text-ah-muted">
              <span className="max-w-[180px] truncate">{value.name}</span>
              <span>({formatSize(value.size)})</span>
              <button
                type="button"
                onClick={handleClear}
                aria-label="Xóa ảnh"
                className="text-ah-muted hover:text-ah-red transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <span className="text-xs text-ah-muted">Tùy chọn · Tối đa 5 MB · JPG, PNG, WebP</span>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-ah-red">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default AvatarPicker;
