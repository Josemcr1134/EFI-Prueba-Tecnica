import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthSession, LoginPayload, RegisterPayload } from './auth.models';
import { clearStoredSession, getStoredSession, saveStoredSession } from './auth.storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  login(payload: LoginPayload): Observable<AuthSession> {
    return this.http.post<AuthSession>('/api/auth/login', payload).pipe(
      tap((session) => saveStoredSession(session))
    );
  }

  register(payload: RegisterPayload): Observable<AuthSession> {
    return this.http.post<AuthSession>('/api/auth/register', payload).pipe(
      tap((session) => saveStoredSession(session))
    );
  }

  logout(): void {
    clearStoredSession();
  }

  getSession(): AuthSession | null {
    return getStoredSession();
  }

  isAuthenticated(): boolean {
    return !!this.getSession()?.token;
  }
}
