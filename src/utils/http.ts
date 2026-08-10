import axios, { AxiosRequestConfig } from 'axios';

import { notification } from 'antd';

import { KEY_API_FAIL, STATUS_CODE_SUCCESS } from 'store/common/constants';

import { APP_CONFIG } from './env';
import { getAccessToken, getRefreshToken, saveToken, saveRefreshToken, destroyLogged } from './jwt';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { ERROR_CODE, StatusCodeEnum } from '../types/api';

interface TypeObjKey {
  [key: string]: any;
}

interface IError {
  status: number;
  message: string;
}

const DEFAULT_HEADERS: TypeObjKey = { 'Content-Type': 'application/json' };
// axios.defaults.credentials = 'include';

function getAuthToken(token: string | null) {
  return `Bearer ${token}`;
}

function getBasicToken(token: string | null) {
  return `Basic ${token}`;
}

axios.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = getAccessToken();
  if (request.headers) {
    request.headers['Authorization'] = token ? getAuthToken(token) : getBasicToken(APP_CONFIG.appApiKey);
  } else {
    request.headers = {
      Authorization: token ? getAuthToken(token) : getBasicToken(APP_CONFIG.appApiKey),
    };
  }

  return request;
});

const refreshAuthLogic = async () => {
  const refresh_token = getRefreshToken();

  if (refresh_token) {
    try {
      const { data } = await axios.post(`${APP_CONFIG.apiUrl}/custom-auth/refresh-token`, {
        refreshToken: refresh_token,
      });

      const { accessToken, refreshToken } = data?.data;

      if (accessToken) saveToken(accessToken);
      if (refreshToken) saveRefreshToken(refreshToken);

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      return Promise.resolve();
    } catch (error) {
      console.error('Error refreshing token:', error);
      await destroyLogged();
      window.location.href = '/login';
      return Promise.reject(error);
    }
  }
  await destroyLogged();
  window.location.href = '/login';
  return Promise.reject();
};

// Tạo interceptor làm mới token
createAuthRefreshInterceptor(axios, refreshAuthLogic, {
  shouldRefresh: (error) => {
    if (error?.status === 401 && error.config?.url?.includes('api/custom-auth/refresh-token')) {
      destroyLogged();
      window.location.href = '/login';
    }
    return error.status !== 200;
  },
});

class HttpService {
  constructor() {
    // Set Header Auth for all APi
  }

  configRequest(multipart = false, optionsFile: any = {}) {
    let defaultHeaders = DEFAULT_HEADERS;
    // Set header for file
    if (multipart) {
      defaultHeaders = {};
    }
    if (getAccessToken()) {
      defaultHeaders = {
        Authorization: `Bearer ${getAccessToken()}`,
        Accept: 'application/json',
        Cache: 'no-cache',
        common: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        ...defaultHeaders,
      };
    }
    return {
      headers: defaultHeaders,
      ...optionsFile,
    };
  }

  querySearch(params: TypeObjKey = {}): string {
    return Object.keys(params)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&');
  }

  get(apiEndpoint: string, params = {}): Promise<any> {
    if (Object.keys(params).length > 0) {
      apiEndpoint = `${apiEndpoint}?${this.querySearch(params)}`;
    }
    return axios.get(APP_CONFIG.apiUrl + apiEndpoint).then(
      (res) => {
        if (res?.data && res?.status === STATUS_CODE_SUCCESS) {
          return res?.data;
        }
      },
      (err) => {
        this.handleErorr(err?.response?.data);
      },
    );
  }

  post(apiEndpoint: string, payload: any, timeout?: any): Promise<any> {
    const config = {
      timeout,
    };
    return axios.post(APP_CONFIG.apiUrl + apiEndpoint, payload, config).then(
      (res) => {
        if (res?.data && res?.status === STATUS_CODE_SUCCESS) {
          return res?.data?.data ? res?.data?.data : res?.data;
        }
      },
      (err) => {
        this.handleErorr(err?.response?.data?.error);
      },
    );
  }

  put(apiEndpoint: string, payload: any): Promise<any> {
    return axios.put(APP_CONFIG.apiUrl + apiEndpoint, payload).then(
      (res) => {
        if (res?.data && res?.status === STATUS_CODE_SUCCESS) {
          return res?.data?.data ? res?.data?.data : res?.data;
        }
      },
      (err) => {
        this.handleErorr(err?.response?.data);
      },
    );
  }

  delete(apiEndpoint: string): Promise<any> {
    return axios.delete(APP_CONFIG.apiUrl + apiEndpoint).then(
      (res) => {
        if (res?.data && res?.status === STATUS_CODE_SUCCESS) {
          return res?.data?.data ? res?.data?.data : res?.data;
        }
      },
      (err) => {
        this.handleErorr(err?.response?.data);
      },
    );
  }

  deleteMulti(apiEndpoint: string, payload: number[]): Promise<any> {
    return axios.delete(APP_CONFIG.apiUrl + apiEndpoint, { data: { ids: payload } }).then(
      (res) => {
        if (res?.data && res?.status === STATUS_CODE_SUCCESS) {
          return res?.data?.data ? res?.data?.data : res?.data;
        }
      },
      (err) => {
        this.handleErorr(err?.response?.data);
      },
    );
  }

  async uploadFile(apiEndpoint: string, fileData: any, settingOptions: any, isMap = false): Promise<any> {
    // if (!this.errorAuth) {
    if (!fileData) {
      notification['error']({
        message: 'You have not selected a file to upload',
      });
      return;
    }
    let formData = fileData;
    if (isMap) {
      formData = await this.mapFilePayload(fileData);
    }
    if (formData) {
      return axios.post(APP_CONFIG.apiUrl + apiEndpoint, formData, this.configRequest(true, settingOptions)).then(
        (res: any) => {
          if (res?.data && res?.data?.status === KEY_API_FAIL) {
            this.handleErorr(res?.data?.errors);
            return;
          }
          return res?.data?.data;
        },
        (err) => {
          this.handleErorr(err?.response);
        },
      );
    }
    // } else {
    //   return false;
    // }
  }

  mapFilePayload(data) {
    const formData = new FormData();
    Object.keys(data).map(function (key) {
      formData.append(key, data[key]);
    });
    return formData;
  }

  async handleErorr(error: IError) {
    let textErr = error?.message;

    switch (error?.status) {
      case StatusCodeEnum['Bad Request']:
        textErr = ERROR_CODE[error?.message as keyof typeof ERROR_CODE] || error?.message;
        break;
      case StatusCodeEnum['Unauthorized']:
        textErr = error?.message;
        break;
      case StatusCodeEnum['Forbidden']:
        textErr = 'Forbidden';
        break;
      case StatusCodeEnum['Internal Server Error']:
        textErr = ERROR_CODE['ERROR'];
        break;
      case undefined:
        textErr = ERROR_CODE['ERROR'];
        break;
    }

    notification.error({
      message: 'Try again',
      description: textErr,
    });
  }
}
export default new HttpService();
