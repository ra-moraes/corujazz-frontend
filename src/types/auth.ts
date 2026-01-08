export interface User {
  role: string;
  email?: string;
}

export interface LoginResponse {
  access_token: string;
  role: string;
}