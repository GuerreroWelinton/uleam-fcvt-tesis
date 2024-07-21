import { BASE_RECORD_STATES } from "../../constants/constants";

export class PeriodEntity {
  constructor(
    public id: string,
    public code: string,
    public status: BASE_RECORD_STATES,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
