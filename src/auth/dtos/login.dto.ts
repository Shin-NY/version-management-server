export interface LoginSuccessRes {
  ok: true;
  token: string;
}

export interface LoginFailRes {
  ok: false;
  error: string;
}
