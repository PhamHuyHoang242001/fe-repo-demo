// RejectModal — local modal (no legacy import) for rejecting a pending version.
// Requires a non-empty reason; disables submit until satisfied.
// Maps 400 (empty reason — BE validation bypass) and 403 inline.
// Tailwind-only; ah-* tokens only.

import React, { useState, useRef, useEffect } from 'react';
import { reject } from '../api/skillApi';

interface RejectModalProps {
  versionId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const RejectModal: React.FC<RejectModalProps> = ({ versionId, onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea when modal opens
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const trimmed = reason.trim();
  const canSubmit = trimmed.length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await reject(versionId, trimmed);
      onSuccess();
    } catch (err: unknown) {
      const axErr = err as { response?: { status: number; data?: { message?: string } } };
      const status = axErr?.response?.status ?? 0;
      if (status === 403) {
        setError('Bạn không có quyền từ chối phiên bản này.');
      } else if (status === 400) {
        setError('Lý do từ chối không được để trống.');
      } else {
        setError(
          axErr?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ah-ink/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-xl border border-ah-line bg-ah-card shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ah-line px-5 py-4">
          <h2 className="text-base font-bold text-ah-ink">Từ chối phiên bản</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-ah-muted hover:bg-ah-pale hover:text-ah-ink transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-3">
          <p className="text-sm text-ah-muted">
            Nhập lý do từ chối để người upload có thể cải thiện phiên bản tiếp theo.
          </p>
          <textarea
            ref={textareaRef}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Lý do từ chối (bắt buộc)…"
            className="w-full resize-none rounded-lg border border-ah-line px-3 py-2 text-sm text-ah-ink outline-none transition-colors focus:border-ah-green placeholder:text-ah-muted"
          />
          {error && (
            <div className="rounded-lg border border-ah-red bg-ah-red-l px-3 py-2 text-sm text-ah-red">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-ah-line px-5 py-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-ah-line px-4 py-2 text-sm font-semibold text-ah-ink hover:bg-ah-pale transition-colors disabled:opacity-50"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex items-center gap-2 rounded-lg bg-ah-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting && (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {submitting ? 'Đang gửi…' : 'Từ chối'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
