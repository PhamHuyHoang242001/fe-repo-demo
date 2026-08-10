export interface LoginReq {
  identifier: string;
  password: string;
}

export interface IRecoverPasswordApi {
  password: string;
  confirm_password: string;
  token: string;
}
