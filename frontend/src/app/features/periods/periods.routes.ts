import { Routes } from '@angular/router';

export const PERIODS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./periods.component'),
  },
];
