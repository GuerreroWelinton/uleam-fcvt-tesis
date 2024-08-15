import { BASE_RECORD_STATES } from '../enums/general.enum';
import { IBaseRecord } from './api-response.interface';
import { ITableAction } from './component.interface';

export interface IFileUpload extends IBaseRecord {
  originalName: string;
  path: string;
  mimetype: string;
  size: number;
  recordId: string;
  status: BASE_RECORD_STATES;
}

export interface IFileUploadTable extends IFileUpload {
  actions: ITableAction[];
}
