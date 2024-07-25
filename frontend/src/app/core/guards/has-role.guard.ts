import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { USER_ROLES } from '../enums/general.enum';
import { TokenService } from '../services/token.service';

export function HasRole(allowedRoles: USER_ROLES[]): CanActivateFn {
  return (route, state) => {
    const tokenService = inject(TokenService);
    const router = inject(Router);

    if (tokenService.hasRole(allowedRoles)) {
      return true;
    } else {
      return router.navigate(['/dashboard']);
    }
  };
}
