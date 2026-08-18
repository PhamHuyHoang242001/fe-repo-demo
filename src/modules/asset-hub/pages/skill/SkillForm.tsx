// SkillForm — route page for both New upload (/skill/upload) and Edit (/skill/:id/edit).
// Visual redesign: antd controls, stagger sections, animated error/submit.
// Extracted sub-components → SkillFormSections.tsx.
// Form logic, controlled state, validation, submit handler, and API calls are UNCHANGED.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { uploadNew, uploadUpdate, uploadFileToStrapi, detail as fetchDetail } from './api/skillApi';
import { mapUploadError } from './components/UploadFormHelpers';
import type { SkillCategory } from './types';
import { resolveCategoryId } from '../../utils/category';
import {
  FormHeader,
  SubmitButton,
  NotReadyScreen,
  MainFieldsCard,
  FilesCard,
  ChangelogCard,
  GlobalErrorBanner,
} from './components/SkillFormSections';

type Mode = 'new' | 'edit';
interface FormErrors { name?: string; shortDesc?: string; category?: string; zip?: string; global?: string }
type LoadState = 'loading' | 'ready' | 'forbidden' | 'pending' | 'error';

const SkillForm: React.FC<{ mode: Mode }> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const packageId = Number(id);

  const [name, setName] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [zip, setZip] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [changelogNote, setChangelogNote] = useState('');
  const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null);
  const [currentZipName, setCurrentZipName] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>(mode === 'edit' ? 'loading' : 'ready');

  // Edit mode: load the package, guard permission + pending, prefill metadata.
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
          setCategoryId(rep.category_id ?? resolveCategoryId(rep.category_detail ?? rep.category));
          setSelectedCategory(rep.category_detail ?? rep.category ?? null);
          setTags(rep.tags ?? []);
          setExistingAvatarUrl(rep.avatar_url ?? null);
          setCurrentZipName(rep.file?.name ?? null);
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
    if (categoryId == null) errs.category = 'Category là bắt buộc';
    if (!zip) errs.zip = 'Vui lòng chọn file .zip';
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
        const zipUrl = await uploadFileToStrapi(zip!);
        const avatar_url = avatar
          ? await uploadFileToStrapi(avatar)
          : mode === 'edit' ? existingAvatarUrl ?? undefined : undefined;

        const payload = {
          file: { fileUrl: zipUrl, name: zip!.name, type: zip!.type || undefined },
          avatar_url,
          name: name.trim(),
          short_description: shortDesc.trim(),
          category_id: categoryId!,
          tags,
        };

        if (mode === 'edit') {
          await uploadUpdate(packageId, { ...payload, changelog_note: changelogNote.trim() || undefined });
          navigate(`/asset-hub/skill/${packageId}`);
        } else {
          const res = await uploadNew(payload);
          navigate(`/asset-hub/skill/${res.package.id}`);
        }
      } catch (err: unknown) {
        const axErr = err as { response?: { status: number; data?: { message?: string } } };
        const status = axErr?.response?.status ?? 0;
        const msg = axErr?.response?.data?.message;
        const global = status === 403
          ? 'Quyền đã thay đổi, bạn không còn quyền chỉnh sửa skill này.'
          : mapUploadError(status, typeof msg === 'string' ? msg : undefined);
        setErrors({ global });
        setSubmitting(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, packageId, name, shortDesc, categoryId, tags, zip, avatar, changelogNote, existingAvatarUrl],
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
          categoryId={categoryId} setCategoryId={setCategoryId}
          selectedCategory={selectedCategory}
          tags={tags} setTags={setTags}
          errors={errors}
        />

        <FilesCard
          mode={mode}
          zip={zip} setZip={setZip}
          avatar={avatar} setAvatar={setAvatar}
          existingAvatarUrl={existingAvatarUrl}
          currentZipName={currentZipName}
          zipError={errors.zip}
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

export default SkillForm;
