import { BASE_RECORD_STATES } from "../../constants/constants";
import { CareerEntity } from "./career.entity";

export class SubjectEntity {
  constructor(
    public id: string,
    public name: string,
    public code: string,
    public academicLevel: number,
    public career: CareerEntity,
    public status: BASE_RECORD_STATES,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
