import { HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, of, throwError } from 'rxjs';
import { AuthSession, AuthUser, LoginPayload, RegisterPayload } from './auth.models';
import { getStoredUsers, saveStoredUsers } from './auth.storage';

const isAdminEmail = (email: string): boolean => email.toLowerCase().endsWith('@sdi.es');

const toSession = (user: AuthUser): AuthSession => {
  const { password, ...safeUser } = user;
  const token = `mock-${btoa(`${user.email}:${Date.now()}`)}`;
  return { token, user: safeUser };
};

const buildError = (status: number, message: string) =>
  new HttpErrorResponse({
    status,
    statusText: 'Auth Error',
    error: { message }
  });

export const mockAuthInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const isLogin = req.url.endsWith('/api/auth/login');
  const isRegister = req.url.endsWith('/api/auth/register');

  if (!isLogin && !isRegister) {
    return next(req);
  }

  if (req.method !== 'POST') {
    return throwError(() => buildError(405, 'Método no permitido')).pipe(delay(200));
  }

  const users = getStoredUsers();

  if (isRegister) {
    const payload = req.body as RegisterPayload;

    if (!payload?.email || !payload?.password || !payload?.fullName || !payload?.phone || !payload?.city) {
      return throwError(() => buildError(400, 'Todos los campos son obligatorios.')).pipe(delay(300));
    }

    const existing = users.find((user) => user.email.toLowerCase() === payload.email.toLowerCase());
    if (existing) {
      return throwError(() => buildError(409, 'Este correo ya está registrado.')).pipe(delay(300));
    }

    const newUser: AuthUser = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `user-${Date.now()}`,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      city: payload.city,
      password: payload.password,
      role: isAdminEmail(payload.email) ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };

    const updated = [...users, newUser];
    saveStoredUsers(updated);

    return of(new HttpResponse({ status: 200, body: toSession(newUser) })).pipe(delay(350));
  }

  if (isLogin) {
    const payload = req.body as LoginPayload;

    if (!payload?.email || !payload?.password) {
      return throwError(() => buildError(400, 'Correo y contraseña son requeridos.')).pipe(delay(300));
    }

    const existing = users.find((user) => user.email.toLowerCase() === payload.email.toLowerCase());
    if (!existing || existing.password !== payload.password) {
      return throwError(() => buildError(401, 'Credenciales inválidas.')).pipe(delay(350));
    }

    if (!existing.city) {
      existing.city = 'Madrid';
      saveStoredUsers([...users]);
    }

    return of(new HttpResponse({ status: 200, body: toSession(existing) })).pipe(delay(350));
  }

  return next(req);
};
