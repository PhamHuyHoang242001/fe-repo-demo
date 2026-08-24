// SKILL.md tab body: ZIP tree (when stored) then sanitized markdown.
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import type { ZipTreeNode } from '../types';
import ZipTreeView from './ZipTreeView';

const MD_CLASS =
  'max-w-none text-sm leading-relaxed text-ah-ink [&_a]:font-medium [&_a]:text-ah-green [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:my-3 [&_blockquote]:rounded-r-md [&_blockquote]:border-l-[3px] [&_blockquote]:border-ah-green [&_blockquote]:bg-ah-green-l/40 [&_blockquote]:py-1 [&_blockquote]:pl-4 [&_blockquote]:text-ah-muted [&_code:not(.hljs)]:rounded [&_code:not(.hljs)]:border [&_code:not(.hljs)]:border-ah-green/20 [&_code:not(.hljs)]:bg-ah-green-l [&_code:not(.hljs)]:px-1.5 [&_code:not(.hljs)]:py-0.5 [&_code:not(.hljs)]:text-[0.85em] [&_code:not(.hljs)]:font-semibold [&_code:not(.hljs)]:text-ah-green-d [&_h1]:mb-3 [&_h1]:mt-5 [&_h1]:border-b [&_h1]:border-ah-line [&_h1]:pb-2 [&_h1]:text-lg [&_h1]:font-extrabold [&_h1]:text-ah-green-d [&_h2]:mb-2.5 [&_h2]:mt-6 [&_h2]:border-b [&_h2]:border-ah-line [&_h2]:pb-1.5 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-ah-green-d [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-bold [&_h3]:text-ah-ink [&_hr]:my-5 [&_hr]:border-ah-line [&_img]:rounded-lg [&_li]:my-1 [&_li]:marker:text-ah-green [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_pre]:my-4 [&_pre]:overflow-hidden [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-ah-ink/15 [&_pre]:shadow-ah-float [&_strong]:font-bold [&_strong]:text-ah-ink [&_table]:my-3 [&_table]:w-full [&_td]:border [&_td]:border-ah-line [&_td]:px-3 [&_td]:py-1.5 [&_th]:border [&_th]:border-ah-line [&_th]:bg-ah-pale [&_th]:px-3 [&_th]:py-1.5 [&_th]:text-ah-ink [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5';

interface SkillMdPreviewProps {
  zipTree: ZipTreeNode[] | null | undefined;
  safeMd: string;
}

const SkillMdPreview: React.FC<SkillMdPreviewProps> = ({ zipTree, safeMd }) => (
  <div className="flex flex-col gap-4">
    {zipTree && zipTree.length > 0 ? (
      <ZipTreeView nodes={zipTree} />
    ) : (
      <div className="rounded-xl border border-dashed border-ah-line bg-ah-pale px-4 py-3 text-sm text-ah-muted">
        Cấu trúc thư mục chưa có (skill đăng trước khi có tính năng này). Tải .zip để xem.
      </div>
    )}
    <div className="border-t border-ah-line pt-4">
      {safeMd ? (
        <div className={MD_CLASS}>
          <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}>
            {safeMd}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-ah-line bg-ah-pale px-5 py-4 text-sm text-ah-muted">
          Chưa có nội dung skill.md.
        </div>
      )}
    </div>
  </div>
);

export default SkillMdPreview;
