import { Routes } from '@angular/router';
import { USER_ROLES } from './core/enums/general.enum';
import { AuthGuard, NotAuthGuard } from './core/guards/auth.guard';
import { HasRole } from './core/guards/has-role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/authentication', pathMatch: 'full' },
  {
    path: 'authentication',
    canActivate: [NotAuthGuard],
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // INICIO
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES
      ),
  },

  // SERVICIOS
  {
    path: 'bookings',
    canActivate: [AuthGuard, HasRole([USER_ROLES.TEACHER])],
    loadChildren: () =>
      import('./features/bookings/bookings.routes').then(
        (m) => m.BOOKINGS_ROUTES
      ),
  },

  // ADMINISTRACIÓN
  {
    path: 'periods',
    canActivate: [AuthGuard, HasRole([USER_ROLES.ADMIN])],
    loadChildren: () =>
      import('./features/periods/periods.routes').then((m) => m.PERIODS_ROUTES),
  },
  {
    path: 'careers',
    canActivate: [AuthGuard, HasRole([USER_ROLES.ADMIN])],
    loadChildren: () =>
      import('./features/careers/careers.routes').then((m) => m.CAREERS_ROUTES),
  },
  {
    path: 'subjects',
    canActivate: [AuthGuard, HasRole([USER_ROLES.ADMIN])],
    loadChildren: () =>
      import('./features/subjects/subjects.routes').then(
        (m) => m.SUBJECTS_ROUTES
      ),
  },
  {
    path: 'users',
    canActivate: [
      AuthGuard,
      HasRole([USER_ROLES.ADMIN, USER_ROLES.SUPERVISOR]),
    ],
    loadChildren: () =>
      import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
  },
  {
    path: 'buildings',
    canActivate: [AuthGuard, HasRole([USER_ROLES.ADMIN])],
    loadChildren: () =>
      import('./features/buildings/buildings.routes').then(
        (m) => m.BUILDINGS_ROUTES
      ),
  },
  {
    path: 'management-educational-spaces',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        './features/management-educational-spaces/management-educational-spaces.routes'
      ).then((m) => m.MANAGEMENT_EDUCATIONAL_SPACES_ROUTES),
  },
  {
    path: 'management-bookings',
    canActivate: [AuthGuard, HasRole([USER_ROLES.SUPERVISOR])],
    loadChildren: () =>
      import('./features/management-bookings/management-bookings.routes').then(
        (m) => m.MANAGEMENT_BOOKINGS_ROUTES
      ),
  },

  // AYUDA
  {
    path: 'tutorials',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/tutorials/tutorials.routes').then(
        (m) => m.TUTORIALS_ROUTES
      ),
  },

  { path: '**', redirectTo: '/authentication', pathMatch: 'full' },
];
