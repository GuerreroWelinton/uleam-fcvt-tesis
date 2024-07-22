import { TABLE_ACTIONS } from '../enums/component.enum';
import { BASE_RECORD_STATES } from '../enums/general.enum';

export interface IMatSelectOption<T> {
  value: T;
  viewValue: string;
}

export interface ITableAction {
  label: string;
  name: TABLE_ACTIONS;
}

export interface IPagination {
  page: number;
  limit: number;
}

// Types

export type IStatusOption = {
  [key in BASE_RECORD_STATES]: { label: string; class: string };
};
