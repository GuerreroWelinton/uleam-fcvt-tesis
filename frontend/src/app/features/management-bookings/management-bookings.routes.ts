import { Routes } from '@angular/router';

export const MANAGEMENT_BOOKINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./management-bookings.component'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
