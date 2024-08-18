import { Routes } from '@angular/router';
import { USER_ROLES } from '../../core/enums/general.enum';
import { HasRole } from '../../core/guards/has-role.guard';

export const MANAGEMENT_EDUCATIONAL_SPACES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [HasRole([USER_ROLES.ADMIN])],
    loadComponent: () => import('./management-educational-spaces.component'),
  },
  {
    path: ':id/:name',
    loadComponent: () => import('./components/statistics/statistics.component'),
  },
];
