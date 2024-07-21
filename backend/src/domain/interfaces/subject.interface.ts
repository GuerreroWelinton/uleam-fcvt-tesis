import { BASE_RECORD_STATES } from "../../constants/constants";
import { IBaseRecord } from "./api-response.interface";
import { ICareer } from "./career.interface";

export interface ISubject extends IBaseRecord {
  name: string;
  code: string;
  academicLevel: number;
  career: ICareer;
  status: BASE_RECORD_STATES;
}
