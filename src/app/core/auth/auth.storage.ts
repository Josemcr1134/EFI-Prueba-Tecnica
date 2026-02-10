import { AuthSession, AuthUser } from './auth.models';

const USERS_KEY = 'efi_auth_users';
const SESSION_KEY = 'efi_auth_session';

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const getStoredUsers = (): AuthUser[] => {
  if (typeof localStorage === 'undefined') return [];
  return safeParse<AuthUser[]>(localStorage.getItem(USERS_KEY), []);
};

export const saveStoredUsers = (users: AuthUser[]): void => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getStoredSession = (): AuthSession | null => {
  if (typeof localStorage === 'undefined') return null;
  return safeParse<AuthSession | null>(localStorage.getItem(SESSION_KEY), null);
};

export const saveStoredSession = (session: AuthSession): void => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearStoredSession = (): void => {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
};
