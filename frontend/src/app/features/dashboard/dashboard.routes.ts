import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component'),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
