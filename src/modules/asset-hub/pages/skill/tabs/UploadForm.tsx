// UploadForm — orchestrates New / Update skill package upload.
// OVERWRITING Phase 3 placeholder (spec Phase 5).
// Sub-components (Field, TagInput, mapUploadError) live in components/UploadFormHelpers.tsx.
// No import from src/hooks/* or src/pages/* (H4).
// Tags: appended as repeated 'tags' FormData fields — multer/class-transformer parses as array (C2).

import React, { useState, useCallback } from 'react';
import { uploadNew, uploadUpdate, uploadFileToStrapi } from '../api/skillApi';
import { SKILL_CATEGORIES } from '../types';
import type { SkillListItem } from '../types';
import ZipDropzone from '../components/ZipDropzone';
import AvatarPicker from '../components/AvatarPicker';
import PackagePicker from '../components/PackagePicker';
import { Field, TagInput, mapUploadError } from '../components/UploadFormHelpers';

type Mode = 'new' | 'update';

interface FormErrors {
  name?: string; shortDesc?: string; category?: string;
  zip?: string; package?: string; global?: string;
}

// ---- Success screen --------------------------------------------------------------

const SuccessScreen: React.FC<{ name: string; onReset: () => void }> = ({ name, onReset }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ah-green-l">
      <svg className="h-7 w-7 text-ah-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h2 className="text-lg font-bold text-ah-ink">Upload thành công!</h2>
    <p className="text-sm text-ah-muted"><span className="font-semibold text-ah-ink">"{name}"</span> đã được gửi và đang chờ duyệt.</p>
    <button onClick={onReset} className="mt-2 rounded-lg border border-ah-line px-4 py-2 text-sm font-semibold text-ah-ink hover:bg-ah-pale transition-colors">Upload tiếp</button>
  </div>
);

// ---- Main component --------------------------------------------------------------

const UploadForm: React.FC = () => {
  const [mode, setMode] = useState<Mode>('new');
  const [name, setName] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [zip, setZip] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<SkillListItem | null>(null);
  const [changelogNote, setChangelogNote] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ name: string } | null>(null);

  const resetForm = useCallback(() => {
    setName(''); setShortDesc(''); setCategory(''); setTags([]);
    setZip(null); setAvatar(null); setSelectedPkg(null);
    setChangelogNote(''); setErrors({}); setSuccess(null);
  }, []);

  const switchMode = (m: Mode) => { setMode(m); resetForm(); };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = 'Tên là bắt buộc';
    if (!shortDesc.trim()) errs.shortDesc = 'Mô tả ngắn là bắt buộc';
    if (!category) errs.category = 'Category là bắt buộc';
    if (!zip) errs.zip = 'Vui lòng chọn file .zip';
    if (mode === 'update' && !selectedPkg) errs.package = 'Vui lòng chọn package cần cập nhật';
    return errs;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setErrors({});
      setSubmitting(true);
      try {
        // Pull-based flow: upload files to Strapi first, then send the URLs to the BE.
        const zip_url = await uploadFileToStrapi(zip!);
        const avatar_url = avatar ? await uploadFileToStrapi(avatar) : undefined;

        const basePayload = {
          zip_url,
          avatar_url,
          name: name.trim(),
          short_description: shortDesc.trim(),
          category,
          tags,
        };

        let resolvedName = name.trim();
        if (mode === 'update') {
          const ver = await uploadUpdate(selectedPkg!.id, {
            ...basePayload,
            changelog_note: changelogNote.trim() || undefined,
          });
          resolvedName = (ver as { name?: string }).name ?? resolvedName;
        } else {
          const pkg = await uploadNew(basePayload);
          resolvedName = pkg.active_version?.name ?? resolvedName;
        }
        setSuccess({ name: resolvedName });
      } catch (err: unknown) {
        const axErr = err as { response?: { status: number; data?: { message?: string } } };
        const status = axErr?.response?.status ?? 0;
        const msg = axErr?.response?.data?.message;
        setErrors({ global: mapUploadError(status, typeof msg === 'string' ? msg : undefined) });
      } finally {
        setSubmitting(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, name, shortDesc, category, tags, zip, avatar, selectedPkg, changelogNote],
  );

  if (success) return <SuccessScreen name={success.name} onReset={resetForm} />;

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto flex max-w-xl flex-col gap-5">
      {/* Mode toggle */}
      <div className="flex gap-1 rounded-lg border border-ah-line bg-ah-pale p-1">
        {(['new', 'update'] as Mode[]).map((m) => (
          <button key={m} type="button" onClick={() => switchMode(m)}
            className={['flex-1 rounded-md py-1.5 text-sm font-semibold transition-colors', mode === m ? 'bg-ah-green text-white shadow' : 'text-ah-muted hover:text-ah-ink'].join(' ')}>
            {m === 'new' ? 'Package mới' : 'Cập nhật'}
          </button>
        ))}
      </div>

      {mode === 'update' && (
        <Field label="Package cần cập nhật" required error={errors.package}>
          <PackagePicker value={selectedPkg} onChange={setSelectedPkg} error={errors.package} />
        </Field>
      )}

      <Field label="Tên skill" required error={errors.name}>
        <input value={name} onChange={(e) => setName(e.target.value)}
          className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-ah-green ${errors.name ? 'border-ah-red' : 'border-ah-line'}`}
          placeholder="Ví dụ: Excel Data Analyzer" />
      </Field>

      <Field label="Mô tả ngắn" required error={errors.shortDesc}>
        <textarea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} rows={2}
          className={`resize-none rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-ah-green ${errors.shortDesc ? 'border-ah-red' : 'border-ah-line'}`}
          placeholder="Mô tả chức năng chính của skill…" />
      </Field>

      <Field label="Category" required error={errors.category}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-ah-green bg-white ${errors.category ? 'border-ah-red' : 'border-ah-line'}`}>
          <option value="">Chọn category…</option>
          {SKILL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      <Field label="Tags (tùy chọn)">
        <TagInput tags={tags} onChange={setTags} />
      </Field>

      <Field label="File Zip" required error={errors.zip}>
        <ZipDropzone value={zip} onChange={setZip} error={errors.zip} />
      </Field>

      <Field label="Ảnh đại diện (tùy chọn)">
        <AvatarPicker value={avatar} onChange={setAvatar} />
      </Field>

      {mode === 'update' && (
        <Field label="Ghi chú thay đổi (tùy chọn)">
          <textarea value={changelogNote} onChange={(e) => setChangelogNote(e.target.value)} rows={2}
            className="resize-none rounded-lg border border-ah-line px-3 py-2 text-sm outline-none transition-colors focus:border-ah-green"
            placeholder="Mô tả những thay đổi trong phiên bản này…" />
        </Field>
      )}

      {errors.global && (
        <div className="rounded-lg border border-ah-red bg-ah-red-l px-4 py-3 text-sm text-ah-red">
          {errors.global}
        </div>
      )}

      <button type="submit" disabled={submitting}
        className="flex items-center justify-center gap-2 rounded-lg bg-ah-green px-6 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-ah-green-d disabled:cursor-not-allowed disabled:opacity-60">
        {submitting && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
        {submitting ? 'Đang upload…' : mode === 'new' ? 'Upload Package mới' : 'Upload phiên bản mới'}
      </button>
    </form>
  );
};

export default UploadForm;
