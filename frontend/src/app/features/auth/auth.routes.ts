import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: SignInComponent,
  },
  // {
  //   path: 'logout',
  //   loadComponent: () => import('./logout/logout.component'),
  // },
];
