import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { approve, versionDetail } from './api/promptApi';
import type { PromptVersionDetail as Detail } from './types';
import RejectModal from './components/RejectModal';
import VersionDetailContent from './components/VersionDetailContent';
import { ErrorBanner, SpinnerRow, StateBadge } from './components/ReviewShared';
import { SURFACE_GLASS } from '../../theme/surfaces';
import { fadeInUp } from '../../theme/motion';

const PromptVersionDetail: React.FC = () => {
  const { versionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const requestId = useRef(0);
  const id = Number(versionId);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);
  const [showReject, setShowReject] = useState(false);

  const load = useCallback(() => {
    const currentRequest = ++requestId.current;
    if (!Number.isInteger(id) || id <= 0) {
      setError('Mã phiên bản không hợp lệ.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    versionDetail(id)
      .then((value) => {
        if (currentRequest === requestId.current) setDetail(value);
      })
      .catch((err: unknown) => {
        if (currentRequest === requestId.current) {
          const apiError = err as { response?: { data?: { message?: string } } };
          setError(apiError.response?.data?.message || 'Không thể tải phiên bản.');
        }
      })
      .finally(() => {
        if (currentRequest === requestId.current) setLoading(false);
      });
  }, [id]);

  useEffect(load, [load]);

  const goBack = () => {
    const fromList = (location.state as { fromVersionList?: boolean } | null)?.fromVersionList;
    if (fromList) navigate(-1);
    else navigate('/asset-hub/prompt');
  };

  const handleApprove = async () => {
    setApproveError(null);
    setApproving(true);
    try {
      await approve(id);
      load();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setApproveError(apiError.response?.data?.message || 'Không thể duyệt phiên bản.');
    } finally {
      setApproving(false);
    }
  };

  if (loading) return <SpinnerRow label="Đang tải phiên bản…" />;
  if (error || !detail) return <ErrorBanner message={error ?? 'Không tìm thấy phiên bản.'} onBack={goBack} />;

  const { version } = detail;
  const versionLabel =
    version.state === 'pending'
      ? version.old_version == null
        ? 'mới'
        : `v${version.old_version} · chờ duyệt`
      : `v${version.version_no}`;

  return (
    <div className="flex flex-col gap-4 pb-6">
      <motion.header
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ah-muted">
            <Link to="/asset-hub/prompt" className="hover:text-ah-green">
              Prompt
            </Link>{' '}
            › Chi tiết phiên bản
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-ah-green-d">
              {version.name} — {versionLabel}
            </h1>
            <StateBadge state={version.state} />
          </div>
        </div>
        <Button size="large" onClick={goBack}>
          ← Quay lại
        </Button>
      </motion.header>

      {approveError && <ErrorBanner message={approveError} />}
      <VersionDetailContent detail={detail} />

      {detail.can_review && version.state === 'pending' && (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className={`${SURFACE_GLASS} flex gap-3 px-5 py-4`}
        >
          <Button type="primary" size="large" loading={approving} onClick={handleApprove}>
            Duyệt
          </Button>
          <Button danger size="large" disabled={approving} onClick={() => setShowReject(true)}>
            Từ chối
          </Button>
        </motion.div>
      )}

      {showReject && (
        <RejectModal
          versionId={id}
          onClose={() => setShowReject(false)}
          onSuccess={() => {
            setShowReject(false);
            load();
          }}
        />
      )}
    </div>
  );
};

export default PromptVersionDetail;
