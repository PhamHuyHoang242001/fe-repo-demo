// RejectModal — animated modal for rejecting a pending version.
// Visual redesign: AnimatePresence scaleIn backdrop + card, antd Input.TextArea,
// danger-styled confirm button. Logic (reason state, submit, error mapping) UNCHANGED.
// Tailwind + ah-* tokens + framer-motion only. No antd Modal (keeps full control of motion).

import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { scaleIn, fadeIn, springSoft } from '../../../theme/motion';
import { reject } from '../api/promptApi';

interface RejectModalProps {
  versionId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const CloseIcon: React.FC = () => (
  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd" />
  </svg>
);

const RejectModal: React.FC<RejectModalProps> = ({ versionId, onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setError(axErr?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Animated backdrop
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ah-ink/50 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal card — scaleIn */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="show"
        exit="exit"
        className="w-full max-w-md rounded-2xl border border-ah-line bg-ah-card shadow-ah-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ah-line px-6 py-4">
          <div className="flex items-center gap-2.5">
            {/* Danger indicator dot */}
            <span className="h-2.5 w-2.5 rounded-full bg-ah-red" />
            <h2 className="text-base font-extrabold tracking-tight text-ah-ink">Từ chối phiên bản</h2>
          </div>
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.93 }}
            transition={springSoft}
            className="rounded-lg p-1.5 text-ah-muted transition-colors hover:bg-ah-pale hover:text-ah-ink"
          >
            <CloseIcon />
          </motion.button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-6 py-5">
          <p className="text-sm text-ah-muted leading-relaxed">
            Nhập lý do từ chối để người upload có thể cải thiện phiên bản tiếp theo.
          </p>

          {/* antd TextArea — themed via ConfigProvider */}
          <Input.TextArea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            autoSize={{ minRows: 4, maxRows: 8 }}
            placeholder="Lý do từ chối (bắt buộc)…"
            status={error ? 'error' : undefined}
            size="large"
          />

          <AnimatePresence initial={false}>
            {error && (
              <motion.div
                key="err"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="rounded-xl border border-ah-red bg-ah-red-l px-4 py-3 text-sm text-ah-red"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 border-t border-ah-line px-6 py-4">
          <motion.button
            type="button"
            onClick={onClose}
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={springSoft}
            className="rounded-xl border border-ah-line px-5 py-2 text-sm font-semibold text-ah-ink transition-colors hover:bg-ah-pale disabled:opacity-50"
          >
            Huỷ
          </motion.button>

          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            whileHover={canSubmit ? { scale: 1.03 } : {}}
            whileTap={canSubmit ? { scale: 0.96 } : {}}
            transition={springSoft}
            className="flex items-center gap-2 rounded-xl bg-ah-red px-5 py-2 text-sm font-bold text-white shadow-ah-float transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting && (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {submitting ? 'Đang gửi…' : 'Từ chối'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RejectModal;
