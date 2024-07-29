import { Routes } from '@angular/router';

export const EDUCATIONAL_SPACES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./educational-spaces.component'),
  },
];
