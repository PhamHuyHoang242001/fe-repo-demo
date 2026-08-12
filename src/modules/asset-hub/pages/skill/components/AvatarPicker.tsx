// AvatarPicker — optional image picker with preview thumbnail.
// Visual redesign: framed tile with hover ring + spring preview animation.
// Logic, validation (type + 5 MB), and props are UNCHANGED.
// No import from src/hooks/* or src/pages/* (H4).

import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scaleIn, springSoft } from '../../../theme/motion';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB — matches BE memoryStorage limit
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ImagePlaceholderIcon: React.FC = () => (
  <svg className="h-7 w-7 text-ah-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18.75h16.5M3 6.75h18M3 12h18" />
  </svg>
);

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
    if (err) { setError(err); return; }
    setError(null);
    onChange(file);
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        {/* Avatar tile — full-frame, hover green ring */}
        <motion.button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label="Chọn ảnh đại diện"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={springSoft}
          className={[
            'relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2',
            'transition-all duration-200',
            preview
              ? 'border-ah-green shadow-ah-glow-sm'
              : 'border-dashed border-ah-line bg-ah-pale hover:border-ah-green hover:bg-ah-green-l hover:shadow-ah-glow-sm',
          ].join(' ')}
        >
          <AnimatePresence mode="wait" initial={false}>
            {preview ? (
              <motion.img
                key="preview"
                src={preview}
                alt="avatar preview"
                variants={scaleIn}
                initial="hidden"
                animate="show"
                exit="exit"
                className="h-full w-full object-cover"
              />
            ) : (
              <motion.span
                key="placeholder"
                variants={scaleIn}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <ImagePlaceholderIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Info / actions */}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-fit text-sm font-bold text-ah-green underline underline-offset-2 transition-colors hover:text-ah-green-d"
          >
            {value ? 'Đổi ảnh' : 'Chọn ảnh đại diện'}
          </button>

          <AnimatePresence initial={false} mode="wait">
            {value ? (
              <motion.div
                key="file-info"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-xs text-ah-muted"
              >
                <span className="max-w-[160px] truncate">{value.name}</span>
                <span>({formatSize(value.size)})</span>
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Xóa ảnh"
                  className="rounded p-0.5 text-ah-muted transition-colors hover:text-ah-red"
                >
                  ✕
                </button>
              </motion.div>
            ) : (
              <motion.span
                key="hint"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-ah-muted"
              >
                Tùy chọn · Tối đa 5 MB · JPG, PNG, WebP
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-xs text-ah-red"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

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
