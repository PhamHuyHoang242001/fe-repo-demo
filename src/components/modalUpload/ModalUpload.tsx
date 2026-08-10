import { Modal, Progress, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import uploadFileIcon from 'assets/icons/upload_file_icon.svg';
import filePdfIcon from 'assets/icons/file_pdf_icon.svg';
import iconExtractNow from 'assets/icons/icon_extract_now.svg';
import iconClose from 'assets/icons/icon_close.svg';
import iconCheckSuccess from 'assets/icons/icon_check_success.svg';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface modalDetailProp {
  isModalOpen: boolean;
  handleCancel: () => void;
  handleFile: (value?: File) => void;
  handelClose: () => void;
  handelExtract: () => void;
  uploadProgress: number;
  isUploading: boolean;
  loading: boolean;
  sizeFile: string;
  nameFile: string;
  urlFile: string;
}
const ModalUpload = ({
  handelClose,
  handelExtract,
  uploadProgress,
  isUploading,
  loading,
  sizeFile,
  nameFile,
  isModalOpen,
  handleCancel,
  handleFile,
  urlFile,
}: modalDetailProp) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const handleUploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFile(file);
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    handleFile(file);
  };

  return (
    <Modal open={isModalOpen} onCancel={handleCancel} width={'550px'} footer={null} className="modal-detail-propensity">
      <div className="p-6">
        <div className="text-[#0B0B0B] text-[18px] font-bold">{t('ai_app.txt_file_upload')}</div>
        <div className="text-[#6D6D6D] text-sm font-normal mb-4">{t('ai_app.txt_instruct')}</div>
        <div
          style={{
            border: '1px dashed #1849D6',
            backgroundColor: isDragging ? '#D9D9D9' : '#FFFFFF',
          }}
          className="rounded-md p-6 flex flex-col items-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <img src={uploadFileIcon} alt="upload" width={'36px'} height={'36px'} />
          <div className="text-sm text-[#0B0B0B] font-normal mt-3">
            {t('ai_app.txt_drag_drop')}
            <span className="text-sm text-[#1849D6] font-semibold cursor-pointer ml-2 ">
              <input
                type="file"
                name="upload"
                onChange={handleUploadImage}
                multiple={false}
                id="upload"
                className="hidden"
                accept=".pdf"
              />
              <label htmlFor="upload" className="cursor-pointer">
                {t('ai_app.txt_browse')}
              </label>
            </span>
          </div>
          <div className="text-[#6D6D6D] text-sm font-normal mt-2">{t('ai_app.txt_max_size')}</div>
        </div>
        <div className="text-[#6D6D6D] text-sm font-normal mt-4">{t('ai_app.txt_support')}</div>
        {nameFile && (
          <div
            className="flex flex-col rounded-lg bg-white w-full mt-4"
            style={{
              height: isUploading ? '92px' : '68px',
              border: '1px solid var(--strokeColor-lightGrey, #E7E7E7)',
            }}
          >
            <div className="flex flex-row gap-2 p-4  ">
              {' '}
              <img src={filePdfIcon} alt="file-pdf-icon" width={'36px'} height={'36px'} />
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col">
                  <div className="text-xs text-[#0B0B0B] font-semibold">{nameFile}</div>
                  {sizeFile === '0' ? (
                    <div className="text-xs text-[#E20001] font-normal mt-1">{t('ai_app.txt_err_file')}</div>
                  ) : (
                    <div className="text-xs text-[#6D6D6D] font-normal mt-1">{sizeFile + t('ai_app.txt_unit')}</div>
                  )}
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <img
                    src={iconClose}
                    alt="icon-close"
                    className="cursor-pointer"
                    onClick={handelClose}
                    width={'25px'}
                    height={'25px'}
                  />
                  {sizeFile !== '0' && (
                    <img src={iconCheckSuccess} alt="icon-check-success" width={'20px'} height={'20px'} />
                  )}
                </div>
              </div>
            </div>
            {isUploading && (
              <div className=" w-full">
                <Progress percent={uploadProgress} />
              </div>
            )}
          </div>
        )}
        <div
          className={twMerge(
            'w-[148px] h-12 rounded-[20px] flex flex-row gap-2 justify-center items-center mt-4 mx-auto bg-[#CACCCF]',
            !loading && 'cursor-pointer',
            (!nameFile || !urlFile) && 'cursor-not-allowed',
            uploadProgress && uploadProgress === 100 && nameFile && urlFile && 'bg-[#2563EB]',
          )}
          onClick={() => {
            if (!loading && nameFile && urlFile) {
              handelExtract();
            }
          }}
        >
          {loading ? (
            <Spin className="custom-spin" />
          ) : (
            <img src={iconExtractNow} alt="icon-extract-now" width={'22px'} height={'22px'} />
          )}

          <span className="text-xs text-white font-medium">
            {loading ? t('ai_app.txt_generating') : t('ai_app.txt_extract')}
          </span>
        </div>
      </div>
    </Modal>
  );
};
export default ModalUpload;
