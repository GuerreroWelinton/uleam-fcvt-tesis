import { Routes } from '@angular/router';
import { AuthGuard, NotAuthGuard } from './core/guards/auth.guard';
import { HasRole } from './core/guards/has-role.guard';
import { USER_ROLES } from './core/enums/general.enum';

export const routes: Routes = [
  { path: '', redirectTo: '/authentication', pathMatch: 'full' },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    canActivate: [NotAuthGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'bookings',
    loadChildren: () =>
      import('./features/bookings/bookings.routes').then(
        (m) => m.BOOKINGS_ROUTES
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'educational-spaces',
    loadChildren: () =>
      import('./features/educational-spaces/educational-spaces.routes').then(
        (m) => m.EDUCATIONAL_SPACES_ROUTES
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'materials',
    loadChildren: () =>
      import('./features/materials/materials.routes').then(
        (m) => m.MATERIALS_ROUTES
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'users',
    loadChildren: () =>
      import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
    canActivate: [AuthGuard],
  },

  //Configuración
  {
    path: 'periods',
    canActivate: [AuthGuard, HasRole([USER_ROLES.ADMIN])],
    loadChildren: () =>
      import('./features/periods/periods.routes').then((m) => m.PERIODS_ROUTES),
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

  // Ayuda
  {
    path: 'tutorials',
    loadChildren: () =>
      import('./features/tutorials/tutorials.routes').then(
        (m) => m.TUTORIALS_ROUTES
      ),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/authentication', pathMatch: 'full' },
];
