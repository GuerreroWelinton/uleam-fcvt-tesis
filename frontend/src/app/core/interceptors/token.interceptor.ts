import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { TOKEN_EXCLUDED_ROUTES } from '../constants/general.constant';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (TOKEN_EXCLUDED_ROUTES.some((route: string) => req.url.includes(route))) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
