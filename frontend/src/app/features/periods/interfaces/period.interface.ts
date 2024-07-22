import { BASE_RECORD_STATES } from '../../../core/enums/general.enum';
import { IBaseRecord } from '../../../core/interfaces/api-response.interface';
import { ITableAction } from '../../../core/interfaces/component.interface';

export interface IPeriod extends IBaseRecord {
  code: string;
  status: BASE_RECORD_STATES;
}

export interface IPeriodTable extends IPeriod {
  actions: ITableAction[];
}
