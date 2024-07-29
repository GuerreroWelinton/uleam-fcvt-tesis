import { Routes } from '@angular/router';

export const TUTORIALS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tutorials.component'),
  },
];
