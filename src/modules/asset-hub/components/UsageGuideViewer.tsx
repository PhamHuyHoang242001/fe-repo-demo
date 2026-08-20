// Read-only renderer for usage-guide HTML.
//
// The backend already sanitizes on write, but this sanitizes again on render: a stored document
// predates any future tightening of the server rules, and defence in depth is cheap here.
// DOMPurify is the boundary — dangerouslySetInnerHTML is only ever fed its output.

import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import '../theme/usage-guide.css';

const ALLOWED_TAGS = [
  'p', 'h1', 'h2', 'h3', 'strong', 'em', 'u', 's',
  'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'img', 'br', 'hr',
];

const ALLOWED_ATTR = ['href', 'src', 'alt', 'target', 'rel'];

interface UsageGuideViewerProps {
  html: string | null | undefined;
  className?: string;
  emptyText?: string;
}

const UsageGuideViewer: React.FC<UsageGuideViewerProps> = ({
  html,
  className = '',
  emptyText = 'Chưa có hướng dẫn sử dụng.',
}) => {
  const clean = useMemo(() => {
    if (!html) return '';
    return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
  }, [html]);

  // Emptiness is judged after sanitizing: markup that carries neither text nor an image reads as
  // blank to the user, so it should show the empty state rather than an empty box.
  const isEmpty = !clean || (!/<img\b/i.test(clean) && clean.replace(/<[^>]*>/g, '').trim().length === 0);

  if (isEmpty) {
    return (
      <div className={`flex items-center justify-center rounded-xl border border-dashed border-ah-line bg-ah-green-l/20 px-6 py-12 ${className}`}>
        <p className="text-sm text-ah-muted">{emptyText}</p>
      </div>
    );
  }

  return (
    <div
      className={`ah-usage-guide text-sm text-ah-ink ${className}`}
      // Content passed here is DOMPurify output, never raw API data.
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

export default UsageGuideViewer;
