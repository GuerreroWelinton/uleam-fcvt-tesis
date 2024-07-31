import { TABLE_ACTIONS } from '../enums/component.enum';
import { BASE_RECORD_STATES, BOOKING_STATES } from '../enums/general.enum';

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

export interface IFiles {
  name: string;
  size: string;
  // file: File;
}

export interface IFilesTable extends IFiles {
  actions: ITableAction[];
}

// Types

export type IStatusOption = {
  [key in BASE_RECORD_STATES]: { label: string; class: string };
};

export type IBookingStatusOption = {
  [key in BOOKING_STATES]: {
    label: string;
    color: string;
    class: string;
  };
};
