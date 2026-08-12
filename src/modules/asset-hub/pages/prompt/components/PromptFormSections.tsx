// PromptFormSections — sub-components used exclusively by PromptForm.
// Extracted to keep PromptForm.tsx under 200 lines.
// Visual: CARD_BASE sections with StaggerList/StaggerItem reveals.

import React from 'react';
import { Link } from 'react-router-dom';
import { Input, Select } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { PROMPT_CATEGORIES } from '../types';
import { Field, TagInput } from './UploadFormHelpers';
import AvatarPicker from './AvatarPicker';
import { StaggerList, StaggerItem, Reveal } from './motion-primitives';
import { CARD_BASE } from '../../../theme/surfaces';
import { scaleIn, fadeInUp, springSoft } from '../../../theme/motion';

// ---- Header --------------------------------------------------------------------

interface FormHeaderProps {
  mode: 'new' | 'edit';
  className?: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ mode, className = 'mb-6' }) => (
  <Reveal className={className}>
    <Link
      to="/asset-hub/prompt"
      className="text-[11px] font-semibold uppercase tracking-widest text-ah-muted transition-colors hover:text-ah-green"
    >
      ← Prompt
    </Link>
    <h1 className="mt-1.5 text-[24px] font-extrabold leading-tight tracking-tight text-ah-green-d">
      {mode === 'edit' ? 'Chỉnh sửa prompt' : 'Upload Package mới'}
    </h1>
  </Reveal>
);

// ---- Submit button (rendered top-right in the header row) ----------------------

interface SubmitButtonProps {
  mode: 'new' | 'edit';
  submitting: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ mode, submitting }) => (
  <motion.button
    type="submit"
    disabled={submitting}
    variants={fadeInUp}
    initial="hidden"
    animate="show"
    transition={{ delay: 0.2 }}
    whileHover={!submitting ? { scale: 1.02 } : {}}
    whileTap={!submitting ? { scale: 0.97 } : {}}
    className="flex shrink-0 items-center justify-center gap-2.5 rounded-xl bg-ah-green px-6 py-3 text-sm font-bold text-white shadow-ah-glow-sm transition-colors hover:bg-ah-green-d disabled:cursor-not-allowed disabled:opacity-60"
  >
    {submitting && (
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
    )}
    {submitting ? 'Đang gửi…' : mode === 'edit' ? 'Gửi phiên bản mới' : 'Upload Package mới'}
  </motion.button>
);

// ---- Non-ready state screens ---------------------------------------------------

type NotReadyState = 'loading' | 'forbidden' | 'pending' | 'error';

const NOTICE_TEXT: Record<Exclude<NotReadyState, 'loading'>, { title: string; hint?: string }> = {
  forbidden: { title: 'Bạn không có quyền chỉnh sửa prompt này.' },
  pending: { title: 'Đang có phiên bản chờ duyệt.', hint: 'Không thể chỉnh sửa cho tới khi phiên bản hiện tại được duyệt hoặc từ chối.' },
  error: { title: 'Không thể tải prompt để chỉnh sửa.' },
};

export const NotReadyScreen: React.FC<{ loadState: NotReadyState }> = ({ loadState }) => (
  <div className={`flex flex-1 ${CARD_BASE} p-6`}>
    {loadState === 'loading' ? (
      <div className="flex flex-1 items-center justify-center gap-2">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-ah-line border-t-ah-green" />
        <span className="text-sm text-ah-muted">Đang tải…</span>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <p className="text-sm font-semibold text-ah-ink">{NOTICE_TEXT[loadState].title}</p>
        {NOTICE_TEXT[loadState].hint && <p className="text-xs text-ah-muted">{NOTICE_TEXT[loadState].hint}</p>}
        <Link to="/asset-hub/prompt" className="text-sm font-semibold text-ah-green hover:text-ah-green-d">← Quay lại danh sách</Link>
      </div>
    )}
  </div>
);

// ---- Main fields card ----------------------------------------------------------

interface MainFieldsProps {
  name: string; setName: (v: string) => void;
  shortDesc: string; setShortDesc: (v: string) => void;
  category: string; setCategory: (v: string) => void;
  tags: string[]; setTags: (v: string[]) => void;
  errors: { name?: string; shortDesc?: string; category?: string };
}

export const MainFieldsCard: React.FC<MainFieldsProps> = ({
  name, setName, shortDesc, setShortDesc, category, setCategory, tags, setTags, errors,
}) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    animate="show"
    className={`${CARD_BASE} flex flex-col gap-5 p-6`}
  >
    <StaggerList className="flex flex-col gap-5">
      <StaggerItem>
        <Field label="Tên prompt" required error={errors.name}>
          <Input size="large" allowClear value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Excel Data Analyzer" status={errors.name ? 'error' : undefined} />
        </Field>
      </StaggerItem>
      <StaggerItem>
        <Field label="Mô tả ngắn" required error={errors.shortDesc}>
          <Input.TextArea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)}
            autoSize={{ minRows: 2, maxRows: 5 }} placeholder="Mô tả chức năng chính của prompt…"
            size="large" status={errors.shortDesc ? 'error' : undefined} />
        </Field>
      </StaggerItem>
      <StaggerItem>
        <Field label="Category" required error={errors.category}>
          <Select size="large" value={category || undefined} onChange={setCategory}
            placeholder="Chọn category…" status={errors.category ? 'error' : undefined}
            className="w-full"
            options={PROMPT_CATEGORIES.map((c) => ({ value: c, label: c }))} />
        </Field>
      </StaggerItem>
      <StaggerItem>
        <Field label="Tags (tùy chọn)">
          <TagInput tags={tags} onChange={setTags} />
        </Field>
      </StaggerItem>
    </StaggerList>
  </motion.div>
);

// ---- Prompt content / avatar card ----------------------------------------------

interface FilesCardProps {
  promptContent: string; setPromptContent: (v: string) => void;
  avatar: File | null; setAvatar: (f: File | null) => void;
  existingAvatarUrl: string | null;
  promptContentError?: string;
  maxLength: number;
}

export const FilesCard: React.FC<FilesCardProps> = ({
  promptContent, setPromptContent, avatar, setAvatar, existingAvatarUrl, promptContentError, maxLength,
}) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    animate="show"
    transition={{ delay: 0.08 }}
    className={`${CARD_BASE} flex flex-col gap-5 p-6`}
  >
    <Field label="Nội dung Prompt" required error={promptContentError}>
      <Input.TextArea
        value={promptContent}
        onChange={(e) => setPromptContent(e.target.value)}
        autoSize={{ minRows: 10, maxRows: 24 }}
        maxLength={maxLength}
        showCount
        size="large"
        status={promptContentError ? 'error' : undefined}
        placeholder="Nhập nội dung prompt của bạn tại đây…"
        style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: 13, lineHeight: 1.6 }}
      />
    </Field>
    <Field label="Ảnh đại diện (tùy chọn)">
      {existingAvatarUrl && !avatar && (
        <motion.img
          src={existingAvatarUrl}
          alt="avatar hiện tại"
          variants={scaleIn}
          initial="hidden"
          animate="show"
          className="mb-3 h-14 w-14 rounded-xl border border-ah-line object-cover shadow-ah-float"
        />
      )}
      <AvatarPicker value={avatar} onChange={setAvatar} />
    </Field>
  </motion.div>
);

// ---- Changelog card (edit only) + global error banner -------------------------

export const ChangelogCard: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <motion.div key="changelog" variants={fadeInUp} initial="hidden" animate="show"
    exit={{ opacity: 0, y: -8 }} transition={{ delay: 0.14 }} className={`${CARD_BASE} p-6`}>
    <Field label="Ghi chú thay đổi (tùy chọn)">
      <Input.TextArea value={value} onChange={(e) => onChange(e.target.value)}
        autoSize={{ minRows: 2, maxRows: 5 }} placeholder="Mô tả những thay đổi trong phiên bản này…" size="large" />
    </Field>
  </motion.div>
);

export const GlobalErrorBanner: React.FC<{ message: string }> = ({ message }) => (
  <motion.div key="global-err" initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={springSoft}
    className="rounded-xl border border-ah-red bg-ah-red-l px-5 py-3.5 text-sm text-ah-red">
    {message}
  </motion.div>
);
