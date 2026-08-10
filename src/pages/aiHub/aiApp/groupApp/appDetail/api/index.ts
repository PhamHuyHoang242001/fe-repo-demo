import { notification } from 'antd';
import axios, { AxiosProgressEvent } from 'axios';
import { APP_CONFIG } from 'utils/env';
import HttpService from 'utils/http';
import { saveAs } from 'file-saver';
import { URL_EXAMPLE_IDE_FILE } from 'utils/constants';

export const uploadFile = (
  body: FormData,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
): Promise<any> => {
  return axios
    .post(APP_CONFIG.apiUrl + '/custom-upload', body, {
      onUploadProgress,
    })
    .then((res) => {
      if (res?.data && res?.status === 200) {
        return res?.data?.data ? res?.data.data : res?.data;
      }
    })
    .catch((err) => {
      notification.error({
        message: 'Error',
        description: 'Failed to upload!',
      });
    });
};

export const generateAiApp = (aiAppId: string | undefined, url: string): Promise<any> => {
  return HttpService.post(`/ai-app/${aiAppId}/generate`, { url: url }, { timeout: 180000 });
};

export const downloadExFile = (): Promise<any> => {
  return axios
    .get(URL_EXAMPLE_IDE_FILE, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/pdf',
      },
    })
    .then((res) => {
      if (res?.data && res?.status === 200) {
        const pdfBlob = new Blob([res?.data], { type: 'application/pdf' });
        saveAs(pdfBlob, 'sample.pdf');
      }
    })
    .catch((err) => {
      notification.error({
        message: 'Error',
        description: 'Failed to download!',
      });
    });
};
