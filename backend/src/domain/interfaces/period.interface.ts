import { BASE_RECORD_STATES } from "../../constants/constants";
import { IBaseRecord } from "./api-response.interface";

export interface IPeriod extends IBaseRecord {
  code: string;
  startDate: Date;
  endDate: Date;
  status: BASE_RECORD_STATES;
}
