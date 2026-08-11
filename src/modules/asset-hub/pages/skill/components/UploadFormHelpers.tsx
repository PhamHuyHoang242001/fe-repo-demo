// UploadFormHelpers — small reusable sub-components for UploadForm.
// Extracted to keep UploadForm.tsx under 200 lines.

import React, { useState } from 'react';

// ---- Field wrapper ---------------------------------------------------------------

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}

export const Field: React.FC<FieldProps> = ({ label, required, children, error }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold uppercase tracking-wider text-ah-muted">
      {label}{required && <span className="ml-0.5 text-ah-red">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-ah-red">{error}</p>}
  </div>
);

// ---- Tag chip input --------------------------------------------------------------

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, onChange }) => {
  const [draft, setDraft] = useState('');

  const add = () => {
    const t = draft.trim().toLowerCase();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setDraft('');
  };

  return (
    <div className="flex flex-wrap gap-1.5 rounded-lg border border-ah-line bg-ah-pale px-2 py-1.5 min-h-[38px]">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-full bg-ah-green-l px-2 py-0.5 text-xs font-semibold text-ah-green"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="ml-0.5 text-ah-muted hover:text-ah-red"
          >
            ✕
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        placeholder={tags.length ? '' : 'Nhập tag, Enter để thêm…'}
        className="flex-1 min-w-[120px] bg-transparent text-xs outline-none placeholder:text-ah-muted"
      />
    </div>
  );
};

// ---- Error mapping ---------------------------------------------------------------

/** Map BE HTTP status codes to human-readable Vietnamese messages for inline display. */
export function mapUploadError(status: number, message?: string): string {
  if (status === 422) {
    return `Zip không hợp lệ: ${message ?? 'Thiếu skill.md hoặc vi phạm giới hạn nén.'}`;
  }
  if (status === 409) {
    return 'Đã có một phiên bản đang chờ duyệt cho package này. Vui lòng chờ kết quả trước khi upload tiếp.';
  }
  if (status === 502) {
    return 'Dịch vụ lưu trữ file (Strapi) hiện không khả dụng. Vui lòng thử lại sau.';
  }
  if (status === 403) {
    return 'Bạn không có quyền upload skill. Liên hệ quản trị viên.';
  }
  if (status === 400) {
    return `Dữ liệu không hợp lệ: ${message ?? 'Kiểm tra lại các trường bắt buộc.'}`;
  }
  return message ?? `Lỗi không xác định (HTTP ${status}).`;
}
