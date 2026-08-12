// ZipDropzone — drag/drop + click-to-pick for a single .zip file.
// Visual redesign: bold dashed frame, drag-over animation (scale + border color), file chip
// animates in with spring. Logic, validation, and props are UNCHANGED.
// No import from src/hooks/* or src/pages/* (H4).

import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scaleIn, springSoft } from '../../../theme/motion';

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB — matches BE memoryStorage limit

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Icon paths inlined as constants to avoid extra component overhead.
const PATH_UPLOAD = 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5';
const PATH_ZIPFILE = 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
const PATH_CLOSE = 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z';

interface ZipDropzoneProps {
  value: File | null;
  onChange: (file: File | null) => void;
  /** Field-level error string (e.g. from parent submit validation or BE 422). */
  error?: string;
}

const ZipDropzone: React.FC<ZipDropzoneProps> = ({ value, onChange, error }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const validate = useCallback((file: File): string | null => {
    if (!file.name.toLowerCase().endsWith('.zip')) return 'Chỉ chấp nhận file .zip';
    if (file.size > MAX_BYTES) return `File quá lớn (tối đa 20 MB, thực tế ${formatSize(file.size)})`;
    return null;
  }, []);

  const accept = useCallback(
    (file: File) => {
      const err = validate(file);
      if (err) { setLocalError(err); return; }
      setLocalError(null);
      onChange(file);
    },
    [validate, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) accept(file);
    },
    [accept],
  );

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
      setLocalError(null);
      onChange(null);
    },
    [onChange],
  );

  const displayError = localError ?? error;

  // Derive border/background class based on state
  const zoneClass = [
    'relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 select-none outline-none',
    'transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ah-green/40',
    dragOver
      ? 'border-ah-green bg-ah-green-l shadow-ah-glow-sm scale-[1.01]'
      : value
      ? 'border-ah-green bg-ah-green-l shadow-ah-float'
      : displayError
      ? 'border-ah-red bg-ah-red-l'
      : 'border-ah-line bg-ah-pale hover:border-ah-green hover:bg-ah-green-l hover:shadow-ah-glow-sm',
  ].join(' ');

  return (
    <div className="flex flex-col gap-1.5">
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Kéo thả hoặc chọn file .zip"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={zoneClass}
        animate={{ scale: dragOver ? 1.015 : 1 }}
        transition={springSoft}
      >
        <AnimatePresence mode="wait" initial={false}>
          {value ? (
            <motion.div key="file-chip" variants={scaleIn} initial="hidden" animate="show" exit="exit" className="flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-ah-green/10">
                <svg className="h-6 w-6 text-ah-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={PATH_ZIPFILE} /></svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="max-w-[240px] truncate text-sm font-bold text-ah-ink">{value.name}</span>
                <span className="text-xs text-ah-muted">{formatSize(value.size)}</span>
              </div>
              <button type="button" onClick={handleClear} aria-label="Xóa file" className="ml-1 rounded-lg p-1.5 text-ah-muted transition-colors hover:bg-ah-red/10 hover:text-ah-red">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d={PATH_CLOSE} clipRule="evenodd" /></svg>
              </button>
            </motion.div>
          ) : (
            <motion.div key="prompt" variants={scaleIn} initial="hidden" animate="show" exit="exit" className="flex flex-col items-center gap-2 text-center">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${dragOver ? 'bg-ah-green/20' : 'bg-ah-muted/10'}`}>
                <svg className={`h-7 w-7 transition-colors ${dragOver ? 'text-ah-green' : 'text-ah-muted'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={PATH_UPLOAD} /></svg>
              </div>
              <p className="text-sm text-ah-muted">
                Kéo thả file <span className="font-bold text-ah-ink">.zip</span> vào đây hoặc{' '}
                <span className="font-bold text-ah-green underline">chọn file</span>
              </p>
              <p className="text-xs text-ah-muted">Tối đa 20 MB · Phải chứa skill.md</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence initial={false}>
        {displayError && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-xs text-ah-red"
          >
            {displayError}
          </motion.p>
        )}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="file"
        accept=".zip,application/zip"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default ZipDropzone;
