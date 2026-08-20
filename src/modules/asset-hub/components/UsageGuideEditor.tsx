// Rich-text editor for the usage guide ("Hướng dẫn sử dụng"), built on TipTap.
//
// Images: a pasted, dropped or picked image is uploaded to Strapi FIRST and only its returned URL
// is inserted. Data-URIs are rejected outright — the backend sanitizer drops any img whose src is
// not the configured Strapi origin, so embedding bytes inline would silently lose the image.
//
// The value is HTML. The backend sanitizes it again on write; this editor only limits what can be
// produced, it is not the security boundary.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import UsageGuideToolbar from './UsageGuideToolbar';
import '../theme/usage-guide.css';

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

interface UsageGuideEditorProps {
  value: string;
  onChange: (html: string) => void;
  /** Uploads a file and resolves to its absolute Strapi URL (the workspace's own uploader). */
  uploadImage: (file: File) => Promise<string>;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

/** True when the HTML carries neither visible text nor an image — mirrors the backend rule. */
export function isUsageGuideEmpty(html: string): boolean {
  if (!html) return true;
  if (/<img\b/i.test(html)) return false;
  const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ');
  return text.trim().length === 0;
}

const UsageGuideEditor: React.FC<UsageGuideEditorProps> = ({
  value,
  onChange,
  uploadImage,
  placeholder = 'Viết hướng dẫn sử dụng… (có thể dán ảnh/GIF trực tiếp)',
  disabled,
  error,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: false, allowBase64: false })],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  // Insert an image by uploading it first; only the resulting URL reaches the document.
  const insertImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setUploadError('Chỉ hỗ trợ ảnh PNG, JPEG, GIF hoặc WEBP.');
        return;
      }
      setUploading(true);
      setUploadError(null);
      try {
        const src = await uploadImage(file);
        editor.chain().focus().setImage({ src, alt: file.name }).run();
      } catch {
        setUploadError('Tải ảnh lên thất bại. Vui lòng thử lại.');
      } finally {
        setUploading(false);
      }
    },
    [editor, uploadImage],
  );

  // Paste / drop of image files is intercepted before ProseMirror can inline them as data-URIs.
  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom;

    const filesFrom = (list: FileList | null | undefined): File[] =>
      Array.from(list ?? []).filter((f) => f.type.startsWith('image/'));

    const onPaste = (e: ClipboardEvent) => {
      const files = filesFrom(e.clipboardData?.files);
      if (!files.length) return;
      e.preventDefault();
      void insertImage(files[0]);
    };

    const onDrop = (e: DragEvent) => {
      const files = filesFrom(e.dataTransfer?.files);
      if (!files.length) return;
      e.preventDefault();
      void insertImage(files[0]);
    };

    dom.addEventListener('paste', onPaste);
    dom.addEventListener('drop', onDrop);
    return () => {
      dom.removeEventListener('paste', onPaste);
      dom.removeEventListener('drop', onDrop);
    };
  }, [editor, insertImage]);

  // Adopt an externally-loaded value (edit mode prefill) without clobbering in-progress typing.
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) editor.commands.setContent(value || '', { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) return null;

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white transition-colors ${
        error ? 'border-ah-red' : 'border-ah-line focus-within:border-ah-green'
      }`}
    >
      <UsageGuideToolbar
        editor={editor}
        disabled={disabled}
        uploading={uploading}
        onPickImage={() => fileInputRef.current?.click()}
      />

      <EditorContent
        editor={editor}
        className="ah-usage-guide max-h-[520px] min-h-[220px] overflow-y-auto px-4 py-3 text-sm text-ah-ink"
        data-placeholder={placeholder}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void insertImage(file);
          e.target.value = '';
        }}
      />

      {uploadError && <p className="border-t border-ah-line px-4 py-2 text-xs text-ah-red">{uploadError}</p>}
    </div>
  );
};

export default UsageGuideEditor;
