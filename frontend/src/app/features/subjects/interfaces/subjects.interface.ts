import { BASE_RECORD_STATES } from '../../../core/enums/common.enum';
import { IBaseRecord } from '../../../core/interfaces/api-response.interface';
import { ITableAction } from '../../../core/interfaces/common.interface';
import { ICareer } from '../../careers/interfaces/careers.interface';

export interface ISubject extends IBaseRecord {
  name: string;
  code: string;
  academicLevel: number;
  career: ICareer;
  status: BASE_RECORD_STATES;
}

export interface ISubjectTable extends ISubject {
  action: ITableAction[];
}
