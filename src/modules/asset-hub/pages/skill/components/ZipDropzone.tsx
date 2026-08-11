// ZipDropzone — drag/drop + click-to-pick for a single .zip file.
// Client-validates: extension must be .zip; size ≤ 20 MB.
// No import from src/hooks/* or src/pages/* (H4).

import React, { useRef, useState, useCallback } from 'react';

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB — matches BE memoryStorage limit

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
      if (err) {
        setLocalError(err);
        return;
      }
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
      // reset so the same file can be re-picked after clear
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

  return (
    <div className="flex flex-col gap-1">
      <div
        role="button"
        tabIndex={0}
        aria-label="Kéo thả hoặc chọn file .zip"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={[
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 transition-colors select-none',
          dragOver
            ? 'border-ah-green bg-ah-green-l'
            : value
            ? 'border-ah-green bg-ah-green-l'
            : displayError
            ? 'border-ah-red bg-ah-red-l'
            : 'border-ah-line bg-ah-pale hover:border-ah-green hover:bg-ah-green-l',
        ].join(' ')}
      >
        {value ? (
          <div className="flex items-center gap-3">
            {/* zip icon */}
            <svg className="h-8 w-8 flex-shrink-0 text-ah-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="max-w-[260px] truncate text-sm font-semibold text-ah-ink">{value.name}</span>
              <span className="text-xs text-ah-muted">{formatSize(value.size)}</span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              aria-label="Xóa file"
              className="ml-2 rounded p-0.5 text-ah-muted hover:text-ah-red transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <svg className="h-8 w-8 text-ah-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm text-ah-muted">
              Kéo thả file <span className="font-semibold text-ah-ink">.zip</span> vào đây hoặc{' '}
              <span className="font-semibold text-ah-green underline">chọn file</span>
            </p>
            <p className="text-xs text-ah-muted">Tối đa 20 MB · Phải chứa skill.md</p>
          </>
        )}
      </div>

      {displayError && (
        <p className="text-xs text-ah-red">{displayError}</p>
      )}

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
