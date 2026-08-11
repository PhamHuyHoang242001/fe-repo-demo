/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoginReq, IRecoverPasswordApi } from 'types/login';
import HttpService from 'utils/http';

export const loginApi = (payload: LoginReq): Promise<any> => {
  return HttpService.post('/auth/login', { ...payload });
};

// Login chỉ trả token → gọi endpoint này (Bearer) để lấy hồ sơ user (email, ...).
export const fetchProfileApi = (): Promise<any> => {
  return HttpService.get('/auth/fetch-profile');
};

export const sendCodeApi = (email: string): Promise<any> => {
  return HttpService.post('/admin/forgot-password', { email });
};

export const verifyCodeApi = (email: string, otp: string): Promise<any> => {
  return HttpService.put('/auth/verify-code-forgot-password', { email, otp });
};

export const recoverPasswordApi = (value: IRecoverPasswordApi): Promise<any> => {
  return HttpService.put('/admin/recover-password', { ...value });
};

export const logoutApi = (accessToken: string): Promise<any> => {
  return HttpService.post('/custom-auth/logout', { accessToken: accessToken });
};
