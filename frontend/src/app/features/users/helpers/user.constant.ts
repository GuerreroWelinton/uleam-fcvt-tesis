import { IUser, IUserTable } from '../interfaces/user.interface';

export const DISPLAYED_COLUMNS_USERS: (keyof IUserTable)[] = [
  'name',
  'lastName',
  'email',
  'phoneNumber',
  'roles',
  'status',
  'actions',
];

export const FILE_NAME_USERS = 'Template_users.xlsx';

export const EXPECTED_HEADERS_XLSX_USERS: (keyof IUser)[] = [
  'name',
  'lastName',
  'password',
  'email',
  'phoneNumber',
];

export const USER_SCHEMA = {
  name: 'string',
  lastName: 'string',
  password: 'string',
  email: 'string',
  phoneNumber: 'string',
};

export const KEYS_TO_UPDATE_USER: (keyof IUser)[] = [
  'name',
  'lastName',
  'password',
  'phoneNumber',
  'roles',
  'status',
];
