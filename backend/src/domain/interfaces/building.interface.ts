import { BASE_RECORD_STATES } from "../../constants/constants";
import { IBaseRecord } from "./api-response.interface";

export interface IBuilding extends IBaseRecord {
  name: string;
  code: string;
  address: string;
  numberOfFloors: number;
  status: BASE_RECORD_STATES;
}
