// Form state for the asset-hub metadata every write carries: publishing unit, people in charge,
// usage guide and catalog tags. Shared by the Skill and Prompt forms — the backend contract is
// identical for both, so the state, the prefill and the validation rules are too.

import { useCallback, useState } from 'react';
import type { PublisherRef, ResponsibleUser, TagRef } from '../types/catalog';
import { isUsageGuideEmpty } from '../components/UsageGuideEditor';

export interface ItemMetaErrors {
  publisher?: string;
  responsibles?: string;
  guide?: string;
}

/** The package-level slice of a detail response this hook prefills from. */
interface PackageMetaSource {
  publisher?: PublisherRef | null;
  publisher_id?: number;
  responsible_users?: ResponsibleUser[];
}

/** The version-level slice of a detail response this hook prefills from. */
interface VersionMetaSource {
  tags?: TagRef[];
  usage_guide_html?: string;
}

/** Exactly the metadata fields the create/update payloads carry. */
export interface ItemMetaPayload {
  publisher_id: number;
  responsible_user_ids: number[];
  usage_guide_html: string;
  tag_ids: number[];
}

export function useItemMetaFields() {
  const [publisherId, setPublisherId] = useState<number | null>(null);
  const [selectedPublisher, setSelectedPublisher] = useState<PublisherRef | null>(null);
  const [responsibleIds, setResponsibleIds] = useState<number[]>([]);
  const [selectedResponsibles, setSelectedResponsibles] = useState<ResponsibleUser[]>([]);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagRef[]>([]);
  const [usageGuideHtml, setUsageGuideHtml] = useState('');

  // Edit mode: the single submit re-sends every field, so anything not prefilled here would be
  // blanked on save. Publisher and people in charge come from the package, guide and tags from
  // the representative version.
  const prefill = useCallback((pkg: PackageMetaSource, version: VersionMetaSource | null) => {
    setSelectedPublisher(pkg.publisher ?? null);
    setPublisherId(pkg.publisher?.id ?? pkg.publisher_id ?? null);

    const pics = pkg.responsible_users ?? [];
    setSelectedResponsibles(pics);
    setResponsibleIds(pics.map((u) => u.id));

    const tags = version?.tags ?? [];
    setSelectedTags(tags);
    setTagIds(tags.map((t) => t.id));
    setUsageGuideHtml(version?.usage_guide_html ?? '');
  }, []);

  // Mirrors the backend rules: publisher and at least one person in charge are always required;
  // the guide is required on create but may stay empty on an update, so artifacts that predate
  // guides remain editable.
  const validate = useCallback(
    (mode: 'new' | 'edit'): ItemMetaErrors => {
      const errs: ItemMetaErrors = {};
      if (publisherId == null) errs.publisher = 'Đơn vị phát hành là bắt buộc';
      if (!responsibleIds.length) errs.responsibles = 'Cần ít nhất một người chịu trách nhiệm';
      if (mode === 'new' && isUsageGuideEmpty(usageGuideHtml)) errs.guide = 'Hướng dẫn sử dụng là bắt buộc';
      return errs;
    },
    [publisherId, responsibleIds, usageGuideHtml],
  );

  // Only call after validate() passed — publisherId is non-null by then.
  const toPayload = useCallback(
    (): ItemMetaPayload => ({
      publisher_id: publisherId as number,
      responsible_user_ids: responsibleIds,
      usage_guide_html: usageGuideHtml,
      tag_ids: tagIds,
    }),
    [publisherId, responsibleIds, usageGuideHtml, tagIds],
  );

  return {
    publisherId, setPublisherId, selectedPublisher,
    responsibleIds, setResponsibleIds, selectedResponsibles,
    tagIds, setTagIds, selectedTags,
    usageGuideHtml, setUsageGuideHtml,
    prefill, validate, toPayload,
  };
}
