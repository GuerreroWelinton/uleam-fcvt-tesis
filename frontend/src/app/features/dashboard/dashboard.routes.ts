import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component'),
  },
];
