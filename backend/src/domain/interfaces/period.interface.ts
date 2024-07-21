import { BASE_RECORD_STATES } from "../../constants/constants";
import { IBaseRecord } from "./api-response.interface";

export interface IPeriod extends IBaseRecord {
  code: string;
  status: BASE_RECORD_STATES;
}
