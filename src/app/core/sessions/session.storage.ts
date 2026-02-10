import { SessionItem } from './session.models';

const SESSIONS_KEY = 'efi_sessions';

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const getStoredSessions = (): SessionItem[] => {
  if (typeof localStorage === 'undefined') return [];
  const stored = safeParse<SessionItem[]>(localStorage.getItem(SESSIONS_KEY), []);
  if (stored.length > 0) return stored;

  const now = new Date();
  const baseDate = new Date(now.getFullYear(), now.getMonth(), 5, 10, 0);
  const seed: SessionItem[] = [
    {
      id: 'seed-1',
      title: 'Formación Angular',
      description: 'Sesión práctica de arquitectura y performance.',
      category: 'Formación',
      city: 'Madrid',
      dateTime: new Date(baseDate.getTime()).toISOString(),
      status: 'draft',
      createdById: 'seed-admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'seed-2',
      title: 'Reunión estratégica',
      description: 'Revisión de objetivos trimestrales.',
      category: 'Reunión',
      city: 'Barcelona',
      dateTime: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'blocked',
      createdById: 'seed-admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'seed-3',
      title: 'Demo NovaEdge',
      description: 'Presentación del roadmap y nuevas funcionalidades.',
      category: 'Demo',
      city: 'Madrid',
      dateTime: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'hidden',
      createdById: 'seed-admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  localStorage.setItem(SESSIONS_KEY, JSON.stringify(seed));
  return seed;
};

export const saveStoredSessions = (sessions: SessionItem[]): void => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};
