import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const session = authService.getSession();

  if (!session) {
    router.navigate(['/login']);
    return false;
  }

  if (session.role !== 'admin') {
    router.navigate(['/blogs']);
    return false;
  }

  return true;
};