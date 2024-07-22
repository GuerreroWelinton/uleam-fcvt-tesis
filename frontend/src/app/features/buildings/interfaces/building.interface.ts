import { BASE_RECORD_STATES } from '../../../core/enums/general.enum';
import { IBaseRecord } from '../../../core/interfaces/api-response.interface';
import { ITableAction } from '../../../core/interfaces/component.interface';

export interface IBuilding extends IBaseRecord {
  name: string;
  code: string;
  address: string;
  numberOfFloors: number;
  status: BASE_RECORD_STATES;
}

export interface IBuildingTable extends IBuilding {
  action: ITableAction[];
}
