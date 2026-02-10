import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { getStoredSession } from './auth.storage';

const isAuthenticated = () => !!getStoredSession()?.token;

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  return isAuthenticated() ? true : router.parseUrl('/auth/login');
};

export const authChildGuard: CanActivateChildFn = () => {
  const router = inject(Router);
  return isAuthenticated() ? true : router.parseUrl('/auth/login');
};

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const session = getStoredSession();
  if (!session?.token) {
    return router.parseUrl('/auth/login');
  }
  return session.user.role === 'admin' ? true : router.parseUrl('/dashboard/sessions');
};
