import { BASE_RECORD_STATES } from '../../../core/enums/common.enum';
import { IBaseRecord } from '../../../core/interfaces/api-response.interface';
import { ITableAction } from '../../../core/interfaces/common.interface';

export interface IPeriod extends IBaseRecord {
  code: string;
  status: BASE_RECORD_STATES;
}

export interface IPeriodTable extends IPeriod {
  actions: ITableAction[];
}
