import { Routes } from '@angular/router';
// import { LogoutComponent } from '../../daxa/authentication/logout/logout.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./sign-in/sign-in.component'),
  },
  // {
  //   path: 'logout',
  //   loadComponent: () => import('./logout/logout.component'),
  // },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
