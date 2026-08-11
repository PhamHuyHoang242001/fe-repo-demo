import { APP_CONFIG } from 'utils/env';
import {
  getCookie,
  delCookie,
  saveCookie,
  getLocalStorageByKey,
  deleteAllLocalStorage,
  setLocalStorageByKey,
} from 'utils/helpers';

export const getAccessToken = () => {
  // return getCookie(APP_CONFIG.tokenKey) || null;
  return getLocalStorageByKey(APP_CONFIG.tokenKey) || null;
};
export const getUserInfor = () => {
  // Chuỗi rỗng / JSON hỏng → trả null thay vì ném lỗi (tránh crash Sidebar khi chưa có user).
  try {
    return JSON.parse(getLocalStorageByKey(APP_CONFIG.user)) || null;
  } catch {
    return null;
  }
};

export const getRefreshToken = () => {
  // return getCookie(APP_CONFIG.refreshToken) || null;
  return getLocalStorageByKey(APP_CONFIG.refreshToken) || null;
};

export const getAuth = () => {
  try {
    return JSON.parse(getLocalStorageByKey(APP_CONFIG.user)) || null;
  } catch {
    return null;
  }
};

export const saveToken = (accessToken: string, exdays = 1) => {
  // saveCookie({ name: APP_CONFIG.tokenKey, value: accessToken, exdays });
  setLocalStorageByKey(APP_CONFIG.tokenKey, accessToken);
};
export const saveUserInfor = (info: any, exdays = 1) => {
  // saveCookie({ name: APP_CONFIG.user, value: JSON.stringify(info), exdays });
  setLocalStorageByKey(APP_CONFIG.user, JSON.stringify(info));
};

export const saveRefreshToken = (accessToken: string, exdays = 1) => {
  // saveCookie({ name: APP_CONFIG.refreshToken, value: accessToken, exdays });
  setLocalStorageByKey(APP_CONFIG.refreshToken, accessToken);
};

export const destroyLogged = () => {
  // delCookie(APP_CONFIG.tokenKey);
  // delCookie(APP_CONFIG.refreshToken);
  // delCookie(APP_CONFIG.user);
  // localStorage.clear();
  deleteAllLocalStorage();
};

/**
 * Check Auth login App
 **/
export const isLogin = () => {
  // const token = getCookie(APP_CONFIG.tokenKey);
  // const authInfo = getCookie(APP_CONFIG.tokenKey);
  return getLocalStorageByKey(APP_CONFIG.tokenKey);
};
