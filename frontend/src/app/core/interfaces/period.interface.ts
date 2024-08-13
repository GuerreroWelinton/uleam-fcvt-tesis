import { BASE_RECORD_STATES } from '../enums/general.enum';
import { IBaseRecord } from './api-response.interface';
import { ITableAction } from './component.interface';

export interface IPeriod extends IBaseRecord {
  code: string;
  startDate: Date;
  endDate: Date;
  status: BASE_RECORD_STATES;
}

export interface IPeriodTable extends IPeriod {
  actions: ITableAction[];
}
