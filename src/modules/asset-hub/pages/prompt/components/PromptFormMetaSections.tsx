// Asset-hub metadata cards for PromptForm: ownership (publishing unit + people in charge) and the
// usage guide. Split out of PromptFormSections.tsx to keep both files focused and under the size
// budget. State lives in useItemMetaFields; these are presentational.

import React from 'react';
import { motion } from 'framer-motion';
import type { PublisherRef, ResponsibleUser, TagRef } from '../../../types/catalog';
import { Field } from './UploadFormHelpers';
import CatalogTagSelect from '../../../components/CatalogTagSelect';
import PublisherSelect from '../../../components/PublisherSelect';
import ResponsibleUserSelect from '../../../components/ResponsibleUserSelect';
import UsageGuideEditor from '../../../components/UsageGuideEditor';
import { StaggerList, StaggerItem } from './motion-primitives';
import { CARD_BASE } from '../../../theme/surfaces';
import { fadeInUp } from '../../../theme/motion';

// ---- Ownership card (publishing unit + people in charge) -----------------------

interface OwnershipCardProps {
  publisherId: number | null; setPublisherId: (v: number | null) => void;
  selectedPublisher: PublisherRef | null;
  responsibleIds: number[]; setResponsibleIds: (v: number[]) => void;
  selectedResponsibles: ResponsibleUser[];
  errors: { publisher?: string; responsibles?: string };
}

// Both fields are package-scoped and required on every write — an update carries them alongside
// the new version, because there is no separate metadata endpoint.
export const OwnershipCard: React.FC<OwnershipCardProps> = ({
  publisherId, setPublisherId, selectedPublisher,
  responsibleIds, setResponsibleIds, selectedResponsibles, errors,
}) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    animate="show"
    transition={{ delay: 0.04 }}
    className={`${CARD_BASE} flex flex-col gap-5 p-6`}
  >
    <StaggerList className="flex flex-col gap-5">
      <StaggerItem>
        <Field label="Đơn vị phát hành" required error={errors.publisher}>
          <PublisherSelect
            value={publisherId}
            onChange={setPublisherId}
            selectedPublisher={selectedPublisher}
            status={errors.publisher ? 'error' : undefined}
          />
        </Field>
      </StaggerItem>
      <StaggerItem>
        <Field label="Người chịu trách nhiệm" required error={errors.responsibles}>
          <ResponsibleUserSelect
            value={responsibleIds}
            onChange={setResponsibleIds}
            selectedUsers={selectedResponsibles}
            status={errors.responsibles ? 'error' : undefined}
          />
        </Field>
      </StaggerItem>
    </StaggerList>
  </motion.div>
);

// ---- Tag picker (catalog-backed, replaces the old freeform input) ---------------

interface TagFieldProps {
  tagIds: number[];
  setTagIds: (v: number[]) => void;
  selectedTags: TagRef[];
}

export const PromptTagField: React.FC<TagFieldProps> = ({ tagIds, setTagIds, selectedTags }) => (
  <Field label="Tags (tùy chọn)">
    <CatalogTagSelect artifactType="prompt" value={tagIds} onChange={setTagIds} selectedTags={selectedTags} />
  </Field>
);

// ---- Usage guide card ----------------------------------------------------------

interface UsageGuideCardProps {
  mode: 'new' | 'edit';
  value: string;
  onChange: (html: string) => void;
  uploadImage: (file: File) => Promise<string>;
  error?: string;
}

// Required on create, optional on edit: artifacts created before guides existed can be revised
// without forcing their author to write one.
export const UsageGuideCard: React.FC<UsageGuideCardProps> = ({ mode, value, onChange, uploadImage, error }) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    animate="show"
    transition={{ delay: 0.06 }}
    className={`${CARD_BASE} flex flex-col gap-5 p-6`}
  >
    <Field
      label={mode === 'new' ? 'Hướng dẫn sử dụng' : 'Hướng dẫn sử dụng (tùy chọn)'}
      required={mode === 'new'}
      error={error}
    >
      <UsageGuideEditor value={value} onChange={onChange} uploadImage={uploadImage} error={!!error} />
      <p className="mt-1 text-xs text-ah-muted">
        Dán hoặc kéo thả ảnh/GIF trực tiếp vào khung — ảnh sẽ được tải lên trước khi chèn.
      </p>
    </Field>
  </motion.div>
);
