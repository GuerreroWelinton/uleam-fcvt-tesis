import { TABLE_ACTIONS } from '../enums/component.enum';
import {
  BASE_RECORD_STATES,
  BOOKING_STATES,
  USER_ROLES,
} from '../enums/general.enum';
import {
  IBookingStatusOption,
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

export const BOOKING_STATES_OPTIONS: IBookingStatusOption = {
  [BOOKING_STATES.APPROVED]: {
    label: 'Aprobado',
    color: '#2ed47e',
    class: 'pending',
  },
  [BOOKING_STATES.CONFIRMED]: {
    label: 'Completado',
    color: '#00cae3',
    class: 'confirmed',
  },
  [BOOKING_STATES.PENDING]: {
    label: 'Pendiente',
    color: '#ffb264',
    class: 'pending',
  },
  [BOOKING_STATES.REJECTED]: {
    label: 'Rechazado',
    color: '#e74c3c',
    class: 'rejected',
  },
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

export const ACTION_BUTTON_DOWNLOAD: ITableAction = {
  label: 'Descargar',
  name: TABLE_ACTIONS.DOWNLOAD,
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
  // {
  //   value: USER_ROLES.STUDENT,
  //   viewValue: 'Estudiante',
  //   enabled: true,
  //   showForRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPERVISOR],
  // },
];

//Delete this
export const BASE_LEVEL_SELECT: IMatSelectOption<string>[] = [
  { value: 'PRIMERO', viewValue: 'PRIMERO' },
  { value: 'SEGUNDO', viewValue: 'SEGUNDO' },
  { value: 'TERCERO', viewValue: 'TERCERO' },
  { value: 'CUARTO', viewValue: 'CUARTO' },
  { value: 'QUINTO', viewValue: 'QUINTO' },
  { value: 'SEXTO', viewValue: 'SEXTO' },
  { value: 'SEPTIMO', viewValue: 'SEPTIMO' },
  { value: 'OCTAVO', viewValue: 'OCTAVO' },
  { value: 'NOVENO', viewValue: 'NOVENO' },
  { value: 'DECIMO', viewValue: 'DECIMO' },
];

import { CalendarOptions } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

export const BASE_CALENDAR_OPTIONS: CalendarOptions = {
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  firstDay: 1,
  slotMinTime: '07:00:00',
  slotMaxTime: '21:00:00',
  slotDuration: '00:30:00',
  handleWindowResize: true,
  allDaySlot: false,
  locale: esLocale,
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: 'timeGridWeek,timeGridDay',
  },
  businessHours: {
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    startTime: '07:00',
    endTime: '21:00',
  },
  selectable: true,
  events: [],
};
