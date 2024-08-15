import { BASE_RECORD_STATES } from "../../constants/constants";
import { IBaseRecord } from "./api-response.interface";

export interface IFileUpload extends IBaseRecord {
  originalName: string;
  path: string;
  mimetype: string;
  size: number;
  recordId: string;
  status: BASE_RECORD_STATES;
}
