import { TABLE_ACTIONS } from '../enums/component.enum';
import { BASE_RECORD_STATES, USER_ROLES } from '../enums/general.enum';
import {
  IMatSelectOption,
  IStatusOption,
  ITableAction,
} from '../interfaces/component.interface';

export const BASE_STATES_MAT_SELECT: IMatSelectOption<string>[] = [
  { value: 'active', viewValue: 'Activo' },
  { value: 'inactive', viewValue: 'Inactivo' },
];

export const ROLE_TEXTS: { [key in USER_ROLES]: string } = {
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.SUPERVISOR]: 'Supervisor',
  [USER_ROLES.TEACHER]: 'Profesor',
  [USER_ROLES.STUDENT]: 'Estudiante',
};

export const BASE_STATES_OPTIONS: IStatusOption = {
  [BASE_RECORD_STATES.ACTIVE]: { label: 'Activo', class: 'confirmed' },
  [BASE_RECORD_STATES.INACTIVE]: { label: 'Inactivo', class: 'rejected' },
};

export const DEFAULT_PAGE_SIZE: number[] = [10, 25, 100];

export const ACTION_BUTTON_ADD: ITableAction = {
  label: 'Agregar',
  name: TABLE_ACTIONS.ADD,
};

export const ACTION_BUTTON_ADD_GROUP: ITableAction = {
  label: 'Agregar grupo',
  name: TABLE_ACTIONS.ADD_GROUP,
};

export const COMMON_TABLE_ACTIONS: {
  label: string;
  name: TABLE_ACTIONS;
}[] = [
  { label: 'Ver', name: TABLE_ACTIONS.VIEW },
  { label: 'Editar', name: TABLE_ACTIONS.EDIT },
  { label: 'Eliminar', name: TABLE_ACTIONS.DELETE },
];

export const USER_ROLES_OPTIONS: {
  value: USER_ROLES;
  viewValue: string;
  enabled: boolean;
  showForRoles: USER_ROLES[];
}[] = [
  {
    value: USER_ROLES.ADMIN,
    viewValue: 'Administrador',
    enabled: true,
    showForRoles: [USER_ROLES.ADMIN],
  },
  {
    value: USER_ROLES.SUPERVISOR,
    viewValue: 'Supervisor',
    enabled: true,
    showForRoles: [USER_ROLES.ADMIN],
  },
  {
    value: USER_ROLES.TEACHER,
    viewValue: 'Profesor',
    enabled: true,
    showForRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPERVISOR],
  },
  {
    value: USER_ROLES.STUDENT,
    viewValue: 'Estudiante',
    enabled: true,
    showForRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPERVISOR],
  },
];
