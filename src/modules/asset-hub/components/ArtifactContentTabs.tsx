// Two-pane content switch shared by every surface that shows an artifact's body:
// "Hướng dẫn" (the authored usage guide) and "Nội dung" (the raw artifact — skill.md, the prompt
// text, or a review diff).
//
// The guide is the DEFAULT tab: it is what a reader needs first, while the raw artifact is what a
// reviewer or an implementer opens second.

import React, { useState } from 'react';
import { Tabs } from 'antd';
import UsageGuideViewer from './UsageGuideViewer';

export type ArtifactTabKey = 'guide' | 'preview';

interface ArtifactContentTabsProps {
  /** Sanitized guide HTML from the API. Absent on list surfaces — only detail responses carry it. */
  guideHtml: string | null | undefined;
  /** The raw-artifact pane; rendered as-is so each caller keeps its own markdown/diff treatment. */
  preview: React.ReactNode;
  previewLabel?: string;
  guideLabel?: string;
  className?: string;
  /** Override the initial tab (e.g. a review screen that should open on the diff). */
  defaultTab?: ArtifactTabKey;
}

const ArtifactContentTabs: React.FC<ArtifactContentTabsProps> = ({
  guideHtml,
  preview,
  previewLabel = 'Nội dung',
  guideLabel = 'Hướng dẫn',
  className = '',
  defaultTab = 'guide',
}) => {
  const [active, setActive] = useState<ArtifactTabKey>(defaultTab);

  return (
    <div className={`overflow-hidden rounded-2xl border border-ah-line bg-ah-card shadow-ah-float ${className}`}>
      <div className="border-b border-ah-line bg-gradient-to-r from-ah-green-l via-ah-pale to-ah-card px-4 pt-2">
        <Tabs
          size="small"
          activeKey={active}
          onChange={(k) => setActive(k as ArtifactTabKey)}
          items={[
            { key: 'guide', label: guideLabel },
            { key: 'preview', label: previewLabel },
          ]}
          // The panes render below rather than inside, so switching never remounts the preview
          // (a diff or a highlighted markdown block is expensive to rebuild).
          renderTabBar={(props, DefaultTabBar) => <DefaultTabBar {...props} className="!mb-0" />}
        />
      </div>

      <div className="px-5 py-4">
        {/* Both panes stay mounted; only visibility flips, so scroll position survives a switch. */}
        <div className={active === 'guide' ? '' : 'hidden'}>
          <UsageGuideViewer html={guideHtml} />
        </div>
        <div className={active === 'preview' ? '' : 'hidden'}>{preview}</div>
      </div>
    </div>
  );
};

export default ArtifactContentTabs;
