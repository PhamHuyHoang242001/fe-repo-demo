// PromptForm — route page for both New upload (/prompt/upload) and Edit (/prompt/:id/edit).
// Visual redesign: antd controls, stagger sections, animated error/submit.
// Extracted sub-components → PromptFormSections.tsx.
// The artifact is inline prompt text (prompt_content) sent as JSON — no ZIP upload.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { uploadNew, uploadUpdate, uploadFileToStrapi, detail as fetchDetail } from './api/promptApi';
import { mapUploadError } from './components/UploadFormHelpers';
import {
  FormHeader,
  SubmitButton,
  NotReadyScreen,
  MainFieldsCard,
  FilesCard,
  ChangelogCard,
  GlobalErrorBanner,
} from './components/PromptFormSections';

// Mirrors BE cap (CreatePromptPackageDto.prompt_content @MaxLength(50000)).
const PROMPT_CONTENT_MAX = 50000;

type Mode = 'new' | 'edit';
interface FormErrors { name?: string; shortDesc?: string; category?: string; promptContent?: string; global?: string }
type LoadState = 'loading' | 'ready' | 'forbidden' | 'pending' | 'error';

const PromptForm: React.FC<{ mode: Mode }> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const packageId = Number(id);

  const [name, setName] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [promptContent, setPromptContent] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [changelogNote, setChangelogNote] = useState('');
  const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>(mode === 'edit' ? 'loading' : 'ready');

  // Edit mode: load the package, guard permission + pending, prefill metadata + prompt text.
  useEffect(() => {
    if (mode !== 'edit') return;
    if (!id || Number.isNaN(packageId)) { setLoadState('error'); return; }
    let cancelled = false;
    setLoadState('loading');
    fetchDetail(packageId)
      .then((data) => {
        if (cancelled) return;
        if (!data.isUpdate) { setLoadState('forbidden'); return; }
        if (data.hasPendingVersion) { setLoadState('pending'); return; }
        const rep = data.active_version ?? data.versions[0] ?? null;
        if (rep) {
          setName(rep.name);
          setShortDesc(rep.short_description);
          setCategory(rep.category);
          setTags(rep.tags ?? []);
          setExistingAvatarUrl(rep.avatar_url ?? null);
          setPromptContent(rep.prompt_content ?? '');
        }
        setLoadState('ready');
      })
      .catch(() => { if (!cancelled) setLoadState('error'); });
    return () => { cancelled = true; };
  }, [mode, id, packageId]);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = 'Tên là bắt buộc';
    if (!shortDesc.trim()) errs.shortDesc = 'Mô tả ngắn là bắt buộc';
    if (!category) errs.category = 'Category là bắt buộc';
    if (!promptContent.trim()) errs.promptContent = 'Vui lòng nhập nội dung prompt';
    else if (promptContent.length > PROMPT_CONTENT_MAX) errs.promptContent = `Prompt tối đa ${PROMPT_CONTENT_MAX.toLocaleString()} ký tự`;
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
        // Only the avatar (if any) goes through Strapi; the prompt text is sent inline.
        const avatar_url = avatar
          ? await uploadFileToStrapi(avatar)
          : mode === 'edit' ? existingAvatarUrl ?? undefined : undefined;

        const payload = {
          prompt_content: promptContent,
          avatar_url,
          name: name.trim(),
          short_description: shortDesc.trim(),
          category,
          tags,
        };

        if (mode === 'edit') {
          await uploadUpdate(packageId, { ...payload, changelog_note: changelogNote.trim() || undefined });
          navigate(`/asset-hub/prompt/${packageId}`);
        } else {
          const res = await uploadNew(payload);
          navigate(`/asset-hub/prompt/${res.package.id}`);
        }
      } catch (err: unknown) {
        const axErr = err as { response?: { status: number; data?: { message?: string } } };
        const status = axErr?.response?.status ?? 0;
        const msg = axErr?.response?.data?.message;
        const global = status === 403
          ? 'Quyền đã thay đổi, bạn không còn quyền chỉnh sửa prompt này.'
          : mapUploadError(status, typeof msg === 'string' ? msg : undefined);
        setErrors({ global });
        setSubmitting(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, packageId, name, shortDesc, category, tags, promptContent, avatar, changelogNote, existingAvatarUrl],
  );

  if (loadState !== 'ready') {
    return (
      <div className="flex h-full flex-col">
        <FormHeader mode={mode} />
        <NotReadyScreen loadState={loadState} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex h-full flex-col">
      <div className="mb-6 flex items-start justify-between gap-4">
        <FormHeader mode={mode} className="" />
        <SubmitButton mode={mode} submitting={submitting} />
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2">
        <MainFieldsCard
          name={name} setName={setName}
          shortDesc={shortDesc} setShortDesc={setShortDesc}
          category={category} setCategory={setCategory}
          tags={tags} setTags={setTags}
          errors={errors}
        />

        <FilesCard
          promptContent={promptContent} setPromptContent={setPromptContent}
          avatar={avatar} setAvatar={setAvatar}
          existingAvatarUrl={existingAvatarUrl}
          promptContentError={errors.promptContent}
          maxLength={PROMPT_CONTENT_MAX}
        />

        <AnimatePresence>
          {mode === 'edit' && (
            <ChangelogCard value={changelogNote} onChange={setChangelogNote} />
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {errors.global && <GlobalErrorBanner message={errors.global} />}
        </AnimatePresence>
      </div>
    </form>
  );
};

export default PromptForm;
