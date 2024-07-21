import { BASE_RECORD_STATES } from '../enums/common.enum';
import { TABLE_ACTIONS } from '../enums/table.enum';

export interface ITableAction {
  label: string;
  name: TABLE_ACTIONS;
}

export type IStatusOption = {
  [key in BASE_RECORD_STATES]: { label: string; class: string };
};
