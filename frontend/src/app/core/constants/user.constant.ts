import { USER_ROLES } from '../enums/user.enum';

export const ROLE_TEXTS: { [key in USER_ROLES]: string } = {
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.SUPERVISOR]: 'Supervisor',
  [USER_ROLES.TEACHER]: 'Profesor',
  [USER_ROLES.STUDENT]: 'Estudiante',
};
