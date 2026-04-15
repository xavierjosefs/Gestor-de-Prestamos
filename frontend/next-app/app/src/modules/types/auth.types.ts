export interface AuthUser {
  id: string;
  email: string;
  cedula: string;
  name: string;
  role: string;
  createdAt?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

export interface LoginResponse {
  message: string;
  data: AuthSession;
}
