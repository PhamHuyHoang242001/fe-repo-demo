// Detail hero actions: Download .zip + Copy skill.md.
// Rendered on the gradient hero → light-on-dark antd Button styling.
// Download is a native anchor (no fetch); Copy uses async clipboard API with
// a transient check-tick. hoverPress for tactile feedback.

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { SkillFile } from '../types';
import { formatBytes } from '../utils/format';
import { hoverPress } from '../../../theme/motion';

// ---- Icon atoms ---------------------------------------------------------------

const DownloadIcon: React.FC = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
  </svg>
);

const CopyIcon: React.FC = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M8 8V6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2M6 8h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2z" />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
  </svg>
);

// ---- Shared button base (hero-safe: white/translucent on gradient bg) ----------

const BTN_BASE =
  'inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold ' +
  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60';

// ---- Component -----------------------------------------------------------------

interface SkillActionsProps {
  file: SkillFile | null;
  skillMd: string;
}

const SkillActions: React.FC<SkillActionsProps> = ({ file, skillMd }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(skillMd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable in insecure context — silently no-op */
    }
  };

  const sizeLabel = formatBytes(file?.size);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {file ? (
        <motion.a
          href={file.file_url}
          download={file.name ?? undefined}
          {...hoverPress}
          className={`${BTN_BASE} bg-white text-ah-green-d hover:bg-white/90 shadow`}
        >
          <DownloadIcon />
          Tải .zip{sizeLabel ? ` · ${sizeLabel}` : ''}
        </motion.a>
      ) : (
        <span
          className={`${BTN_BASE} cursor-not-allowed bg-white/10 text-white/50`}
          aria-disabled="true"
        >
          <DownloadIcon />
          Chưa có .zip
        </span>
      )}

      <motion.button
        type="button"
        onClick={onCopy}
        disabled={!skillMd}
        {...hoverPress}
        className={`${BTN_BASE} bg-white/15 text-white ring-1 ring-white/25 hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        {copied ? 'Đã copy' : 'Copy skill.md'}
      </motion.button>
    </div>
  );
};

export default SkillActions;
