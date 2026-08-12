// UploadFormHelpers — small reusable sub-components for PromptForm.
// Visual: TagInput uses antd Select (mode="tags", size="large") so it matches the sibling
// Name/Category antd controls exactly; animated error reveals; uppercase field labels.
// Logic, state, validation, and exported signatures are UNCHANGED.

import React from 'react';
import { Select, Tag } from 'antd';
import type { SelectProps } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from '../../../theme/motion';

// ---- Field wrapper ---------------------------------------------------------------

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}

export const Field: React.FC<FieldProps> = ({ label, required, children, error }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-semibold uppercase tracking-widest text-ah-muted">
      {label}
      {required && <span className="ml-0.5 text-ah-red">*</span>}
    </label>
    {children}
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          key="err"
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
          className="text-xs text-ah-red"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

// ---- Tag input (antd Select in tags mode → matches sibling Name/Category controls) ----

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

// Brand-green chip, consistent with the tag pills shown on prompt cards / detail.
const renderTag: SelectProps['tagRender'] = ({ label, closable, onClose }) => (
  <Tag
    closable={closable}
    onClose={onClose}
    color="green"
    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
    className="!rounded-full !border-ah-green/30 !bg-ah-green-l !text-ah-green !text-xs !font-semibold !my-0.5 !mr-1"
  >
    {label}
  </Tag>
);

export const TagInput: React.FC<TagInputProps> = ({ tags, onChange }) => {
  // Normalize on change: trim + lowercase + dedupe + drop empties (matches previous behavior).
  const handleChange = (values: string[]) => {
    const cleaned = values
      .map((v) => v.trim().toLowerCase())
      .filter((v, i, arr) => v && arr.indexOf(v) === i);
    onChange(cleaned);
  };

  return (
    <Select
      mode="tags"
      size="large"
      className="w-full"
      value={tags}
      onChange={handleChange}
      tokenSeparators={[',']}
      open={false}
      suffixIcon={null}
      tagRender={renderTag}
      placeholder="Nhập tag, Enter để thêm…"
    />
  );
};

// ---- Error mapping ---------------------------------------------------------------

/** Map BE HTTP status codes to human-readable Vietnamese messages for inline display. */
export function mapUploadError(status: number, message?: string): string {
  if (status === 422) {
    return `Zip không hợp lệ: ${message ?? 'Thiếu prompt.md hoặc vi phạm giới hạn nén.'}`;
  }
  if (status === 409) {
    return 'Đã có một phiên bản đang chờ duyệt cho package này. Vui lòng chờ kết quả trước khi upload tiếp.';
  }
  if (status === 502) {
    return 'Dịch vụ lưu trữ file (Strapi) hiện không khả dụng. Vui lòng thử lại sau.';
  }
  if (status === 403) {
    return 'Bạn không có quyền upload prompt. Liên hệ quản trị viên.';
  }
  if (status === 400) {
    return `Dữ liệu không hợp lệ: ${message ?? 'Kiểm tra lại các trường bắt buộc.'}`;
  }
  return message ?? `Lỗi không xác định (HTTP ${status}).`;
}
