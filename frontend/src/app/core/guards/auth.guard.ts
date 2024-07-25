import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.hasValidToken()) {
    return true;
  } else {
    return router.navigate(['/authentication']);
  }
};

export const NotAuthGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);

  const router = inject(Router);

  if (tokenService.hasValidToken()) {
    return router.navigate(['/dashboard']);
  } else {
    return true;
  }
};
