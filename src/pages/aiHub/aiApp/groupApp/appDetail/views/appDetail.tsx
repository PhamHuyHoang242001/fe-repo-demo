import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UploadFile from '../components/UploadFile';
import { generateAiApp, uploadFile } from '../api';
import { notification } from 'antd';
import { AxiosProgressEvent } from 'axios';
import ExtractPage from '../components/ExtractPage';
import { useParams } from 'react-router';
import ModalUpload from 'components/modalUpload/ModalUpload';
import { APP_CONFIG } from 'utils/env';
// import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const Dashboard: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { document_id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [tab, setTab] = useState<number>(1);
  const [sizeFile, setSizeFile] = useState('');
  const [urlFile, setUrlFile] = useState('');
  const [nameFile, setNameFile] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setUrlFile('');
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handelClose = () => {
    setNameFile('');
  };

  const handleFile = async (file?: File) => {
    file && setSizeFile((file.size / 1024 / 1024).toFixed(2));
    file && setNameFile(file.name);
    setUploadProgress(0);
    setIsUploading(true);
    if (loading) return;
    const maxFileSize = 200 * 1024 * 1024;
    try {
      if (file) {
        if (file.size > maxFileSize) {
          notification.warning({
            message: 'Warning',
            description: 'File size exceeds the 200MB limit. Please upload a smaller file.',
          });
          return;
        }
        const formData = new FormData();
        if (file) formData.append('files', file as File);
        const res = await uploadFile(formData, (progressEvent: AxiosProgressEvent) => {
          const totalLength = progressEvent.total;
          if (totalLength !== undefined) {
            const progress = Math.round((progressEvent.loaded * 100) / totalLength);
            setUploadProgress(progress);
          }
        });
        setUrlFile(res[0].url);
      }
    } catch (error) {
    } finally {
      setIsUploading(false);
    }
  };
  const handelExtract = () => {
    setLoading(true);
    generateAiApp(document_id, APP_CONFIG.imageMediaUrl + urlFile)
      .then((res) => {
        const data = res;
        if (data) {
          for (const table in data?.tables_extracted) {
            const dataSourceWithEmptyColumn = data?.tables_extracted[table]?.data_rows.map((row: any) => ({
              ...row,
              _emptyColumn: row[''],
            }));
            if (data?.tables_extracted && data.tables_extracted[table]) {
              data.tables_extracted[table].data_rows = dataSourceWithEmptyColumn;
            }
          }
          setGeneratedData(data);
          setTab(2);
          // setNameFile('');
          // setSizeFile('0');
          // setUploadProgress(0);
          // setSizeFile('');
          // setUrlFile('');
          handleCancel();
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {tab === 1 ? (
        <UploadFile
          handleFile={handleFile}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
          loading={loading}
          sizeFile={sizeFile}
          nameFile={nameFile}
          urlFile={urlFile}
          handelClose={handelClose}
          handelExtract={handelExtract}
        />
      ) : (
        <ExtractPage generatedData={generatedData} showModal={showModal} />
      )}
      <ModalUpload
        handleFile={handleFile}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        uploadProgress={uploadProgress}
        isUploading={isUploading}
        loading={loading}
        sizeFile={sizeFile}
        nameFile={nameFile}
        urlFile={urlFile}
        handelClose={handelClose}
        handelExtract={handelExtract}
      />
    </div>
  );
};

export default Dashboard;
