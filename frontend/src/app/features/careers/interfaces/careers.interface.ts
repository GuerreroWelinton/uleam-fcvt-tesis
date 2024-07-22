import { BASE_RECORD_STATES } from '../../../core/enums/general.enum';
import { IBaseRecord } from '../../../core/interfaces/api-response.interface';
import { ITableAction } from '../../../core/interfaces/component.interface';

export interface ICareer extends IBaseRecord {
  name: string;
  code: string;
  numberOfLevels: number;
  description: string;
  status: BASE_RECORD_STATES;
}

export interface ICareerTable extends ICareer {
  action: ITableAction[];
}
