// Toolbar for UsageGuideEditor. Kept separate so the editor file stays focused on the TipTap
// wiring and the image-upload flow.

import React from 'react';
import type { Editor } from '@tiptap/react';

interface ToolbarButton {
  key: string;
  label: string;
  title: string;
  isActive?: (editor: Editor) => boolean;
  run: (editor: Editor) => void;
}

const BUTTONS: ToolbarButton[] = [
  { key: 'bold', label: 'B', title: 'Đậm', isActive: (e) => e.isActive('bold'), run: (e) => e.chain().focus().toggleBold().run() },
  { key: 'italic', label: 'I', title: 'Nghiêng', isActive: (e) => e.isActive('italic'), run: (e) => e.chain().focus().toggleItalic().run() },
  { key: 'strike', label: 'S', title: 'Gạch ngang', isActive: (e) => e.isActive('strike'), run: (e) => e.chain().focus().toggleStrike().run() },
  { key: 'h2', label: 'H2', title: 'Tiêu đề 2', isActive: (e) => e.isActive('heading', { level: 2 }), run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run() },
  { key: 'h3', label: 'H3', title: 'Tiêu đề 3', isActive: (e) => e.isActive('heading', { level: 3 }), run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run() },
  { key: 'ul', label: '• Danh sách', title: 'Danh sách', isActive: (e) => e.isActive('bulletList'), run: (e) => e.chain().focus().toggleBulletList().run() },
  { key: 'ol', label: '1. Đánh số', title: 'Danh sách đánh số', isActive: (e) => e.isActive('orderedList'), run: (e) => e.chain().focus().toggleOrderedList().run() },
  { key: 'quote', label: '❝', title: 'Trích dẫn', isActive: (e) => e.isActive('blockquote'), run: (e) => e.chain().focus().toggleBlockquote().run() },
  { key: 'code', label: '</>', title: 'Khối mã', isActive: (e) => e.isActive('codeBlock'), run: (e) => e.chain().focus().toggleCodeBlock().run() },
  { key: 'hr', label: '―', title: 'Đường kẻ', run: (e) => e.chain().focus().setHorizontalRule().run() },
];

interface UsageGuideToolbarProps {
  editor: Editor;
  disabled?: boolean;
  uploading?: boolean;
  onPickImage: () => void;
}

const UsageGuideToolbar: React.FC<UsageGuideToolbarProps> = ({ editor, disabled, uploading, onPickImage }) => {
  const baseClass =
    'rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-ah-line bg-ah-green-l/30 px-2 py-1.5">
      {BUTTONS.map((btn) => {
        const active = btn.isActive?.(editor) ?? false;
        return (
          <button
            key={btn.key}
            type="button"
            title={btn.title}
            disabled={disabled}
            // onMouseDown, not onClick: the editor must keep its selection when the button is pressed.
            onMouseDown={(e) => {
              e.preventDefault();
              btn.run(editor);
            }}
            className={`${baseClass} ${active ? 'bg-ah-green text-white' : 'text-ah-ink hover:bg-ah-green-l'}`}
          >
            {btn.label}
          </button>
        );
      })}

      <span className="mx-1 h-4 w-px bg-ah-line" />

      <button
        type="button"
        title="Chèn ảnh"
        disabled={disabled || uploading}
        onMouseDown={(e) => {
          e.preventDefault();
          onPickImage();
        }}
        className={`${baseClass} text-ah-ink hover:bg-ah-green-l`}
      >
        {uploading ? 'Đang tải ảnh…' : '🖼 Ảnh'}
      </button>
    </div>
  );
};

export default UsageGuideToolbar;
