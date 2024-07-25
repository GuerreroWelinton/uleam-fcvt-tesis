import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TOKEN_EXCLUDED_ROUTES } from '../constants/general.constant';
import { TokenService } from '../services/token.service';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (TOKEN_EXCLUDED_ROUTES.some((route) => req.url.includes(route))) {
    return next(req);
  }

  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  if (tokenService.hasValidToken()) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
