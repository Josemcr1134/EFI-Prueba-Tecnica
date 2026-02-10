import { Injectable } from '@angular/core';
import { SessionItem } from './session.models';
import { getStoredSessions, saveStoredSessions } from './session.storage';
import { getStoredSession } from '../auth/auth.storage';

const nowIso = () => new Date().toISOString();

@Injectable({
  providedIn: 'root'
})
export class SessionsService {
  getSessions(): SessionItem[] {
    return getStoredSessions();
  }

  createSession(payload: Omit<SessionItem, 'id' | 'createdAt' | 'updatedAt' | 'createdById'>): SessionItem {
    const sessions = getStoredSessions();
    const user = getStoredSession()?.user;
    if (!user) {
      throw new Error('No hay sesión activa.');
    }

    const newSession: SessionItem = {
      ...payload,
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `session-${Date.now()}`,
      createdById: user.id,
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    saveStoredSessions([newSession, ...sessions]);
    return newSession;
  }

  updateSession(id: string, payload: Omit<SessionItem, 'id' | 'createdAt' | 'updatedAt' | 'createdById'>): SessionItem {
    const sessions = getStoredSessions();
    const index = sessions.findIndex((session) => session.id === id);
    if (index === -1) {
      throw new Error('Sesión no encontrada.');
    }

    const updated: SessionItem = {
      ...sessions[index],
      ...payload,
      updatedAt: nowIso()
    };

    const next = [...sessions];
    next[index] = updated;
    saveStoredSessions(next);
    return updated;
  }

  deleteSession(id: string): void {
    const user = getStoredSession()?.user;
    if (!user) {
      throw new Error('No hay sesión activa.');
    }

    const sessions = getStoredSessions();
    const target = sessions.find((session) => session.id === id);
    if (!target) {
      throw new Error('Sesión no encontrada.');
    }

    if (user.role !== 'admin') {
      throw new Error('No tienes permisos para eliminar sesiones.');
    }

    if (target.city.toLowerCase() !== user.city.toLowerCase()) {
      throw new Error('Solo puedes eliminar sesiones de tu misma ciudad.');
    }

    saveStoredSessions(sessions.filter((session) => session.id !== id));
  }
}
