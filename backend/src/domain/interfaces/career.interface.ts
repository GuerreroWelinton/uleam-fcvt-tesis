import { BASE_RECORD_STATES } from "../../constants/constants";
import { IBaseRecord } from "./api-response.interface";

export interface ICareer extends IBaseRecord {
  name: string;
  code: string;
  numberOfLevels: number;
  description: string;
  status: BASE_RECORD_STATES;
}
