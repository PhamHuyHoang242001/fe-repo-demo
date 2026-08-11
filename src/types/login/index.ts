export interface LoginReq {
  email: string;
  password: string;
}

export interface IRecoverPasswordApi {
  password: string;
  confirm_password: string;
  token: string;
}
