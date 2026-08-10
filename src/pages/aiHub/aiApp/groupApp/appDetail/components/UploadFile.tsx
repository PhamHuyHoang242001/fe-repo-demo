import { Progress, Spin } from 'antd';
import uploadFileIcon from 'assets/icons/upload_file_icon.svg';
import filePdfIcon from 'assets/icons/file_pdf_icon.svg';
import iconClose from 'assets/icons/icon_close.svg';
import iconCheckSuccess from 'assets/icons/icon_check_success.svg';
import iconExtractNow from 'assets/icons/icon_extract_now.svg';
import logoVpBank from 'assets/images/logo_vpbank_img.png';
import iconDownload from 'assets/icons/icon_download_ex.svg';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../types/appDetail.scss';
import { twMerge } from 'tailwind-merge';
import { downloadExFile } from '../api';

interface AIModelItemProps {
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

const UploadFile = ({
  handleFile,
  handelClose,
  handelExtract,
  uploadProgress,
  isUploading,
  loading,
  sizeFile,
  nameFile,
  urlFile,
}: AIModelItemProps) => {
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
    <div className="p-8">
      <div className="flex flex-row justify-between items-center ">
        <img src={logoVpBank} alt="logo" />
        <div
          onClick={downloadExFile}
          className="flex flex-row gap-4 h-9 w-[164px] bg-white rounded-lg cursor-pointer justify-center items-center"
        >
          <img src={iconDownload} alt="download" width={'16px'} height={'16px'} />
          <span>Sample file</span>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-[50px] font-extrabold color-primary">{t('ai_app.txt_ir_finance')}</div>
        <div className="text-[26px] font-normal text-[#475569] mt-3">{t('ai_app.txt_data_extraction')}</div>
      </div>
      <div
        style={{ backgroundColor: isDragging ? '#D9D9D9' : '#FAFAFA' }}
        className="py-9 flex items-center mt-2 mx-24 flex-col"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <img src={uploadFileIcon} alt="upload" width={'80px'} height={'80px'} />
        <div className="text-2xl text-[#0B0B0B] font-normal mt-4">
          {t('ai_app.txt_drag_drop')}
          <span className="text-2xl text-[#1849D6] font-semibold cursor-pointer ml-2 ">
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
        <div className="text-[16px] text-[#A3A3A3] font-normal mt-2"> {t('ai_app.txt_pdf_less')}</div>
      </div>
      {nameFile && (
        <div>
          <div
            className="flex flex-col mx-32 rounded-lg bg-white"
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
          {uploadProgress && uploadProgress === 100 && urlFile && (
            <div
              className={twMerge(
                'w-[148px] h-12 bg-[#2563EB] rounded-[20px] p-3 flex flex-row gap-2 justify-center items-center mt-10 mx-auto ',
                !loading && 'cursor-pointer',
              )}
              onClick={() => {
                if (!loading) {
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
          )}
        </div>
      )}
    </div>
  );
};

export default UploadFile;
