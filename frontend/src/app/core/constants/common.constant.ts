import { BASE_RECORD_STATES } from '../enums/common.enum';
import { TABLE_ACTIONS } from '../enums/table.enum';
import { IStatusOption } from '../interfaces/common.interface';

export const BASE_STATES_OPTIONS: IStatusOption = {
  [BASE_RECORD_STATES.ACTIVE]: { label: 'Activo', class: 'confirmed' },
  [BASE_RECORD_STATES.INACTIVE]: { label: 'Inactivo', class: 'rejected' },
};

export const COMMON_TABLE_ACTIONS = [
  { label: 'Ver', name: TABLE_ACTIONS.VIEW },
  { label: 'Editar', name: TABLE_ACTIONS.EDIT },
  { label: 'Eliminar', name: TABLE_ACTIONS.DELETE },
];

export const PATTERNS = {
  PASSWORD: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d].{8,}$',
};

export const TEMPLATE_FILE_ROUTES = '/assets/templates/';

export const BASE_STATES_MAT_SELECT = [
  { value: 'active', viewValue: 'Activo' },
  { value: 'inactive', viewValue: 'Inactivo' },
];
