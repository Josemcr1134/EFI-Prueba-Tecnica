export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  role: UserRole;
  password: string;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: Omit<AuthUser, 'password'>;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  password: string;
}
