export interface ITokens {
  accessToken: {
    token: string;
    expiresIn: number;
  };
  refreshToken: {
    token: string;
    expiresIn: number;
  };
}

export interface ITokenVerify {
  uid: string;
  nickname: string;
  iat: number;
  exp: number;
}
