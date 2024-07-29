import { Routes } from '@angular/router';

export const MANAGEMENT_EDUCATIONAL_SPACES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./management-educational-spaces.component'),
  },
];
